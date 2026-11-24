import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resolveBrandPalette } from "@/lib/brand";

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

  // Install colours follow the business's own brand palette (generated
  // from its logo) — but only for Theme 6, which is the dynamic-brand
  // card. Other themes keep their previous manifest colours untouched.
  const isTheme6 = business.theme === "theme6";
  const brand = resolveBrandPalette(business);
  const backgroundColor = isTheme6 ? brand.pageBackground : "#ffffff";
  const themeColor = isTheme6 ? brand.dark : business.themeColor || "#0ea5e9";

  // PWA icons: serve the logo through the image optimiser at the exact
  // size Chrome needs, instead of the raw upload (a 920px PNG can be
  // ~500 KB — the browser fetches the manifest icon on page load).
  // Only for URLs the optimiser can handle (local paths + Cloudinary,
  // which is where every logo upload lives); anything else keeps its
  // raw URL so the icon never breaks. Widths must be ones Next.js
  // allows (imageSizes/deviceSizes): 192→256, 512→640.
  const iconSrc = (size: 192 | 512) => {
    const logo = business.logo;
    if (!logo || logo.startsWith("data:")) return logo || "/favicon.ico";
    const optimizable =
      logo.startsWith("/") || logo.startsWith("https://res.cloudinary.com/");
    if (!optimizable) return logo;
    const width = size === 192 ? 256 : 640;
    return `/_next/image?url=${encodeURIComponent(logo)}&w=${width}&q=75`;
  };

  const manifest = {
    name: business.businessName,
    short_name: business.businessName,
    description: business.about || `Digital Business Card for ${business.businessName}`,
    start_url: `/${business.slug}`,
    scope: `/${business.slug}`,
    display: "standalone",
    background_color: backgroundColor,
    theme_color: themeColor,
    icons: [
      {
        src: iconSrc(192),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: iconSrc(512),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };

  return NextResponse.json(manifest);
}
