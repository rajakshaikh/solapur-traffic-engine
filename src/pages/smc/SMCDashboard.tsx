import { SMCHeader } from "@/components/smc/SMCHeader";
import { SummaryCard } from "@/components/smc/SummaryCard";
import { CityHeatmap } from "@/components/smc/CityHeatmap";
import { RuleEnginePanel } from "@/components/smc/RuleEnginePanel";
import { DailyActionList } from "@/components/smc/DailyActionList";
import { dashboardStats, trafficAlerts } from "@/data/mockData";
import { AlertTypeBadge } from "@/components/smc/Badges";
import { 
  AlertTriangle, 
  FileText, 
  ParkingCircle, 
  Construction, 
  Clock,
  Bell
} from "lucide-react";

export default function SMCDashboard() {
  return (
    <div className="min-h-screen">
      <SMCHeader 
        title="SMC Dashboard" 
        subtitle="Traffic Management Overview" 
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard
            title="Active Congestion Zones"
            value={dashboardStats.activeCongestionZones}
            icon={AlertTriangle}
            variant="danger"
            trend={{ value: 12, label: "from yesterday", isPositive: false }}
          />
          <SummaryCard
            title="New Rule Recommendations"
            value={dashboardStats.newRuleRecommendations}
            icon={FileText}
            variant="warning"
          />
          <SummaryCard
            title="High-Risk Parking Areas"
            value={dashboardStats.highRiskParkingAreas}
            icon={ParkingCircle}
            variant="warning"
          />
          <SummaryCard
            title="Obstruction Hotspots"
            value={dashboardStats.obstructionHotspots}
            icon={Construction}
            variant="default"
          />
          <SummaryCard
            title="Peak-Hour Alerts"
            value={dashboardStats.peakHourAlerts}
            icon={Clock}
            variant="danger"
          />
        </div>

        {/* Live City Heatmap */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-traffic-red animate-pulse" />
            Live City Heatmap
          </h2>
          <CityHeatmap />
        </div>

        {/* Peak Hour Alerts */}
        <div className="gov-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Bell className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Peak-Hour Traffic Alerts</h2>
                <p className="text-sm text-muted-foreground">Predictive alerts based on historical data</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border">
            {trafficAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 px-5 py-3">
                <AlertTypeBadge type={alert.alertType} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.location}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Expected: <span className="font-medium text-foreground">{alert.expectedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rule Engine Panel */}
        <RuleEnginePanel />

        {/* Daily Action List */}
        <DailyActionList />

        {/* System Philosophy Footer */}
        <div className="gov-card bg-primary/5 border-primary/20">
          <div className="px-6 py-4 text-center">
            <p className="text-sm text-primary font-medium mb-1">
              "We don't just show traffic. We decide what rule should apply, where, and when."
            </p>
            <p className="text-xs text-muted-foreground">
              Software decisions, enforced by humans. No hardware. No sensors. No fantasy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
