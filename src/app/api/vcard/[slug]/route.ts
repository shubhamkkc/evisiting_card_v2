import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // Build vCard manually (3.0 format)
    const lines: string[] = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${business.ownerName || business.businessName}`,
      `ORG:${business.businessName}`,
    ];

    if (business.designation) {
      lines.push(`TITLE:${business.designation}`);
    }

    if (business.phone) {
      lines.push(`TEL;TYPE=WORK,VOICE:${business.phone}`);
    }

    if (business.whatsapp) {
      lines.push(`TEL;TYPE=CELL:${business.whatsapp}`);
    }

    if (business.email) {
      lines.push(`EMAIL:${business.email}`);
    }

    if (business.website) {
      lines.push(`URL:${business.website}`);
    }

    if (business.address) {
      lines.push(`ADR;TYPE=WORK:;;${business.address.replace(/\n/g, ", ")};;;`);
    }

    lines.push("END:VCARD");

    const vcardContent = lines.join("\r\n");

    const headers = new Headers();
    headers.set("Content-Type", "text/vcard; charset=utf-8");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${business.slug}.vcf"`
    );

    return new NextResponse(vcardContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("vCard Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
