// src/lib/parkingApi.ts

/**
 * Wrapper around the official Google Places nearbySearch API.
 *
 * NOTE: We intentionally type the response as `any[]` to avoid
 * pulling extra type packages; this is hackathon-friendly and can
 * be tightened later with `@types/google.maps`.
 */

export interface NearbyParkingOptions {
  radiusMeters?: number;
}

export async function fetchNearbyParking(
  mapInstance: any,
  location: { lat: number; lng: number },
  options: NearbyParkingOptions = {},
): Promise<any[]> {
  const radius = options.radiusMeters ?? 2000;

  return new Promise((resolve, reject) => {
    const g = (window as any).google;

    if (!g || !g.maps || !g.maps.places) {
      reject(new Error("Google Maps Places library is not loaded."));
      return;
    }

    const service = new g.maps.places.PlacesService(mapInstance);

    const request = {
      location: new g.maps.LatLng(location.lat, location.lng),
      radius,
      type: ["parking"],
    };

    service.nearbySearch(request, (results: any[], status: string) => {
      const Status = g.maps.places.PlacesServiceStatus;
      if (status === Status.OK && results) {
        resolve(results);
      } else if (status === Status.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(`Places nearbySearch failed: ${status}`));
      }
    });
  });
}

/**
 * Search for a place by name (e.g., "Civil Chowk")
 */
export async function searchPlaceByName(
  query: string,
  mapInstance: any,
): Promise<{ lat: number; lng: number; name: string; formatted_address?: string } | null> {
  return new Promise((resolve, reject) => {
    const g = (window as any).google;

    if (!g || !g.maps || !g.maps.places) {
      reject(new Error("Google Maps Places library is not loaded."));
      return;
    }

    const service = new g.maps.places.PlacesService(mapInstance);
    const request = {
      query: query,
      fields: ["geometry", "name", "formatted_address"],
    };

    service.textSearch(request, (results: any[], status: string) => {
      const Status = g.maps.places.PlacesServiceStatus;
      if (status === Status.OK && results && results.length > 0) {
        const place = results[0];
        const loc = place.geometry.location;
        resolve({
          lat: typeof loc.lat === "function" ? loc.lat() : loc.lat,
          lng: typeof loc.lng === "function" ? loc.lng() : loc.lng,
          name: place.name,
          formatted_address: place.formatted_address,
        });
      } else {
        resolve(null);
      }
    });
  });
}

