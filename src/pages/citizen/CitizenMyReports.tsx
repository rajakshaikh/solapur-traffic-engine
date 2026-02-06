import { useState } from "react";
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ParkingCircle,
  ShoppingCart,
  AlertTriangle,
  TrafficCone,
  Calendar,
} from "lucide-react";
import { searchReports, reportStatusLabels, type Report, type ReportStatus } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const issueTypeIcons = {
  parking: ParkingCircle,
  hawker: ShoppingCart,
  blocked: AlertTriangle,
  signal: TrafficCone,
};

const issueTypeLabels: Record<string, string> = {
  parking: "Illegal Parking",
  hawker: "Hawker Blocking",
  blocked: "Road Blocked",
  signal: "Broken Signal",
};

const statusConfig: Record<
  ReportStatus,
  { icon: typeof CheckCircle2; color: string; bgColor: string }
> = {
  RECEIVED: { icon: Clock, color: "text-muted-foreground", bgColor: "bg-muted" },
  UNDER_REVIEW: { icon: Loader2, color: "text-warning", bgColor: "bg-warning/10" },
  APPROVED: { icon: AlertCircle, color: "text-primary", bgColor: "bg-primary/10" },
  IGNORED: { icon: AlertCircle, color: "text-muted-foreground", bgColor: "bg-muted" },
  CLOSED: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function CitizenMyReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) {
      setReports([]);
      setHasSearched(false);
      setError(null);
      return;
    }
    setError(null);
    setLoading(true);
    setHasSearched(true);
    try {
      const isLikelyPhone = /^\d{10}$/.test(q.replace(/\s/g, ""));
      const results = await searchReports(
        isLikelyPhone ? { phone: q } : { report_id: q }
      );
      setReports(results);
    } catch (err) {
      setReports([]);
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">My Reports</h1>
        <p className="text-muted-foreground">Track the status of your reported issues</p>
      </div>

      <div className="gov-card p-5 mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Enter Report ID or Phone Number
        </label>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="e.g. SLP-2026-24059 or 9876543210"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-gov-primary flex items-center gap-2 px-4"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          No login required. Use your phone number to see all your reports.
        </p>
      </div>

      <div className="gov-card p-4 mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Status Guide</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(Object.entries(statusConfig) as [ReportStatus, typeof statusConfig.RECEIVED][]).map(
            ([status, config]) => {
              const Icon = config.icon;
              return (
                <div key={status} className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", config.color)} />
                  <span className="text-muted-foreground">{reportStatusLabels[status]}</span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {error && (
        <div className="gov-card p-6 mb-6 border-destructive/50 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {hasSearched && !loading && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="gov-card p-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">No Reports Found</h3>
              <p className="text-sm text-muted-foreground">
                No reports match your search. Check Report ID or phone number.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Found {reports.length} report{reports.length !== 1 ? "s" : ""}
              </p>
              {reports.map((report) => {
                const IssueIcon = issueTypeIcons[report.issue_type];
                const statusInfo = statusConfig[report.status];
                const StatusIcon = statusInfo.icon;
                return (
                  <div key={report.id} className="gov-card p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <IssueIcon className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{report.report_id}</p>
                          <p className="text-xs text-muted-foreground">
                            {issueTypeLabels[report.issue_type] ?? report.issue_type}
                          </p>
                        </div>
                      </div>
                      <Badge className={cn(statusInfo.bgColor, statusInfo.color, "border-0")}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {reportStatusLabels[report.status]}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      {report.location_text && (
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Location</span>
                          <span className="text-foreground font-medium text-right max-w-[60%]">
                            {report.location_text}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reported On</span>
                        <span className="text-foreground">{formatDate(report.created_at)}</span>
                      </div>
                      {report.approved_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Approved On</span>
                          <span className="text-foreground">{formatDate(report.approved_at)}</span>
                        </div>
                      )}
                      {report.closed_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Closed On</span>
                          <span className="text-foreground">{formatDate(report.closed_at)}</span>
                        </div>
                      )}
                      {report.updated_at && !report.approved_at && !report.closed_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated</span>
                          <span className="text-foreground">{formatDate(report.updated_at)}</span>
                        </div>
                      )}
                    </div>

                    {report.description && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    )}

                    {report.image_url && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <a
                          href={report.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View attached photo
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          <span className="font-medium">Note:</span> Status updates are from SMC. Resolution
          timelines depend on the nature and priority of the issue.
        </p>
      </div>
    </div>
  );
}
