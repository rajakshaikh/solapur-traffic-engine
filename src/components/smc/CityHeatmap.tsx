import { useState } from "react";
import { cn } from "@/lib/utils";
import { LeafletHeatmap, HotspotData } from "./LeafletHeatmap";

type HeatmapType = 'traffic' | 'parking' | 'hawker' | 'reports' | 'historical';

interface HeatmapToggle {
  id: HeatmapType;
  label: string;
}

const heatmapToggles: HeatmapToggle[] = [
  { id: 'traffic', label: 'Traffic Speed' },
  { id: 'parking', label: 'Parking Impact' },
  { id: 'hawker', label: 'Hawker/Obstruction' },
  { id: 'reports', label: 'Report Density' },
  { id: 'historical', label: 'Historical Pattern' },
];

export function CityHeatmap() {
  const [activeType, setActiveType] = useState<HeatmapType>('traffic');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);

  return (
    <div className="gov-card overflow-hidden">
      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-border p-4">
        {heatmapToggles.map((toggle) => (
          <button
            key={toggle.id}
            onClick={() => setActiveType(toggle.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeType === toggle.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {toggle.label}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] lg:h-[500px]">
        <LeafletHeatmap
          activeType={activeType}
          onHotspotSelect={setSelectedHotspot}
          selectedHotspot={selectedHotspot}
        />
      </div>

      {/* Map Caption */}
      <div className="border-t border-border bg-muted/30 px-4 py-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Solapur City Traffic Heatmap</span> — Last updated: {new Date().toLocaleTimeString('en-IN')} | Click on hotspots for details
        </p>
      </div>
    </div>
  );
}
