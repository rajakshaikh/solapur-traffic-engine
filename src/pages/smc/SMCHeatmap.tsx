import { SMCHeader } from "@/components/smc/SMCHeader";
import { CityHeatmap } from "@/components/smc/CityHeatmap";

export default function SMCHeatmap() {
  return (
    <div className="min-h-screen">
      <SMCHeader 
        title="City Heatmap" 
        subtitle="Real-time traffic visualization" 
      />
      <div className="p-6">
        <CityHeatmap />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heatmap Controls */}
          <div className="gov-card p-5">
            <h3 className="font-semibold text-foreground mb-4">Heatmap Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Time Range</label>
                <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <option>Last 1 hour</option>
                  <option>Last 6 hours</option>
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Data Source</label>
                <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <option>All Sources</option>
                  <option>Citizen Reports</option>
                  <option>Traffic Pattern Analysis</option>
                  <option>Historical Data</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="gov-card p-5">
            <h3 className="font-semibold text-foreground mb-4">Current Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Active Congestion Points</span>
                <span className="font-semibold text-foreground">7</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Average Traffic Speed</span>
                <span className="font-semibold text-foreground">18 km/h</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Reports Today</span>
                <span className="font-semibold text-foreground">127</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Zones Under Monitoring</span>
                <span className="font-semibold text-foreground">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
