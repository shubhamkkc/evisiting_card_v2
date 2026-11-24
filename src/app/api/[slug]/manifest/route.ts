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

  // Theme 6 (Linktree) uses its own install colours: ink theme colour and
  // warm-canvas background. Other themes keep the business brand colour.
  const isTheme6 = business.theme === "theme6";
  const manifest = {
    name: business.businessName,
    short_name: business.businessName,
    description: business.about || `Digital Business Card for ${business.businessName}`,
    start_url: `/${business.slug}`,
    scope: `/${business.slug}`,
    display: "standalone",
    background_color: isTheme6 ? "#F3F3F1" : "#ffffff",
    theme_color: isTheme6 ? "#000000" : business.themeColor || "#0ea5e9",
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
