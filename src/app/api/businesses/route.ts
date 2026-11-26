import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await prisma.business.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(businesses);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Owner passwords are no longer stored: owners sign in with Supabase
    // Auth (email OTP) and link automatically by email. Drop the field so
    // no new bcrypt hash is ever written.
    delete body.ownerPassword;

    // Handle empty ownerEmail
    if (body.ownerEmail === "") {
      body.ownerEmail = null;
    }

    const business = await prisma.business.create({
      data: body,
    });
    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
