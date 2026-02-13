import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { ensureUserIdentity } from "@/lib/user-identity";

export async function GET() {
  const user = await ensureUserIdentity();
  const supabase = getSupabase();

  const [heartsResult, commentsResult, userHeartsResult] = await Promise.all([
    supabase
      .from("hearts")
      .select("media_id")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        for (const row of data ?? []) {
          counts[row.media_id] = (counts[row.media_id] || 0) + 1;
        }
        return counts;
      }),
    supabase
      .from("comments")
      .select("media_id")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        for (const row of data ?? []) {
          counts[row.media_id] = (counts[row.media_id] || 0) + 1;
        }
        return counts;
      }),
    supabase
      .from("hearts")
      .select("media_id")
      .eq("user_id", user.id)
      .then(({ data }) => (data ?? []).map((r) => r.media_id)),
  ]);

  return NextResponse.json({
    heartCounts: heartsResult,
    commentCounts: commentsResult,
    userHearts: userHeartsResult,
    userId: user.id,
    username: user.username,
  });
}
