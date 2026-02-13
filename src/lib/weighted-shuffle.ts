import type { GalleryPhoto } from "./gallery-data";

export function weightedRandomSubset(
  photos: GalleryPhoto[],
  count: number,
  heartCounts: Record<string, number>,
  commentCounts: Record<string, number>,
  shuffleCount: number
): GalleryPhoto[] {
  const biasFactor = 1 / (shuffleCount + 1);
  const items = photos.map((photo) => {
    const hearts = heartCounts[photo.publicId] || 0;
    const comments = commentCounts[photo.publicId] || 0;
    const weight = 1 + (hearts + comments) * biasFactor;
    return { photo, weight };
  });

  const selected: GalleryPhoto[] = [];
  const remaining = [...items];

  for (let i = 0; i < Math.min(count, remaining.length); i++) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (let j = 0; j < remaining.length; j++) {
      random -= remaining[j].weight;
      if (random <= 0) {
        selected.push(remaining[j].photo);
        remaining.splice(j, 1);
        break;
      }
    }
  }

  return selected;
}
