import { useState } from "react";
import { busRoutes, busArrivals, BusArrival } from "@/data/mockData";
import { Bus, Clock, MapPin, AlertCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CitizenBus() {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedStop, setSelectedStop] = useState<string>("");

  const selectedRouteData = busRoutes.find(r => r.id === selectedRoute);
  const filteredArrivals = busArrivals.filter(a => {
    if (selectedRoute && selectedStop) {
      const route = busRoutes.find(r => r.id === selectedRoute);
      return a.routeNumber === route?.routeNumber && a.stopName === selectedStop;
    }
    if (selectedRoute) {
      const route = busRoutes.find(r => r.id === selectedRoute);
      return a.routeNumber === route?.routeNumber;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
          <Bus className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Bus Arrival Information</h1>
        <p className="text-muted-foreground">
          Check expected arrival times with traffic-based delay estimates
        </p>
      </div>

      {/* Selection Form */}
      <div className="gov-card p-5 mb-6">
        <div className="space-y-4">
          {/* Route Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Select Bus Route
            </label>
            <select
              value={selectedRoute}
              onChange={(e) => {
                setSelectedRoute(e.target.value);
                setSelectedStop("");
              }}
              className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Routes</option>
              {busRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  Route {route.routeNumber}: {route.routeName}
                </option>
              ))}
            </select>
          </div>

          {/* Stop Selection */}
          {selectedRouteData && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Stop
              </label>
              <select
                value={selectedStop}
                onChange={(e) => setSelectedStop(e.target.value)}
                className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All Stops</option>
                {selectedRouteData.stops.map((stop) => (
                  <option key={stop} value={stop}>
                    {stop}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Arrival Results */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Expected Arrivals
        </h2>
        
        {filteredArrivals.length === 0 ? (
          <div className="gov-card p-8 text-center">
            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Select a route to see arrival times
            </p>
          </div>
        ) : (
          filteredArrivals.map((arrival, index) => (
            <BusArrivalCard key={index} arrival={arrival} />
          ))
        )}
      </div>

      {/* Purpose Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Goal:</span> Reduce roadside waiting and auto clustering at bus stops
        </p>
      </div>
    </div>
  );
}

function BusArrivalCard({ arrival }: { arrival: BusArrival }) {
  const hasDelay = arrival.delay > 0;

  return (
    <div className="gov-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-sm font-bold text-primary">{arrival.routeNumber}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">{arrival.stopName}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{arrival.expectedArrival}</span>
          </div>
          {hasDelay && (
            <span className={cn(
              "text-xs font-medium",
              arrival.delay > 5 ? "text-warning" : "text-muted-foreground"
            )}>
              +{arrival.delay} min delay
            </span>
          )}
        </div>
      </div>

      {hasDelay && arrival.delayReason && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Delay reason:</span> {arrival.delayReason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
