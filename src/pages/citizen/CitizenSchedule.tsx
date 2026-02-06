import { busScheduleEntries } from "@/data/mockData";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Helper to calculate updated ETA
function calculateETA(scheduledTime: string, delayMinutes: number): string {
  if (delayMinutes === 0) return scheduledTime;
  
  const [time, period] = scheduledTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let totalMinutes = hours * 60 + minutes + delayMinutes;
  let newHours = Math.floor(totalMinutes / 60) % 12;
  if (newHours === 0) newHours = 12;
  const newMinutes = totalMinutes % 60;
  
  // Handle AM/PM transition
  let newPeriod = period;
  const originalTotalMinutes = hours * 60 + minutes + (period === 'PM' && hours !== 12 ? 720 : 0);
  const newTotalMinutes = originalTotalMinutes + delayMinutes;
  if (newTotalMinutes >= 720 && originalTotalMinutes < 720) {
    newPeriod = 'PM';
  }
  
  return `${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
}

export default function CitizenSchedule() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
          <Calendar className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Bus Schedule Timetable</h1>
        <p className="text-muted-foreground">
         View scheduled bus timings with peak-hour delay indicators
        </p>
      </div>

      {/* Schedule Table */}
      <div className="gov-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Route</TableHead>
                <TableHead className="font-semibold">From → To</TableHead>
                <TableHead className="font-semibold">Major Stops</TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    Scheduled
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">Delay</TableHead>
                <TableHead className="font-semibold text-center">Updated ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {busScheduleEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/30">
                  {/* Route */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                        {entry.routeNumber}
                      </span>
                    </div>
                  </TableCell>

                  {/* From - To */}
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium text-foreground">{entry.from}</span>
                      <span className="text-muted-foreground mx-2">→</span>
                      <span className="font-medium text-foreground">{entry.to}</span>
                    </div>
                  </TableCell>

                  {/* Major Stops */}
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-[200px]">
                      {entry.majorStops.join(' • ')}
                    </div>
                  </TableCell>

                  {/* Scheduled Time */}
                  <TableCell className="text-center">
                    <span className="font-medium text-foreground">{entry.scheduledTime}</span>
                  </TableCell>

                  {/* Expected Delay */}
                  <TableCell className="text-center">
                    {entry.expectedDelayMinutes === 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4 text-traffic-green" />
                        <span className="text-sm font-medium text-traffic-green">On Time</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <AlertCircle className={cn(
                            "h-4 w-4",
                            entry.expectedDelayMinutes > 10 ? "text-traffic-red" : "text-warning"
                          )} />
                          <span className={cn(
                            "text-sm font-medium",
                            entry.expectedDelayMinutes > 10 ? "text-traffic-red" : "text-warning"
                          )}>
                            +{entry.expectedDelayMinutes} min
                          </span>
                        </div>
                        {entry.delayReason && (
                          <span className="text-xs text-muted-foreground mt-0.5 max-w-[120px] truncate" title={entry.delayReason}>
                            {entry.delayReason}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Updated ETA */}
                  <TableCell className="text-center">
                    <span className={cn(
                      "font-semibold",
                      entry.expectedDelayMinutes === 0 ? "text-foreground" : "text-primary"
                    )}>
                      {calculateETA(entry.scheduledTime, entry.expectedDelayMinutes)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Legend and Notes */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="gov-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Delay Status Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-traffic-green" />
              <span className="text-muted-foreground">On Time – No traffic delays</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <span className="text-muted-foreground">Minor Delay – Up to 10 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-traffic-red" />
              <span className="text-muted-foreground">Significant Delay – Over 10 minutes</span>
            </div>
          </div>
        </div>

        <div className="gov-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">About This Schedule</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Delays are estimated based on current traffic conditions</li>
            <li>• Updated ETA reflects expected arrival time</li>
            <li>• Schedule may vary during holidays and special events</li>
          </ul>
        </div>
      </div>

      {/* Purpose Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Purpose:</span> Help citizens plan travel and reduce roadside waiting
        </p>
      </div>
    </div>
  );
}
