export interface EngagementData {
  heartCounts: Record<string, number>;
  commentCounts: Record<string, number>;
  userHearts: string[];
  userId: string;
  username: string;
}

export interface CommentData {
  id: string;
  username: string;
  body: string;
  created_at: string;
}

export async function fetchEngagement(): Promise<EngagementData> {
  const res = await fetch("/api/engagement");
  if (!res.ok) throw new Error("Failed to fetch engagement");
  return res.json();
}

export async function toggleHeart(
  mediaId: string
): Promise<{ hearted: boolean; heartCount: number }> {
  const res = await fetch("/api/hearts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaId }),
  });
  if (!res.ok) throw new Error("Failed to toggle heart");
  return res.json();
}

export async function fetchComments(
  mediaId: string
): Promise<{ comments: CommentData[] }> {
  const res = await fetch(`/api/comments/${encodeURIComponent(mediaId)}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function postComment(
  mediaId: string,
  body: string
): Promise<{ comment: CommentData; commentCount: number }> {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaId, body }),
  });
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();
}

export async function subscribeTextAlerts(
  phone: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/text-alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return data;
}
