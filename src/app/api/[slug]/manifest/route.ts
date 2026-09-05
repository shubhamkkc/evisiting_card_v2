import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
  });

  if (!business) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const manifest = {
    name: business.businessName,
    short_name: business.businessName,
    description: business.about || `Digital Business Card for ${business.businessName}`,
    start_url: `/${business.slug}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: business.themeColor || "#0ea5e9",
    icons: [
      {
        src: business.logo || "/favicon.ico",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: business.logo || "/favicon.ico",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };

  return NextResponse.json(manifest);
}
