import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: "Google Places API key is not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const placeId = searchParams.get("placeId");

    if (placeId) {
      // Fetch details for a specific place
      const fields = [
        "name", "formatted_phone_number", "website", "formatted_address", 
        "url", "photos", "opening_hours", "rating", "user_ratings_total", 
        "reviews", "types", "geometry"
      ].join(",");
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(detailsUrl);
      const data = await response.json();

      if (data.status !== "OK") {
        return NextResponse.json({ error: data.error_message || "Failed to fetch place details" }, { status: 400 });
      }

      const result = data.result;
      const formattedData = {
        name: result.name,
        phone: result.formatted_phone_number,
        address: result.formatted_address,
        website: result.website,
        googleMapsUrl: result.url,
        placeId: placeId,
        photoReference: result.photos && result.photos.length > 0 ? result.photos[0].photo_reference : null,
        openingHours: result.opening_hours ? result.opening_hours.weekday_text : null,
        rating: result.rating,
        userRatingsTotal: result.user_ratings_total,
        types: result.types,
        location: result.geometry?.location,
      };

      return NextResponse.json(formattedData);
    } else if (query) {
      // Search for places
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        return NextResponse.json({ error: data.error_message || "Failed to search places" }, { status: 400 });
      }

      return NextResponse.json(data.results);
    }

    return NextResponse.json({ error: "Either query or placeId is required" }, { status: 400 });
  } catch (error) {
    console.error("Places API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
