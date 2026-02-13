import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { normalizeUSPhone } from "@/lib/phone";
import { ensureUserIdentity } from "@/lib/user-identity";

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { phone } = body;

  if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const phoneE164 = normalizeUSPhone(phone);
  if (!phoneE164) {
    return NextResponse.json(
      { error: "Please enter a valid US phone number" },
      { status: 400 }
    );
  }

  const user = await ensureUserIdentity();

  const { error } = await supabase
    .from("text_alert_subscriptions")
    .insert({
      phone: phone.trim(),
      phone_e164: phoneE164,
      user_id: user.id,
      username: user.username,
    });

  if (error) {
    // Postgres unique violation — duplicate phone
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This phone number is already signed up!" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
