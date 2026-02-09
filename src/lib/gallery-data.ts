export interface GalleryPhoto {
  publicId: string;
  width: number;
  height: number;
}

// This file will be populated by scripts/upload-photos.ts after running the Cloudinary upload.
// For now, it contains an empty array. Run `npx tsx scripts/upload-photos.ts` to populate.
export const galleryPhotos: GalleryPhoto[] = [];
