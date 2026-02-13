import type { GalleryPhoto } from "./gallery-data";

export function weightedRandomSubset(
  photos: GalleryPhoto[],
  count: number,
  heartCounts: Record<string, number>,
  commentCounts: Record<string, number>,
  shuffleCount: number,
  excludeIds?: Set<string>
): GalleryPhoto[] {
  // Filter out already-seen items
  let pool = excludeIds
    ? photos.filter((p) => !excludeIds.has(p.publicId))
    : photos;

  // If not enough unseen items, use full pool
  if (pool.length < count) {
    pool = photos;
  }

  // Bias diminishes: 10x on first shuffle, 5x on second, ~3.3x on third, etc.
  const biasFactor = 10 / (shuffleCount + 1);

  const items = pool.map((photo) => {
    const hearts = heartCounts[photo.publicId] || 0;
    const comments = commentCounts[photo.publicId] || 0;
    const engagement = hearts * 2 + comments * 4;
    // Engaged items get a strong multiplier; unengaged stay at 1
    const weight = engagement > 0 ? 1 + engagement * biasFactor : 1;
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
