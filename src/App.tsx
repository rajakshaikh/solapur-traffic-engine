import AppLayout from "./components/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// SMC Pages
import SMCLogin from "./pages/smc/SMCLogin";
import SMCDashboard from "./pages/smc/SMCDashboard";
import SMCHeatmap from "./pages/smc/SMCHeatmap";
import SMCRules from "./pages/smc/SMCRules";
import SMCActions from "./pages/smc/SMCActions";
import SMCParking from "./pages/smc/SMCParking";
import SMCObstructions from "./pages/smc/SMCObstructions";
import SMCAlerts from "./pages/smc/SMCAlerts";
import SMCVerify from "./pages/smc/SMCVerify";
 import SMCReports from "./pages/smc/SMCReports";

// Citizen Pages
import CitizenHome from "./pages/citizen/CitizenHome";
import CitizenBus from "./pages/citizen/CitizenBus";
import CitizenSchedule from "./pages/citizen/CitizenSchedule";
import CitizenReport from "./pages/citizen/CitizenReport";
import CitizenMyReports from "./pages/citizen/CitizenMyReports";
import CitizenParking from "./pages/citizen/CitizenParking";

// Layouts
import { SMCLayout } from "./components/smc/SMCLayout";
import { CitizenLayout } from "./components/citizen/CitizenLayout";
import { AdminLayout } from "./components/admin/AdminLayout";

// Admin (real API + DB)
import AdminLogin from "./pages/admin/AdminLogin";
import AdminReports from "./pages/admin/AdminReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Global Background */}
          <Route element={<AppLayout />}>
            {/* Public */}
            <Route path="/" element={<Index />} />

            {/* SMC */}
            <Route path="/smc/login" element={<SMCLogin />} />
            <Route path="/smc" element={<SMCLayout />}>
              <Route index element={<SMCDashboard />} />
              <Route path="heatmap" element={<SMCHeatmap />} />
              <Route path="rules" element={<SMCRules />} />
              <Route path="actions" element={<SMCActions />} />
              <Route path="parking" element={<SMCParking />} />
              <Route path="obstructions" element={<SMCObstructions />} />
              <Route path="alerts" element={<SMCAlerts />} />
              <Route path="verify" element={<SMCVerify />} />
               <Route path="reports" element={<SMCReports />} />
            </Route>

            {/* Citizen */}
            <Route path="/citizen" element={<CitizenLayout />}>
              <Route index element={<CitizenHome />} />
              <Route path="bus" element={<CitizenBus />} />
              <Route path="schedule" element={<CitizenSchedule />} />
              <Route path="report" element={<CitizenReport />} />
              <Route path="my-reports" element={<CitizenMyReports />} />
              <Route
                path="parking"
                element={<CitizenParking />}
              />
            </Route>

            {/* Admin (SMC report management – protected) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="login" element={<AdminLogin />} />
              <Route path="reports" element={<AdminReports />} />
              <Route index element={<AdminReports />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
