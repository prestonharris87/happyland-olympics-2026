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

interface PhotoResult {
  publicId: string;
  width: number;
  height: number;
}

const PHOTOS_DIR = path.resolve(__dirname, "../../photos");
const OUTPUT_FILE = path.resolve(__dirname, "../src/lib/gallery-data.ts");
const FOLDER = "happyland-2025";
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"]);
const CONCURRENCY = 5;

async function main() {
  // Validate config
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error(
      "Missing Cloudinary credentials. Create .env.local with:\n" +
      "  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...\n" +
      "  CLOUDINARY_API_KEY=...\n" +
      "  CLOUDINARY_API_SECRET=..."
    );
    process.exit(1);
  }

  // Read all photo files
  const files = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return EXTENSIONS.has(ext);
    })
    .sort();

  console.log(`Found ${files.length} photos in ${PHOTOS_DIR}`);

  const results: PhotoResult[] = [];
  let completed = 0;

  // Upload in batches for rate limiting
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const uploads = batch.map(async (file) => {
      const filePath = path.join(PHOTOS_DIR, file);
      const publicId = `${FOLDER}/${path.parse(file).name}`;

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          resource_type: "image",
          overwrite: false,
          unique_filename: false,
        });
        completed++;
        console.log(`[${completed}/${files.length}] Uploaded: ${file}`);
        return {
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        };
      } catch (err: unknown) {
        // If already exists, try to get info
        try {
          const existing = await cloudinary.api.resource(publicId);
          completed++;
          console.log(`[${completed}/${files.length}] Already exists: ${file}`);
          return {
            publicId: existing.public_id,
            width: existing.width,
            height: existing.height,
          };
        } catch {
          completed++;
          console.error(`[${completed}/${files.length}] FAILED: ${file}`, err);
          return null;
        }
      }
    });

    const batchResults = await Promise.all(uploads);
    for (const r of batchResults) {
      if (r) results.push(r);
    }
  }

  // Write gallery-data.ts
  const output = `export interface GalleryPhoto {
  publicId: string;
  width: number;
  height: number;
}

export const galleryPhotos: GalleryPhoto[] = ${JSON.stringify(results, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`\nDone! Wrote ${results.length} photos to ${OUTPUT_FILE}`);
}

main().catch(console.error);
