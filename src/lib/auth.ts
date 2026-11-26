// Session + role helpers for Supabase Auth (replaces NextAuth).
// Roles: "admin" (email matches ADMIN_EMAIL), "owner" (has a Business),
// "user" (signed in but no business yet — needs /owner/create).
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type SessionInfo = {
  user: { id: string; email: string };
  role: "admin" | "owner" | "user";
  businessId: string | null;
};

export function isAdminEmail(email: string | undefined | null): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@evisitingcard.com";
  return !!email && email.toLowerCase() === adminEmail.toLowerCase();
}

export async function getSession(): Promise<SessionInfo | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  if (isAdminEmail(user.email)) {
    return {
      user: { id: user.id, email: user.email },
      role: "admin",
      businessId: null,
    };
  }

  // Link by authUserId first, then by ownerEmail. The email match auto-links
  // businesses created before the Supabase Auth switch on the owner's first
  // sign-in — the email OTP proves they own that inbox. One query instead
  // of two sequential lookups (each pooler round-trip costs ~1s on a cold
  // function, which is what made login feel slow).
  let business = await prisma.business.findFirst({
    where: { OR: [{ authUserId: user.id }, { ownerEmail: user.email }] },
  });

  if (business && !business.authUserId) {
    business = await prisma.business.update({
      where: { id: business.id },
      data: { authUserId: user.id },
    });
  }

  if (!business) {
    return {
      user: { id: user.id, email: user.email },
      role: "user",
      businessId: null,
    };
  }

  return {
    user: { id: user.id, email: user.email },
    role: "owner",
    businessId: business.id,
  };
}
