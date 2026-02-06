import { Link } from "react-router-dom";
import { Bus, AlertTriangle, ArrowRight, Car } from "lucide-react";

export default function CitizenHome() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Solapur Traffic Citizen Portal
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Check bus arrival times and report traffic issues to help improve traffic management in your city.
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Report Issue Card - First */}
        <Link
          to="/citizen/report"
          className="gov-card p-6 group hover:shadow-md transition-all hover:border-warning/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-warning transition-colors" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Report Traffic Issue</h2>
          <p className="text-sm text-muted-foreground">
            Report illegal parking, road blockages, hawker issues, or broken signals.
          </p>
        </Link>

        {/* Nearby Parking Card - Second */}
        <Link
          to="/citizen/parking"
          className="gov-card p-6 group hover:shadow-md transition-all hover:border-success/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Car className="h-6 w-6 text-success" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-success transition-colors" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Nearby Parking Availability
          </h2>
          <p className="text-sm text-muted-foreground">
            View nearby public parking locations and indicative availability powered by
            Google Maps &amp; municipal data.
          </p>
        </Link>

        {/* Bus Info Card - Third */}
        <Link
          to="/citizen/bus"
          className="gov-card p-6 group hover:shadow-md transition-all hover:border-primary/30 md:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bus className="h-6 w-6 text-primary" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Bus Arrival Info</h2>
          <p className="text-sm text-muted-foreground">
            Check expected bus arrival times with traffic-based delay information.
          </p>
        </Link>
      </div>

      {/* Info Note */}
      <div className="max-w-2xl mx-auto mt-10">
        <div className="gov-card bg-primary/5 border-primary/20 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Your reports help Solapur Municipal Corporation identify and address traffic issues faster.
            <br />
            <span className="font-medium text-foreground mt-1 inline-block">
              Every report makes a difference.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
