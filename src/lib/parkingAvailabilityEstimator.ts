// src/lib/parkingAvailabilityEstimator.ts

/**
 * Availability levels (estimated only; NOT real-time).
 * This function is intentionally configuration-driven so that
 * SMC can later REPLACE this with actual capacity data from
 * their own database / API.
 */

export type AvailabilityLevel =
  | "LIKELY_AVAILABLE"
  | "LIMITED"
  | "LIKELY_FULL";

export interface AvailabilityInfo {
  level: AvailabilityLevel;
  label: string;
  color: string;
  reason: string;
}

export interface AvailabilityConfig {
  peakHours: { startHour: number; endHour: number }[];
  highDensityKeywords: string[];
}

export const defaultAvailabilityConfig: AvailabilityConfig = {
  peakHours: [
    // Morning peak
    { startHour: 8, endHour: 11 },
    // Evening peak
    { startHour: 17, endHour: 21 },
  ],
  highDensityKeywords: [
    "mall",
    "market",
    "central business district",
    "CBD",
    "commercial",
  ],
};

export interface BasicPlaceLike {
  name?: string;
  vicinity?: string;
  formatted_address?: string;
}

/**
 * ESTIMATED availability only – NOT real time.
 *
 * How it works (hackathon-ready heuristic):
 * - Uses local time to detect peak hours.
 * - Checks name/address text for "high-density" commercial keywords.
 * - Combines those to return Likely Available / Limited / Likely Full.
 *
 * HOW TO REPLACE WITH REAL SMC DATA (high-level):
 * - Instead of this function, call an SMC backend:
 *   GET /api/parking-availability?placeId=...
 * - Backend looks up live capacity (slots, occupancy, lastUpdated).
 * - Map that response to AvailabilityInfo and use it directly in the UI.
 */
export function estimateParkingAvailability(
  place: BasicPlaceLike,
  now: Date = new Date(),
  config: AvailabilityConfig = defaultAvailabilityConfig,
): AvailabilityInfo {
  const hour = now.getHours();
  const isPeak =
    config.peakHours &&
    config.peakHours.some(
      (range) => hour >= range.startHour && hour < range.endHour,
    );

  const text = `${place.name ?? ""} ${place.vicinity ?? ""} ${
    place.formatted_address ?? ""
  }`.toLowerCase();

  const isHighDensity =
    config.highDensityKeywords &&
    config.highDensityKeywords.some((kw) => text.includes(kw.toLowerCase()));

  if (isHighDensity && isPeak) {
    return {
      level: "LIKELY_FULL",
      label: "Likely Full (estimate)",
      color: "#e53935", // red
      reason:
        "High-density commercial area during peak hours (estimated, not real-time).",
    };
  }

  if (isPeak) {
    return {
      level: "LIMITED",
      label: "Limited Availability (estimate)",
      color: "#fdd835", // yellow
      reason: "Peak hours – parking may be limited (estimated, not real-time).",
    };
  }

  return {
    level: "LIKELY_AVAILABLE",
    label: "Likely Available (estimate)",
    color: "#43a047", // green
    reason:
      "Off-peak hours – higher likelihood of availability (estimated, not real-time).",
  };
}

