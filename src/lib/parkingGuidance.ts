// src/lib/parkingGuidance.ts

import { congestionZones, parkingImpactAreas } from "@/data/mockData";
import { estimateParkingAvailability } from "./parkingAvailabilityEstimator";

/**
 * Parking Guidance System
 * Analyzes conditions and provides recommendations
 */

export interface ParkingRecommendation {
  place: any;
  distanceMeters: number;
  walkingTimeMinutes: number;
  availability: ReturnType<typeof import("./parkingAvailabilityEstimator").estimateParkingAvailability>;
  recommendationReason: string;
}

export interface PressureZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // meters
  severity: "high" | "medium" | "low";
  peakTime: string;
  reportCount: number;
}

export interface NoParkingZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // meters
  reason: string;
  timeWindow?: string;
}

// Solapur-specific pressure zones (derived from congestion data)
export const pressureZones: PressureZone[] = [
  {
    id: "1",
    name: "Station Road Junction",
    center: { lat: 17.6599, lng: 75.9064 },
    radius: 300,
    severity: "high",
    peakTime: "8:30 - 9:30 AM",
    reportCount: 47,
  },
  {
    id: "2",
    name: "Murarji Peth Main Road",
    center: { lat: 17.6589, lng: 75.9021 },
    radius: 400,
    severity: "high",
    peakTime: "5:00 - 6:30 PM",
    reportCount: 38,
  },
  {
    id: "3",
    name: "Bus Stand Circle",
    center: { lat: 17.6555, lng: 75.9130 },
    radius: 250,
    severity: "medium",
    peakTime: "7:00 - 8:00 AM",
    reportCount: 29,
  },
  {
    id: "4",
    name: "Ashok Chowk",
    center: { lat: 17.6632, lng: 75.9178 },
    radius: 200,
    severity: "medium",
    peakTime: "6:00 - 7:00 PM",
    reportCount: 24,
  },
  {
    id: "5",
    name: "Jule Solapur Market",
    center: { lat: 17.6510, lng: 75.9200 },
    radius: 350,
    severity: "medium",
    peakTime: "10:00 AM - 1:00 PM",
    reportCount: 41,
  },
];

// No-parking zones (from SMC rules)
export const noParkingZones: NoParkingZone[] = [
  {
    id: "np1",
    name: "Station Road (Peak Hours)",
    center: { lat: 17.6599, lng: 75.9064 },
    radius: 200,
    reason: "No parking 8:00-10:00 AM",
    timeWindow: "8:00 AM - 10:00 AM",
  },
  {
    id: "np2",
    name: "Murarji Peth (Evening)",
    center: { lat: 17.6589, lng: 75.9021 },
    radius: 300,
    reason: "Hawker-free enforcement zone",
    timeWindow: "5:00 PM - 7:00 PM",
  },
  {
    id: "np3",
    name: "Bus Stand Circle",
    center: { lat: 17.6555, lng: 75.9130 },
    radius: 150,
    reason: "No parking near bus stop",
    timeWindow: "All day",
  },
];

/**
 * Calculate distance between two points (Haversine formula)
 */
export function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number },
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Estimate walking time in minutes (assuming 5 km/h average walking speed)
 */
export function estimateWalkingTime(distanceMeters: number): number {
  const walkingSpeedKmh = 5; // km/h
  const walkingSpeedMs = (walkingSpeedKmh * 1000) / 3600; // m/s
  const timeSeconds = distanceMeters / walkingSpeedMs;
  return Math.ceil(timeSeconds / 60); // minutes
}

/**
 * Analyze parking conditions and generate guidance
 */
export function analyzeParkingConditions(
  userLocation: { lat: number; lng: number },
  parkingPlaces: any[],
  currentTime: Date = new Date(),
): {
  pressureAlert: string | null;
  recommendations: ParkingRecommendation[];
  nearbyPressureZones: PressureZone[];
  nearbyNoParkingZones: NoParkingZone[];
} {
  const hour = currentTime.getHours();
  const nearbyPressureZones = pressureZones.filter((zone) => {
    const dist = calculateDistance(userLocation, zone.center);
    return dist <= zone.radius + 500; // Include zones within 500m of radius
  });

  const nearbyNoParkingZones = noParkingZones.filter((zone) => {
    const dist = calculateDistance(userLocation, zone.center);
    return dist <= zone.radius + 200;
  });

  // Check if user is in a high-pressure zone
  const activeHighPressureZone = nearbyPressureZones.find(
    (zone) => zone.severity === "high",
  );

  let pressureAlert: string | null = null;
  if (activeHighPressureZone) {
    const peakTimes = activeHighPressureZone.peakTime.split(" - ");
    pressureAlert = `High parking pressure near ${activeHighPressureZone.name} (${activeHighPressureZone.peakTime})`;
  }

  // Generate recommendations
  const recommendations: ParkingRecommendation[] = parkingPlaces
    .map((place) => {
      if (!place.geometry || !place.geometry.location) return null;

      const placeLoc = {
        lat:
          typeof place.geometry.location.lat === "function"
            ? place.geometry.location.lat()
            : place.geometry.location.lat,
        lng:
          typeof place.geometry.location.lng === "function"
            ? place.geometry.location.lng()
            : place.geometry.location.lng,
      };

      const distance = calculateDistance(userLocation, placeLoc);
      const walkingTime = estimateWalkingTime(distance);

      // Skip if too far (> 1km)
      if (distance > 1000) return null;

      const availability = estimateParkingAvailability(place, currentTime);

      let reason = "";
      if (availability.level === "LIKELY_AVAILABLE") {
        reason = "Good availability expected";
      } else if (availability.level === "LIMITED") {
        reason = "May have limited spots";
      } else {
        reason = "Likely to be full";
      }

      return {
        place,
        distanceMeters: Math.round(distance),
        walkingTimeMinutes: walkingTime,
        availability,
        recommendationReason: reason,
      };
    })
    .filter((r): r is ParkingRecommendation => r !== null)
    .sort((a, b) => {
      // Sort by availability level (better first), then distance
      const levelOrder = { LIKELY_AVAILABLE: 0, LIMITED: 1, LIKELY_FULL: 2 };
      const levelDiff =
        levelOrder[a.availability.level] - levelOrder[b.availability.level];
      if (levelDiff !== 0) return levelDiff;
      return a.distanceMeters - b.distanceMeters;
    })
    .slice(0, 3); // Top 3 recommendations

  return {
    pressureAlert,
    recommendations,
    nearbyPressureZones,
    nearbyNoParkingZones,
  };
}
