import { useState, useEffect, useCallback } from "react";
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
  Image as ImageIcon,
} from "lucide-react";
import {
  getAllReports,
  updateReportStatus,
  getFullImageUrl,
  reportStatusLabels,
  type Report,
  type ReportStatus,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
  string,
  { icon: typeof CheckCircle2; color: string; bgColor: string }
> = {
  RECEIVED: { icon: Clock, color: "text-muted-foreground", bgColor: "bg-muted" },
  UNDER_REVIEW: { icon: Loader2, color: "text-warning", bgColor: "bg-warning/10" },
  ACTION_PLANNED: { icon: AlertCircle, color: "text-primary", bgColor: "bg-primary/10" },
  CLOSED: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  APPROVED: { icon: AlertCircle, color: "text-primary", bgColor: "bg-primary/10" },
  IGNORED: { icon: CheckCircle2, color: "text-muted-foreground", bgColor: "bg-muted" },
};

const SMC_STATUSES: ReportStatus[] = [
  "RECEIVED",
  "UNDER_REVIEW",
  "ACTION_PLANNED",
  "CLOSED",
];

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

export default function SMCReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [photoModalUrl, setPhotoModalUrl] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllReports();
      setReports(data);
    } catch (err) {
      toast({
        title: "Failed to load reports",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.report_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.location_text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.phone_number || "").includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" ||
      report.status === statusFilter ||
      (statusFilter === "CLOSED" && report.status === "IGNORED");
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    setUpdatingId(reportId);
    try {
      const updated = await updateReportStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((r) => (r.report_id === reportId ? updated : r))
      );
      toast({
        title: "Status Updated",
        description: `Report ${reportId} set to "${reportStatusLabels[newStatus]}"`,
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCounts = {
    RECEIVED: reports.filter((r) => r.status === "RECEIVED").length,
    UNDER_REVIEW: reports.filter((r) => r.status === "UNDER_REVIEW").length,
    ACTION_PLANNED: reports.filter((r) => r.status === "ACTION_PLANNED").length,
    CLOSED: reports.filter((r) => r.status === "CLOSED" || r.status === "IGNORED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          Citizen Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and update status of citizen-reported issues
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["RECEIVED", "UNDER_REVIEW", "ACTION_PLANNED", "CLOSED"] as const).map(
          (status) => {
            const config = statusConfig[status] || statusConfig.RECEIVED;
            const Icon = config.icon;
            const count =
              status === "CLOSED"
                ? statusCounts.CLOSED
                : statusCounts[status];
            return (
              <div key={status} className="gov-card p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">
                      {reportStatusLabels[status]}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="gov-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by Report ID, location, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {SMC_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {reportStatusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="gov-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading reports…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {reports.length === 0
                      ? "No reports yet. Citizen reports will appear here."
                      : "No reports found matching your criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => {
                  const IssueIcon =
                    issueTypeIcons[report.issue_type as keyof typeof issueTypeIcons] ||
                    AlertTriangle;
                  const statusInfo =
                    statusConfig[report.status] || statusConfig.RECEIVED;
                  const StatusIcon = statusInfo.icon;
                  const hasPhoto = !!(report.photo_path || report.image_url);
                  const photoUrl = hasPhoto
                    ? getFullImageUrl(
                        report.image_url ||
                          (report.photo_path ? "/" + report.photo_path : null)
                      )
                    : null;

                  return (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium font-mono">
                        {report.report_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IssueIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {issueTypeLabels[report.issue_type] ||
                              report.issue_type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={report.location_text || ""}
                      >
                        {report.location_text || "—"}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatDateTime(report.created_at)}
                      </TableCell>
                      <TableCell>
                        {hasPhoto ? (
                          <button
                            type="button"
                            onClick={() => setPhotoModalUrl(photoUrl)}
                            className="inline-flex items-center justify-center rounded border border-border bg-muted/30 hover:bg-muted/60 p-1.5 transition-colors"
                            title="View photo"
                          >
                            <ImageIcon className="h-4 w-4 text-primary" />
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No photo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            statusInfo.bgColor,
                            statusInfo.color,
                            "border-0"
                          )}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {reportStatusLabels[report.status] || report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={report.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              report.report_id,
                              value as ReportStatus
                            )
                          }
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
                            {SMC_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {reportStatusLabels[s]}
                              </SelectItem>
                            ))}
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

      <Dialog
        open={!!photoModalUrl}
        onOpenChange={(open) => !open && setPhotoModalUrl(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogTitle className="sr-only">Report photo</DialogTitle>
          {photoModalUrl && (
            <img
              src={photoModalUrl}
              alt="Report"
              className="w-full h-auto rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
