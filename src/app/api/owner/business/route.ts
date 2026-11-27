import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPlanLimits, parseJsonArray } from "@/lib/plan";

// Fields an owner is NOT allowed to change — "plan" is here so an owner
// can never self-upgrade to "paid" by sending plan:"paid" in a PUT body;
// only an admin can change the plan (after payment).
const ADMIN_ONLY_FIELDS = ["isActive", "ownerEmail", "ownerPassword", "slug", "id", "createdAt", "updatedAt", "plan"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// POST /api/owner/business — self-serve: a signed-in user creates their
// first (and only) business card. Plan is "free", theme is Theme 1
// (the only free theme — see src/lib/plan.ts).
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "admin") {
      return NextResponse.json(
        { error: "Admins create cards from the admin dashboard." },
        { status: 400 }
      );
    }
    if (session.businessId) {
      return NextResponse.json(
        { error: "You already have a card." },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const businessName = (body?.businessName ?? "").trim();
    const phone = (body?.phone ?? "").trim();
    let slug = slugify(body?.slug ?? businessName);

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Phone is required." }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ error: "Card link is required." }, { status: 400 });
    }
    if (slug.length < 3) {
      return NextResponse.json(
        { error: "Card link must be at least 3 characters." },
        { status: 400 }
      );
    }

    // Ensure a unique slug (append -2, -3, ... when taken).
    let candidate = slug;
    let n = 2;
    while (await prisma.business.findUnique({ where: { slug: candidate } })) {
      candidate = `${slug}-${n++}`;
    }
    slug = candidate;

    const business = await prisma.business.create({
      data: {
        slug,
        businessName,
        ownerName: (body?.ownerName ?? "").trim() || null,
        phone,
        email: session.user.email,
        ownerEmail: session.user.email,
        authUserId: session.user.id,
        category: (body?.category ?? "").trim() || null,
        plan: "free",
        theme: "theme1",
        isActive: true,
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    const role = session?.role;
    const businessId = session?.businessId;

    if (!session || role !== "owner" || !businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    const role = session?.role;
    const businessId = session?.businessId;

    if (!session || role !== "owner" || !businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Strip admin-only fields that owners cannot modify
    const safeData: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!ADMIN_ONLY_FIELDS.includes(key)) {
        safeData[key] = value;
      }
    }

    // Free-tier limits, enforced server-side (the form caps are UI only).
    // Only *adding* beyond a limit is blocked, so a business that already
    // has more (e.g. a demo card) can still save while trimming down.
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    const limits = getPlanLimits(business.plan);
    const paidNote = " Upgrade to Paid (₹499/year) to unlock it.";
    try {
      if (safeData.theme && !limits.themes.includes(safeData.theme) && safeData.theme !== business.theme) {
        return NextResponse.json({ error: `This theme is a Paid feature.${paidNote}` }, { status: 400 });
      }
      if (safeData.gallery) {
        const gallery = parseJsonArray(safeData.gallery);
        const existing = parseJsonArray(business.gallery).length;
        if (gallery.length > limits.maxGallery && gallery.length > existing) {
          return NextResponse.json({ error: `Free plan allows up to ${limits.maxGallery} gallery images.${paidNote}` }, { status: 400 });
        }
      }
      if (safeData.services) {
        const services = parseJsonArray(safeData.services);
        const existing = parseJsonArray(business.services).length;
        if (services.length > limits.maxServices && services.length > existing) {
          return NextResponse.json({ error: `Free plan allows up to ${limits.maxServices} services.${paidNote}` }, { status: 400 });
        }
      }
      if (safeData.socialLinks) {
        const links = parseJsonArray(safeData.socialLinks);
        const existing = parseJsonArray(business.socialLinks).length;
        if (links.length > limits.maxSocialLinks && links.length > existing) {
          return NextResponse.json({ error: `Free plan allows up to ${limits.maxSocialLinks} social links.${paidNote}` }, { status: 400 });
        }
      }
      if (!limits.coverPhoto && safeData.coverPhoto && safeData.coverPhoto !== business.coverPhoto) {
        return NextResponse.json({ error: `Cover photo is a Paid feature.${paidNote}` }, { status: 400 });
      }
      if (!limits.googleReviewWidget && safeData.googleReviewWidget && safeData.googleReviewWidget !== business.googleReviewWidget) {
        return NextResponse.json({ error: `Google Review widget is a Paid feature.${paidNote}` }, { status: 400 });
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON format for gallery or services." }, { status: 400 });
      }
      throw e;
    }

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: safeData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
