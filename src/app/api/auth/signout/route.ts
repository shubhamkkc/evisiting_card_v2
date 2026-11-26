// GET /api/auth/signout — signs the user out of Supabase Auth and sends
// them to the login page. Kept as a GET so existing header logout links
// (href="/api/auth/signout") keep working.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url));
}
