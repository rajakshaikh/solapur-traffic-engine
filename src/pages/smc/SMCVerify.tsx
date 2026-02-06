import { useEffect, useState } from "react";
import { SMCHeader } from "@/components/smc/SMCHeader";
import { Camera, CheckCircle, XCircle, AlertCircle, Upload, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { listPhotoReports, updatePhotoVerificationStatus, type PhotoVerificationReport } from "@/lib/api";

const statusConfig: Record<
  "Valid" | "Unclear" | "Possibly Fake",
  { label: string; icon: typeof CheckCircle; className: string }
> = {
  Valid: { label: "Valid", icon: CheckCircle, className: "bg-success/10 text-success" },
  Unclear: { label: "Unclear", icon: AlertCircle, className: "bg-warning/10 text-warning" },
  "Possibly Fake": { label: "Possibly Fake", icon: XCircle, className: "bg-destructive/10 text-destructive" },
};

export default function SMCVerify() {
  const [filter, setFilter] = useState<"all" | "Pending" | "Valid" | "Unclear" | "Possibly Fake">("all");
  const [reports, setReports] = useState<PhotoVerificationReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPhotoReports();
      setReports(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load photo reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: "Valid" | "Unclear" | "Possibly Fake") => {
    try {
      const updated = await updatePhotoVerificationStatus(reportId, status);
      setReports((prev) =>
        prev.map((r) => (r.report_id === reportId ? { ...r, photo_verification_status: updated.photo_verification_status ?? status } : r)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.photo_status === filter);

  return (
    <div className="min-h-screen">
      <SMCHeader 
        title="Photo Verification" 
        subtitle="Minimal AI verification of citizen-submitted photos" 
      />
      <div className="p-6 space-y-6">
        {/* Verification Info */}
        <div className="gov-card bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Photo Verification System</p>
              <p className="text-sm text-muted-foreground mt-1">
                When citizen photos are uploaded, the system checks for: vehicle presence, obstruction visibility.
                <br />
                <span className="font-medium">No face recognition. No surveillance. Simple verification only.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(["all", "Pending", "Valid", "Unclear", "Possibly Fake"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {status === "all"
                ? "All Reports"
                : status === "Pending"
                ? "Pending"
                : statusConfig[status].label}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading photo reports...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const effectiveStatus =
              report.photo_status === "Pending"
                ? "Unclear"
                : (report.photo_status as "Valid" | "Unclear" | "Possibly Fake");
            const config = statusConfig[effectiveStatus];
            const StatusIcon = config.icon;

            return (
              <div key={report.report_id} className="gov-card overflow-hidden">
                {/* Image */}
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  {report.photo_url ? (
                    <img
                      src={report.photo_url}
                      alt={report.report_id}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-1">
                        ID: {report.report_id}
                      </p>
                      <p className="font-medium text-foreground">{report.location || "Location not provided"}</p>
                      <p className="text-sm text-muted-foreground">{report.issue_type}</p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        config.className,
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(report.submitted_at).toLocaleString()}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <button
                      className="flex-1 btn-gov-secondary text-xs py-1.5"
                      onClick={() => handleUpdateStatus(report.report_id, "Valid")}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Valid
                    </button>
                    <button
                      className="flex-1 btn-gov-secondary text-xs py-1.5"
                      onClick={() => handleUpdateStatus(report.report_id, "Unclear")}
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Mark Unclear
                    </button>
                    <button
                      className="flex-1 btn-gov-secondary text-xs py-1.5"
                      onClick={() => handleUpdateStatus(report.report_id, "Possibly Fake")}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Mark Fake
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
