// src/lib/parkingNominatim.ts
// OpenStreetMap Nominatim geocoding service (free, no API key required)

export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

/**
 * Search for a location using OpenStreetMap Nominatim geocoding
 * Free service, no API key required
 */
export async function searchLocationByName(
  query: string,
): Promise<{ lat: number; lng: number; name: string; address?: string } | null> {
  try {
    // Use Nominatim API (OpenStreetMap's geocoding service)
    const encodedQuery = encodeURIComponent(query + ", Solapur, Maharashtra, India");
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Solapur-Traffic-Engine/1.0", // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const results: NominatimResult[] = await response.json();

    if (results && results.length > 0) {
      const result = results[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name,
        address: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error("Nominatim geocoding error:", error);
    return null;
  }
}

/**
 * Reverse geocoding: Get address from coordinates
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Solapur-Traffic-Engine/1.0",
      },
    });

    if (!response.ok) {
      throw new Error("Reverse geocoding request failed");
    }

    const result = await response.json();
    return result.display_name || null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
