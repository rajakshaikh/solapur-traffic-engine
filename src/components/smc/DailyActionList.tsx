import { actionItems, ActionItem } from "@/data/mockData";
import { PriorityBadge } from "./Badges";
import {
  ClipboardList,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";

const enforcementTypeColors: Record<string, string> = {
  Police: "bg-primary/10 text-primary",
  Ward: "bg-success/10 text-success",
  "Traffic Dept": "bg-warning/10 text-warning",
};

export function DailyActionList() {
  return (
    <div className="gov-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <ClipboardList className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Today's Traffic Action List
            </h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <button className="btn-gov-primary text-sm">Print List</button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[40px_160px_1fr_140px_140px_100px_120px] gap-4 px-5 py-3 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
        <span>#</span>
        <span>Location</span>
        <span>Issue & Action</span>
        <span>Time</span>
        <span>Enforcement</span>
        <span>Priority</span>
        <span></span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {actionItems.map((item, index) => (
          <ActionRow key={item.id} item={item} index={index + 1} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">
            “This tells me exactly what to do today.”
          </span>{" "}
          — Prioritized by urgency and impact.
        </p>
      </div>
    </div>
  );
}

function ActionRow({ item, index }: { item: ActionItem; index: number }) {
  return (
    <div className="grid grid-cols-[40px_160px_1fr_140px_140px_100px_120px] gap-4 px-5 py-3 items-center hover:bg-muted/40 transition-colors">
      {/* Index */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
        {index}
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <MapPin className="h-4 w-4 text-primary" />
        {item.location}
      </div>

      {/* Issue */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {item.issueSummary}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          → {item.suggestedAction}
        </p>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        {item.timeSlot}
      </div>

      {/* Enforcement */}
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          enforcementTypeColors[item.enforcementType]
        }`}
      >
        <Users className="h-3 w-3" />
        {item.enforcementType}
      </span>

      {/* Priority */}
      <PriorityBadge priority={item.priority} />

      {/* Action */}
      <button className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-success hover:bg-success/10">
        <CheckCircle2 className="h-4 w-4" />
        Mark Done
      </button>
    </div>
  );
}

