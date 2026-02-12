import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually since this runs outside Next.js
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1);
    process.env[key] = value;
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface GalleryResource {
  publicId: string;
  width: number;
  height: number;
  resourceType: "image" | "video";
  format: string;
}

const OUTPUT_FILE = path.resolve(__dirname, "../src/lib/gallery-data.ts");

// Exclude Cloudinary sample assets
const EXCLUDE_PREFIX = "samples/";

async function fetchAll(resourceType: "image" | "video"): Promise<GalleryResource[]> {
  const results: GalleryResource[] = [];
  let nextCursor: string | undefined;

  do {
    const response: Record<string, unknown> = await cloudinary.api.resources({
      type: "upload",
      resource_type: resourceType,
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    const resources = response.resources as Array<{
      public_id: string;
      width: number;
      height: number;
      format: string;
    }>;

    for (const r of resources) {
      if (r.public_id.startsWith(EXCLUDE_PREFIX)) continue;
      results.push({
        publicId: r.public_id,
        width: r.width,
        height: r.height,
        resourceType,
        format: r.format,
      });
    }

    nextCursor = response.next_cursor as string | undefined;
  } while (nextCursor);

  return results;
}

async function main() {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error(
      "Missing Cloudinary credentials. Create .env.local with:\n" +
      "  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...\n" +
      "  CLOUDINARY_API_KEY=...\n" +
      "  CLOUDINARY_API_SECRET=..."
    );
    process.exit(1);
  }

  console.log("Fetching all resources from Cloudinary...");

  const [images, videos] = await Promise.all([
    fetchAll("image"),
    fetchAll("video"),
  ]);

  const all = [...images, ...videos].sort((a, b) =>
    a.publicId.localeCompare(b.publicId)
  );

  console.log(`Found ${images.length} images, ${videos.length} videos (${all.length} total)`);

  const output = `export interface GalleryPhoto {
  publicId: string;
  width: number;
  height: number;
  resourceType: 'image' | 'video';
  format: string;
}

export const galleryPhotos: GalleryPhoto[] = ${JSON.stringify(all, null, 2)};

export const validPhotos = galleryPhotos.filter(
  (p) => p.width > 640 && p.height > 640
);
`;

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`Wrote ${all.length} resources to ${OUTPUT_FILE}`);
}

main().catch(console.error);
