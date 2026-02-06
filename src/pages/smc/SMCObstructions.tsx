import { SMCHeader } from "@/components/smc/SMCHeader";
import { obstructionHotspots } from "@/data/mockData";
import { TrendBadge } from "@/components/smc/Badges";
import { Construction, MapPin, Clock, TrendingUp, ShoppingCart, AlertTriangle, Truck } from "lucide-react";

const typeIcons = {
  hawker: ShoppingCart,
  blockage: AlertTriangle,
  accident: AlertTriangle,
  construction: Truck,
};

const typeLabels = {
  hawker: 'Hawker',
  blockage: 'Road Blockage',
  accident: 'Accident',
  construction: 'Construction',
};

export default function SMCObstructions() {
  return (
    <div className="min-h-screen">
      <SMCHeader 
        title="Obstruction Hotspots" 
        subtitle="Repeated citizen reports grouped by location" 
      />
      <div className="p-6 space-y-6">
        {/* Module Purpose */}
        <div className="gov-card bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Purpose:</span> This module groups repeated citizen reports to help SMC plan targeted enforcement, not blanket removal.
          </p>
        </div>

        {/* Hotspots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {obstructionHotspots.map((hotspot) => {
            const TypeIcon = typeIcons[hotspot.type];
            return (
              <div key={hotspot.id} className="gov-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <TypeIcon className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{hotspot.location}</h3>
                      <p className="text-sm text-muted-foreground">{typeLabels[hotspot.type]}</p>
                    </div>
                  </div>
                  <TrendBadge trend={hotspot.trend} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Peak Times
                    </div>
                    <span className="font-medium text-foreground">{hotspot.peakTimes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Total Reports
                    </div>
                    <span className="font-medium text-foreground">{hotspot.reportCount}</span>
                  </div>
                </div>

                <button className="mt-4 w-full btn-gov-secondary text-sm">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
