import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { ensureUserIdentity } from "@/lib/user-identity";

export async function POST(request: NextRequest) {
  const user = await ensureUserIdentity();
  const supabase = getSupabase();
  const { mediaId, body } = await request.json();

  if (!mediaId || typeof mediaId !== "string") {
    return NextResponse.json({ error: "mediaId required" }, { status: 400 });
  }

  if (!body || typeof body !== "string" || body.trim().length === 0) {
    return NextResponse.json({ error: "body required" }, { status: 400 });
  }

  if (body.length > 500) {
    return NextResponse.json({ error: "body max 500 chars" }, { status: 400 });
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      media_id: mediaId,
      user_id: user.id,
      username: user.username,
      body: body.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get updated count
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("media_id", mediaId);

  return NextResponse.json({
    comment,
    commentCount: count ?? 0,
  });
}
