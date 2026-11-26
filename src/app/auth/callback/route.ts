// Email-link fallback for Supabase Auth: exchanges the ?code= in the
// confirmation email for a session, then redirects by role.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const session = await getSession();
      if (session?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin/dashboard`);
      }
      if (session?.role === "owner") {
        return NextResponse.redirect(`${origin}/owner/dashboard`);
      }
      return NextResponse.redirect(`${origin}/owner/create`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm`);
}
