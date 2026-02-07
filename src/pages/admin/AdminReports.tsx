import { useState, useEffect } from "react";
import {
  FileText,
  ParkingCircle,
  ShoppingCart,
  AlertTriangle,
  TrafficCone,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  adminListReports,
  adminUpdateReportStatus,
  reportStatusLabels,
  getFullImageUrl,
  type Report,
  type ReportStatus,
  type IssueType,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await adminListReports({
        status: statusFilter === "all" ? undefined : (statusFilter as ReportStatus),
        issue_type: issueFilter === "all" ? undefined : (issueFilter as IssueType),
        limit: 200,
      });
      setReports(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, issueFilter]);

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    setUpdatingId(reportId);
    try {
      const updated = await adminUpdateReportStatus(reportId, newStatus);
      setReports((prev) => prev.map((r) => (r.report_id === reportId ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCounts = {
    RECEIVED: reports.filter((r) => r.status === "RECEIVED").length,
    UNDER_REVIEW: reports.filter((r) => r.status === "UNDER_REVIEW").length,
    APPROVED: reports.filter((r) => r.status === "APPROVED").length,
    IGNORED: reports.filter((r) => r.status === "IGNORED").length,
    CLOSED: reports.filter((r) => r.status === "CLOSED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          Citizen Reports
        </h1>
        <p className="text-muted-foreground mt-1">Manage and update status of citizen-reported issues</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.entries(statusCounts) as [ReportStatus, number][]).map(([status, count]) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <div key={status} className="gov-card p-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bgColor)}>
                  <Icon className={cn("h-5 w-5", config.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground">{reportStatusLabels[status]}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="gov-card p-4 flex flex-wrap gap-4 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="IGNORED">Ignored</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={issueFilter} onValueChange={setIssueFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Issue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="parking">Illegal Parking</SelectItem>
            <SelectItem value="hawker">Hawker Blocking</SelectItem>
            <SelectItem value="blocked">Road Blocked</SelectItem>
            <SelectItem value="signal">Broken Signal</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => fetchReports()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="gov-card p-4 border-destructive/50 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="gov-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Closed</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No reports found
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => {
                  const IssueIcon = issueTypeIcons[report.issue_type];
                  const statusInfo = statusConfig[report.status];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono font-medium">{report.report_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IssueIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{issueTypeLabels[report.issue_type]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate" title={report.location_text ?? ""}>
                        {report.location_text || "—"}
                      </TableCell>
                      <TableCell className="text-sm">{report.phone_number}</TableCell>
                      <TableCell className="text-sm">{formatDate(report.created_at)}</TableCell>
                      <TableCell className="text-sm">{formatDate(report.approved_at)}</TableCell>
                      <TableCell className="text-sm">{formatDate(report.closed_at)}</TableCell>
                      <TableCell>
                        {getFullImageUrl(report.image_url) ? (
                          <a
                            href={getFullImageUrl(report.image_url)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(statusInfo.bgColor, statusInfo.color, "border-0")}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {reportStatusLabels[report.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={report.status}
                          onValueChange={(value) => handleStatusChange(report.report_id, value as ReportStatus)}
                          disabled={updatingId === report.report_id}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs">
                            {updatingId === report.report_id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RECEIVED">Received</SelectItem>
                            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="IGNORED">Ignored</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
