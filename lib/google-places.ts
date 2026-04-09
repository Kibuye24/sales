import axios from "axios";

/**
 * Google Places API (New) integration for real business data.
 * Uses Text Search to find businesses in Nairobi areas.
 */

const PLACES_API_BASE = "https://places.googleapis.com/v1/places:searchText";

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: {
    weekdayDescriptions?: string[];
  };
  regularOpeningHours?: {
    weekdayDescriptions?: string[];
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  primaryType?: string;
  types?: string[];
  editorialSummary?: { text: string };
}

export interface PlacesSearchResult {
  business_name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  google_maps_url: string | null;
  google_rating: number | null;
  google_reviews: number | null;
  latitude: number | null;
  longitude: number | null;
  operating_hours: string | null;
  place_type: string | null;
  editorial_summary: string | null;
}

/**
 * Map a category to Google Places search terms
 */
function buildSearchQuery(area: string, category: string): string {
  const categoryMap: Record<string, string> = {
    restaurant: "restaurants",
    cafe: "cafes coffee shops",
    pharmacy: "pharmacies",
    grocery: "grocery stores",
    bakery: "bakeries",
    fast_food: "fast food",
    bar_lounge: "bars lounges",
    butchery: "butcheries meat shops",
    supermarket: "supermarkets",
    other: "food shops retail",
  };

  const searchTerm = categoryMap[category] || category;
  return `${searchTerm} in ${area}, Nairobi, Kenya`;
}

/**
 * Search Google Places API for real businesses.
 * Returns verified business data — no hallucinated details.
 */
export async function searchPlaces(
  area: string,
  category: string
): Promise<PlacesSearchResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_PLACES_API_KEY is not configured. Add it to .env.local"
    );
  }

  const query = buildSearchQuery(area, category);

  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.nationalPhoneNumber",
    "places.internationalPhoneNumber",
    "places.websiteUri",
    "places.googleMapsUri",
    "places.rating",
    "places.userRatingCount",
    "places.currentOpeningHours",
    "places.regularOpeningHours",
    "places.location",
    "places.primaryType",
    "places.types",
    "places.editorialSummary",
  ].join(",");

  const response = await axios.post(
    PLACES_API_BASE,
    {
      textQuery: query,
      maxResultCount: 20,
      languageCode: "en",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
    }
  );

  const places: PlaceResult[] = response.data.places || [];

  return places.map((place) => {
    // Build operating hours string
    const hours =
      place.currentOpeningHours?.weekdayDescriptions ||
      place.regularOpeningHours?.weekdayDescriptions;
    const hoursStr = hours ? hours.join(" | ") : null;

    return {
      business_name: place.displayName?.text || "Unknown",
      address: place.formattedAddress || null,
      phone: place.internationalPhoneNumber || place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      google_maps_url: place.googleMapsUri || null,
      google_rating: place.rating || null,
      google_reviews: place.userRatingCount || null,
      latitude: place.location?.latitude || null,
      longitude: place.location?.longitude || null,
      operating_hours: hoursStr,
      place_type: place.primaryType || null,
      editorial_summary: place.editorialSummary?.text || null,
    };
  });
}
