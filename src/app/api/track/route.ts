import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Privacy-friendly click analytics (Theme 6 engagement tracking).
// Body: { slug, type } — e.g. youtube_click, google_review_click.
// Stores business + event type + timestamp only. No IP, no user agent,
// no personal data. Safe to call via navigator.sendBeacon (no response
// body is read). Unknown slugs/types are ignored, never error.
const ALLOWED_TYPES = new Set([
  "youtube_click",
  "instagram_click",
  "facebook_click",
  "whatsapp_click",
  "twitter_click",
  "linkedin_click",
  "telegram_click",
  "tiktok_click",
  "snapchat_click",
  "google_review_click",
  "save_contact_click",
  "maps_click",
  "website_click",
  "call_click",
  "email_click",
  "pwa_install",
  "share_click",
  "enquiry_click",
]);

export async function POST(request: Request) {
  try {
    const { slug, type } = await request.json();
    if (!slug || !type || !ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!business) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }
    await prisma.businessEvent.create({
      data: { businessId: business.id, type },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Analytics must never break the page — swallow errors silently.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
