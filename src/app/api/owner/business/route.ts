import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Fields an owner is NOT allowed to change
const ADMIN_ONLY_FIELDS = ["isActive", "ownerEmail", "ownerPassword", "slug", "id", "createdAt", "updatedAt"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const businessId = (session?.user as any)?.businessId;

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
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const businessId = (session?.user as any)?.businessId;

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
