import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import { getAdminAuth, clearAdminAuth } from "@/lib/api";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout() {
  const location = useLocation();
  const isAuth = !!getAdminAuth();

  if (!isAuth && location.pathname !== "/admin/login") {
    return <Navigate to="/admin/login" state={{ from: { pathname: location.pathname } }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <Link to="/admin/reports" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">SMC Admin</span>
          </Link>
          {isAuth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearAdminAuth();
                window.location.href = "/admin/login";
              }}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
