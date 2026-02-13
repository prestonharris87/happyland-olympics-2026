import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { ensureUserIdentity } from "@/lib/user-identity";

export async function POST(request: NextRequest) {
  const user = await ensureUserIdentity();
  const supabase = getSupabase();

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // No body or invalid JSON — that's fine, we still log the view
  }

  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;

  const { error } = await supabase.from("page_views").insert({
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
  });

  if (error) {
    console.error("Failed to insert page view:", error);
    return NextResponse.json({ error: "Failed to log view" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
