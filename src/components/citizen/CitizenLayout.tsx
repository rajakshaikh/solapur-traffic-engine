import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Bus,
  AlertTriangle,
  Map,
  Home,
  Calendar,
  FileText,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CitizenLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/citizen" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Map className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Solapur Gati</span>
                <span className="text-xs text-muted-foreground block">Citizen Portal</span>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                to="/citizen"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === '/citizen'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/citizen/report"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === '/citizen/report'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Report Issue</span>
              </Link>
              <Link
                to="/citizen/parking"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === "/citizen/parking"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Car className="h-4 w-4" />
                <span className="hidden sm:inline">Nearby Parking</span>
              </Link>
              <Link
                to="/citizen/bus"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === '/citizen/bus'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Bus className="h-4 w-4" />
                <span className="hidden sm:inline">Bus Arrival</span>
              </Link>
              <Link
                to="/citizen/schedule"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === '/citizen/schedule'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Schedules</span>
              </Link>
               <Link
                 to="/citizen/my-reports"
                 className={cn(
                   "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                   location.pathname === '/citizen/my-reports'
                     ? "bg-primary text-primary-foreground"
                     : "text-muted-foreground hover:bg-muted hover:text-foreground"
                 )}
               >
                 <FileText className="h-4 w-4" />
                 <span className="hidden sm:inline">My Reports</span>
               </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Solapur Municipal Corporation — Citizen Traffic Portal
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            "Thank you for helping improve traffic management in Solapur."
          </p>
        </div>
      </footer>
    </div>
  );
}
