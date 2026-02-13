import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { ensureUserIdentity } from "@/lib/user-identity";

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // No body or invalid JSON
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── Duration update (has id + durationMs, no screenWidth) ──
  if (typeof body.id === "string" && typeof body.durationMs === "number") {
    const update: Record<string, unknown> = {};
    if (body.durationMs > 0) {
      update.duration_ms = Math.round(body.durationMs as number);
    }
    if (typeof body.engagedDurationMs === "number" && body.engagedDurationMs > 0) {
      update.engaged_duration_ms = Math.round(body.engagedDurationMs as number);
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase
      .from("page_views")
      .update(update)
      .eq("id", body.id);

    if (error) {
      console.error("Failed to update page view duration:", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // ── New page view insert ──
  const user = await ensureUserIdentity();

  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;

  const row: Record<string, unknown> = {
    user_id: user.id,
    username: user.username,
    path: typeof body.path === "string" ? body.path : "/",
    referrer: request.headers.get("referer") || null,
    user_agent: request.headers.get("user-agent") || null,
    ip_address: ip,
    city: request.headers.get("x-vercel-ip-city") || null,
    region: request.headers.get("x-vercel-ip-country-region") || null,
    country: request.headers.get("x-vercel-ip-country") || null,
    latitude: parseFloat(request.headers.get("x-vercel-ip-latitude") || "") || null,
    longitude: parseFloat(request.headers.get("x-vercel-ip-longitude") || "") || null,
    screen_width: typeof body.screenWidth === "number" ? body.screenWidth : null,
    screen_height: typeof body.screenHeight === "number" ? body.screenHeight : null,
    viewport_width: typeof body.viewportWidth === "number" ? body.viewportWidth : null,
    viewport_height: typeof body.viewportHeight === "number" ? body.viewportHeight : null,
    timezone: typeof body.timezone === "string" ? body.timezone : null,
    language: typeof body.language === "string" ? body.language : null,
    color_scheme: typeof body.colorScheme === "string" ? body.colorScheme : null,
    connection_type: typeof body.connectionType === "string" ? body.connectionType : null,
    session_id: typeof body.sessionId === "string" ? body.sessionId : null,
  };

  // Client supplies the row ID so it can send duration updates later
  if (typeof body.id === "string") {
    row.id = body.id;
  }

  const { error } = await supabase.from("page_views").insert(row);

  if (error) {
    console.error("Failed to insert page view:", error);
    return NextResponse.json({ error: "Failed to log view" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
