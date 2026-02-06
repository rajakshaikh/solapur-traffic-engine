import { Outlet } from "react-router-dom";
import { SMCSidebar } from "./SMCSidebar";

export function SMCLayout() {
  return (
    <div className="min-h-screen">
      <SMCSidebar />
      <main className="ml-64 bg-background min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
