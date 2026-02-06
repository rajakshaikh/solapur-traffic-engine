import { ruleRecommendations, RuleRecommendation } from "@/data/mockData";
import { PriorityBadge, StatusBadge } from "./Badges";
import { FileText, MapPin, Clock, AlertCircle } from "lucide-react";

const problemTypeIcons: Record<string, string> = {
  parking: "🅿️",
  hawker: "🛒",
  congestion: "🚗",
  signal: "🚦",
};

export function RuleEnginePanel() {
  return (
    <div className="gov-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              System-Generated Traffic & Parking Rules
            </h2>
            <p className="text-sm text-muted-foreground">
              Automated recommendations based on patterns
            </p>
          </div>
        </div>

        <button className="btn-gov-secondary text-sm">
          Export Rules
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Recommended Rule</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {ruleRecommendations.map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 px-5 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          Rules are advisory only. Manual approval required.
        </p>
      </div>
    </div>
  );
}

function RuleRow({ rule }: { rule: RuleRecommendation }) {
  return (
    <tr className="hover:bg-muted/40 transition">
      <td className="px-4 py-3 font-medium">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {rule.location}
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          {problemTypeIcons[rule.problemType]}
          <span className="capitalize">{rule.problemType}</span>
        </span>
      </td>

      <td className="px-4 py-3 max-w-sm">
        <p className="font-medium text-foreground">
          {rule.recommendedRule}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {rule.reason}
        </p>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {rule.timeWindow}
        </div>
      </td>

      <td className="px-4 py-3">
        <PriorityBadge priority={rule.priority} />
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={rule.status} />
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
            Approve
          </button>
          <button className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted">
            Ignore
          </button>
        </div>
      </td>
    </tr>
  );
}
