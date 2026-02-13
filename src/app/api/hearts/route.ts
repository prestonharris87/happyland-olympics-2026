import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { ensureUserIdentity } from "@/lib/user-identity";

export async function POST(request: NextRequest) {
  const user = await ensureUserIdentity();
  const supabase = getSupabase();
  const { mediaId } = await request.json();

  if (!mediaId || typeof mediaId !== "string") {
    return NextResponse.json({ error: "mediaId required" }, { status: 400 });
  }

  // Check if already hearted
  const { data: existing } = await supabase
    .from("hearts")
    .select("id")
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .maybeSingle();

  if (existing) {
    // Remove heart
    await supabase.from("hearts").delete().eq("id", existing.id);
  } else {
    // Add heart
    await supabase
      .from("hearts")
      .insert({ media_id: mediaId, user_id: user.id });
  }

  // Get updated count
  const { count } = await supabase
    .from("hearts")
    .select("*", { count: "exact", head: true })
    .eq("media_id", mediaId);

  return NextResponse.json({
    hearted: !existing,
    heartCount: count ?? 0,
  });
}
