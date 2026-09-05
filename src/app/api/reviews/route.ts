import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/googleReviews";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId");
    const googleMapsUrl = searchParams.get("url");
    const businessName = searchParams.get("name") ?? undefined;
    const address = searchParams.get("address") ?? undefined;

    if (!placeId && !googleMapsUrl && !businessName) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const reviews = await getGoogleReviews(placeId, googleMapsUrl, businessName, address);
    
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error in /api/reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
