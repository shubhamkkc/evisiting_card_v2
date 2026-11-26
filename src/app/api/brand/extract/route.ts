// POST /api/brand/extract — generate a brand palette from a logo URL.
// Body: { logoUrl: string }. Returns { palette: BrandPalette }.
// The palette is NOT saved here: the admin/owner form stores it in the
// business (field `brandPalette`) when the business itself is saved, so a
// failed extraction can never block a logo upload or a save.
// Requires a signed-in admin or owner.
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { extractBrandFromUrl } from "@/lib/brand-extract";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const role = session?.role;
    if (!session || (role !== "admin" && role !== "owner")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const logoUrl = body?.logoUrl;
    if (!logoUrl || typeof logoUrl !== "string") {
      return NextResponse.json(
        { error: "logoUrl is required" },
        { status: 400 }
      );
    }

    const palette = await extractBrandFromUrl(logoUrl);
    return NextResponse.json({ palette });
  } catch (error) {
    console.error("Brand extract error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Extraction failed" },
      { status: 500 }
    );
  }
}
