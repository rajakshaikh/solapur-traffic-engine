import { useEffect, useState } from "react";

/**
 * Dynamically loads the Google Maps JavaScript API with Places library.
 *
 * API KEY INJECTION:
 * - Pass the key from Vite env: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
 * - Example usage:
 *   const { loaded, error } = useGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
 */
export function useGoogleMaps(apiKey: string | undefined) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setError(new Error("Google Maps API key is missing."));
      return;
    }

    // Already loaded
    if ((window as any).google && (window as any).google.maps) {
      setLoaded(true);
      return;
    }

    const existing = document.getElementById("google-maps-script") as
      | HTMLScriptElement
      | null;

    if (existing) {
      existing.addEventListener("load", () => setLoaded(true));
      existing.addEventListener("error", () =>
        setError(new Error("Failed to load Google Maps script.")),
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => setLoaded(true);
    script.onerror = () =>
      setError(new Error("Failed to load Google Maps script."));

    document.body.appendChild(script);
  }, [apiKey]);

  return { loaded, error };
}

