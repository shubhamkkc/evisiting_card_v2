export interface Review {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/**
 * Extracts a placeId or cid from a Google map URL if possible, though it's unreliable.
 * A safer bet is to use the Text Search API if there's no explicitly stored googlePlaceId.
 */
async function searchPlaceIdByUrlOrName(url: string, name: string, address: string) {
  try {
    const query = encodeURIComponent(`${name} ${address || ""} ${url || ""}`.trim());
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data?.results?.length > 0) {
      return data.results[0].place_id;
    }
  } catch (err) {
    console.error("Error finding place ID by search:", err);
  }
  return null;
}

export async function getGoogleReviews(placeId?: string | null, googleMapsUrl?: string | null, businessName?: string, address?: string): Promise<Review[]> {
  if (!API_KEY) {
    console.warn("GOOGLE_PLACES_API_KEY is not defined");
    return [];
  }

  let targetPlaceId = placeId;

  if (!targetPlaceId && (googleMapsUrl || businessName)) {
    targetPlaceId = await searchPlaceIdByUrlOrName(googleMapsUrl || "", businessName || "", address || "");
  }

  if (!targetPlaceId) {
    return [];
  }

  try {
    // We only need reviews, but we might want rating and user_ratings_total
    const fields = "reviews,rating,user_ratings_total";
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${targetPlaceId}&fields=${fields}&key=${API_KEY}`;
    
    const response = await fetch(detailsUrl);
    const data = await response.json();
    
    if (data?.result?.reviews) {
      let reviews = data.result.reviews as Review[];
      
      // Filter for 4 or 5 star reviews
      reviews = reviews.filter(r => r.rating >= 4);
      
      // Sort by rating (highest first) and then by time (newest first)
      reviews.sort((a, b) => b.rating - a.rating || b.time - a.time);
      
      // Return top 5
      return reviews.slice(0, 5);
    }
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
  }

  return [];
}
