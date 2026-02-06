import { SMCHeader } from "@/components/smc/SMCHeader";
import { parkingImpactAreas } from "@/data/mockData";
import { ParkingCircle, MapPin, Clock, AlertCircle, TrendingUp } from "lucide-react";

export default function SMCParking() {
  return (
    <div className="min-h-screen">
      <SMCHeader 
        title="Parking Impact Zones" 
        subtitle="Traffic damage caused by parking — used to create rules, not allocate parking" 
      />
      <div className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="gov-card bg-warning/5 border-warning/20 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Purpose of this module</p>
              <p className="text-sm text-muted-foreground mt-1">
                This module identifies roads where illegal or excessive parking repeatedly causes traffic breakdown. 
                It is used to create parking rules, not to manage parking allocation.
              </p>
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="gov-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <ParkingCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Roads Ranked by Parking Impact Severity</h2>
                <p className="text-sm text-muted-foreground">Higher score = Greater traffic damage from parking</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Road</th>
                  <th>Impact Score</th>
                  <th>Peak Congestion Time</th>
                  <th>Reports</th>
                  <th>Last Rule Applied</th>
                </tr>
              </thead>
              <tbody>
                {parkingImpactAreas.map((area, index) => (
                  <tr key={area.id}>
                    <td>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{area.road}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-warning to-destructive rounded-full"
                            style={{ width: `${area.impactScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{area.impactScore}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {area.peakCongestionTime}
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        {area.reportCount}
                      </span>
                    </td>
                    <td>
                      {area.lastRuleApplied ? (
                        <span className="text-sm text-success">{area.lastRuleApplied}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">No rule applied</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
