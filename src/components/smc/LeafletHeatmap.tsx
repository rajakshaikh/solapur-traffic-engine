import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

// Solapur city center coordinates
const SOLAPUR_CENTER: [number, number] = [17.6599, 75.9064];
const DEFAULT_ZOOM = 13;

export interface HotspotData {
  id: number;
  lat: number;
  lng: number;
  severity: 'high' | 'medium' | 'low';
  name: string;
  reportCount: number;
  peakTime: string;
}

// Solapur area hotspots with real coordinates
export const solapurHotspots: HotspotData[] = [
  { id: 1, lat: 17.6688, lng: 75.9115, severity: 'high', name: 'Railway Station Road', reportCount: 47, peakTime: '8:30 - 9:30 AM' },
  { id: 2, lat: 17.6589, lng: 75.9021, severity: 'high', name: 'Murarji Peth', reportCount: 38, peakTime: '5:00 - 6:30 PM' },
  { id: 3, lat: 17.6555, lng: 75.9130, severity: 'medium', name: 'Solapur Bus Stand', reportCount: 29, peakTime: '7:00 - 8:00 AM' },
  { id: 4, lat: 17.6632, lng: 75.9178, severity: 'medium', name: 'Ashok Chowk', reportCount: 24, peakTime: '6:00 - 7:00 PM' },
  { id: 5, lat: 17.6720, lng: 75.9050, severity: 'low', name: 'Kumbar Wada', reportCount: 15, peakTime: '9:00 - 10:00 AM' },
  { id: 6, lat: 17.6480, lng: 75.8980, severity: 'medium', name: 'Akkalkot Road', reportCount: 33, peakTime: '6:00 - 8:00 PM' },
  { id: 7, lat: 17.6700, lng: 75.9250, severity: 'low', name: 'Vijapur Road', reportCount: 28, peakTime: '7:00 - 9:00 AM' },
  { id: 8, lat: 17.6510, lng: 75.9200, severity: 'medium', name: 'Jule Solapur Market', reportCount: 41, peakTime: '10:00 AM - 1:00 PM' },
  { id: 9, lat: 17.6750, lng: 75.8900, severity: 'low', name: 'Hotgi Road', reportCount: 22, peakTime: '7:30 - 8:30 AM' },
];

function getSeverityColor(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#22c55e';
    default: return '#6b7280';
  }
}

function getSeverityRadius(severity: 'high' | 'medium' | 'low'): number {
  switch (severity) {
    case 'high': return 20;
    case 'medium': return 16;
    case 'low': return 12;
    default: return 10;
  }
}

interface LeafletHeatmapProps {
  activeType: string;
  onHotspotSelect: (hotspot: HotspotData | null) => void;
  selectedHotspot: HotspotData | null;
}

export function LeafletHeatmap({ activeType, onHotspotSelect, selectedHotspot }: LeafletHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(SOLAPUR_CENTER, DEFAULT_ZOOM);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add hotspot markers
    solapurHotspots.forEach((hotspot) => {
      const marker = L.circleMarker([hotspot.lat, hotspot.lng], {
        radius: getSeverityRadius(hotspot.severity),
        fillColor: getSeverityColor(hotspot.severity),
        color: getSeverityColor(hotspot.severity),
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 150px;">
          <p style="font-weight: 600; margin: 0 0 4px 0;">${hotspot.name}</p>
          <p style="font-size: 12px; color: #666; margin: 0;">
            Severity: <strong style="color: ${getSeverityColor(hotspot.severity)}">${hotspot.severity.toUpperCase()}</strong>
          </p>
          <p style="font-size: 12px; color: #666; margin: 0;">Reports: ${hotspot.reportCount}</p>
          <p style="font-size: 12px; color: #666; margin: 0;">Peak: ${hotspot.peakTime}</p>
        </div>
      `);

      marker.on('click', () => {
        onHotspotSelect(hotspot);
      });

      markersRef.current.push(marker);
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when hotspot is selected externally
  useEffect(() => {
    if (mapInstanceRef.current && selectedHotspot) {
      mapInstanceRef.current.setView([selectedHotspot.lat, selectedHotspot.lng], 15);
    }
  }, [selectedHotspot]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full z-0" />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs font-semibold text-foreground mb-2">Legend</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-traffic-green" />
              <span className="text-xs text-muted-foreground">Normal Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-traffic-amber" />
              <span className="text-xs text-muted-foreground">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-traffic-red" />
              <span className="text-xs text-muted-foreground">Congestion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Hotspot Info */}
      {selectedHotspot && (
        <div className="absolute bottom-4 left-4 z-[1000] max-w-xs animate-fade-in">
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "h-3 w-3 rounded-full",
                selectedHotspot.severity === 'high' && "bg-traffic-red",
                selectedHotspot.severity === 'medium' && "bg-traffic-amber",
                selectedHotspot.severity === 'low' && "bg-traffic-green"
              )} />
              <span className="font-semibold text-sm">{selectedHotspot.name}</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Severity: <span className="font-medium text-foreground">{selectedHotspot.severity.toUpperCase()}</span></p>
              <p>Reports: <span className="font-medium text-foreground">{selectedHotspot.reportCount}</span></p>
              <p>Peak Time: <span className="font-medium text-foreground">{selectedHotspot.peakTime}</span></p>
            </div>
            <button
              onClick={() => onHotspotSelect(null)}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
