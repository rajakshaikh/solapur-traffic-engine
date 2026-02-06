import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  ClipboardList, 
  ParkingCircle, 
  AlertTriangle, 
  Clock, 
  Camera,
  LogOut,
  Settings,
   Users,
   MessageSquare
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/smc", icon: LayoutDashboard },
  { name: "City Heatmap", href: "/smc/heatmap", icon: Map },
  { name: "Rule Engine", href: "/smc/rules", icon: FileText },
  { name: "Action List", href: "/smc/actions", icon: ClipboardList },
  { name: "Parking Impact", href: "/smc/parking", icon: ParkingCircle },
  { name: "Obstructions", href: "/smc/obstructions", icon: AlertTriangle },
  { name: "Peak Alerts", href: "/smc/alerts", icon: Clock },
  { name: "Photo Verify", href: "/smc/verify", icon: Camera },
   { name: "Citizen Reports", href: "/smc/reports", icon: MessageSquare },
];

const secondaryNav = [
  { name: "User Management", href: "/smc/users", icon: Users },
  { name: "Settings", href: "/smc/settings", icon: Settings },
];

export function SMCSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-accent">
          <Map className="h-5 w-5 text-sidebar-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">Solapur Gati</span>
          <span className="text-xs text-sidebar-foreground/60">Traffic Rule Engine</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
          Main Menu
        </p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/smc' && location.pathname.startsWith(item.href));
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "nav-item",
                isActive && "nav-item-active"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <nav className="flex flex-col gap-1 border-t border-sidebar-border p-3">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
          Administration
        </p>
        {secondaryNav.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "nav-item",
                isActive && "nav-item-active"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <span className="text-xs font-medium text-sidebar-foreground">SM</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">SMC Officer</p>
            <p className="text-xs text-sidebar-foreground/60">Traffic Department</p>
          </div>
          <button className="rounded p-1 hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4 text-sidebar-foreground/60" />
          </button>
        </div>
      </div>
    </aside>
  );
}
