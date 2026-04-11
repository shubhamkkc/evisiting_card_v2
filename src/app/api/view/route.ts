import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

    const business = await prisma.business.update({
      where: { slug },
      data: { cardViews: { increment: 1 } },
    });

    return NextResponse.json({ success: true, views: business.cardViews });
  } catch (error) {
    console.error("View update error:", error);
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
