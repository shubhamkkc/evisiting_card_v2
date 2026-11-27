import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// Server-side signup. Supabase's client-side signUp deliberately returns a
// fake 200 success (no error, no email) when the address is already
// registered, so the page can never tell from the signUp response alone
// whether the account exists — a registered user just lands on the OTP step
// and waits for a code that never arrives. This route checks auth.users
// first: a confirmed account gets { alreadyRegistered: true } and the page
// sends the user to /login with their email pre-filled.
export async function POST(req: Request) {
  const { email, password } = await req.json().catch(
    () => ({} as { email?: unknown; password?: unknown })
  );
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    password.length < 6
  ) {
    return NextResponse.json(
      { error: "A valid email and a password of at least 6 characters are required." },
      { status: 400 }
    );
  }

  // Best-effort existence check: if the lookup itself fails, fall through
  // to the normal signUp path instead of breaking signup for everyone.
  try {
    const existing = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1 FROM auth.users
        WHERE lower(email) = lower(${email})
        AND email_confirmed_at IS NOT NULL
      ) AS "exists"
    `;
    if (existing[0]?.exists) {
      return NextResponse.json({ alreadyRegistered: true });
    }
  } catch {
    // Fall through to signUp below.
  }

  const supabase = await createClient();
  let signup: Awaited<ReturnType<typeof supabase.auth.signUp>>;
  try {
    signup = await Promise.race([
      supabase.auth.signUp({ email, password }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Signup timed out. Please try again.")),
          15000
        )
      ),
    ]);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Signup failed. Please try again." },
      { status: 504 }
    );
  }

  const { data, error } = signup;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Email confirmation disabled on the project → already signed in.
  if (data.session) {
    return NextResponse.json({ session: true });
  }
  return NextResponse.json({ needsOtp: true });
}
