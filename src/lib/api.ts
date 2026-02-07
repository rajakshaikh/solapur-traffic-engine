// Backend API base URL (fixed for local demo on port 8001)
const API_BASE = import.meta.env.VITE_API_BASE_URL;


export type IssueType = "parking" | "hawker" | "blocked" | "signal";
export type ReportStatus =
  | "RECEIVED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "IGNORED"
  | "CLOSED";

export interface Report {
  id: string;
  report_id: string;
  issue_type: IssueType;
  description: string | null;
  image_url: string | null;
  photo_path?: string | null;
  latitude: number | null;
  longitude: number | null;
  location_text: string | null;
  phone_number: string;
  status: ReportStatus;
  created_at: string;
  approved_at: string | null;
  closed_at: string | null;
  updated_at: string | null;
  photo_verification_status?: "Valid" | "Unclear" | "Possibly Fake" | null;
}

export async function createReport(body: {
  issue_type: IssueType;
  description?: string;
  latitude?: number;
  longitude?: number;
  location_text?: string;
  phone_number: string;
  photoFile?: File;
}): Promise<{ success: boolean; report_id: string; status: ReportStatus }> {
  const form = new FormData();
  form.append("issue_type", body.issue_type);
  form.append("phone_number", body.phone_number);
  if (body.description != null) form.append("description", body.description);
  if (body.latitude != null) form.append("latitude", String(body.latitude));
  if (body.longitude != null) form.append("longitude", String(body.longitude));
  if (body.location_text) form.append("location", body.location_text);
  if (body.photoFile) form.append("photo", body.photoFile);

  const r = await fetch(`${API_BASE}/api/reports`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Failed to submit report");
  }
  return r.json();
}

// The previous Cloudinary-based upload endpoints are no longer used for the
// citizen flow. Photos are now submitted directly with the report.

export async function searchReports(params: {
  report_id?: string;
  phone?: string;
}): Promise<Report[]> {
  const sp = new URLSearchParams();
  if (params.report_id) sp.set("report_id", params.report_id);
  if (params.phone) sp.set("phone", params.phone);
  const q = sp.toString();
  if (!q) throw new Error("Provide report_id or phone");
  const r = await fetch(`${API_BASE}/api/reports/search?${q}`);
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Search failed");
  }
  return r.json();
}

export async function getReport(reportId: string): Promise<Report> {
  const r = await fetch(`${API_BASE}/api/reports/${encodeURIComponent(reportId)}`);
  if (!r.ok) {
    if (r.status === 404) throw new Error("Report not found");
    const err = await r.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Failed to fetch report");
  }
  return r.json();
}

export const reportStatusLabels: Record<ReportStatus, string> = {
  RECEIVED: "Received",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  IGNORED: "Ignored",
  CLOSED: "Closed",
};

export interface PhotoVerificationReport {
  report_id: string;
  issue_type: IssueType;
  location: string | null;
  photo_url: string;
  submitted_at: string;
  photo_status: "Pending" | "Valid" | "Unclear" | "Possibly Fake";
}

export async function listPhotoReports(): Promise<PhotoVerificationReport[]> {
  const r = await fetch(`${API_BASE}/api/reports/photos`);
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Failed to fetch photo reports");
  }
  return r.json();
}

export async function updatePhotoVerificationStatus(
  reportId: string,
  status: "Valid" | "Unclear" | "Possibly Fake"
): Promise<Report> {
  const r = await fetch(`${API_BASE}/api/reports/${encodeURIComponent(reportId)}/photo-status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photo_status: status }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Failed to update photo status");
  }
  return r.json();
}

const ADMIN_AUTH_KEY = "smc_admin_auth";

export function setAdminAuth(username: string, password: string) {
  const encoded = btoa(`${username}:${password}`);
  sessionStorage.setItem(ADMIN_AUTH_KEY, encoded);
}

export function clearAdminAuth() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}

export function getAdminAuth(): string | null {
  return sessionStorage.getItem(ADMIN_AUTH_KEY);
}

function adminHeaders(): HeadersInit {
  const auth = getAdminAuth();
  return auth ? { Authorization: `Basic ${auth}` } : {};
}

export async function adminListReports(params: {
  status?: ReportStatus;
  issue_type?: IssueType;
  skip?: number;
  limit?: number;
}): Promise<Report[]> {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.issue_type) sp.set("issue_type", params.issue_type);
  if (params.skip != null) sp.set("skip", String(params.skip));
  if (params.limit != null) sp.set("limit", String(params.limit));
  const r = await fetch(`${API_BASE}/api/admin/reports?${sp}`, { headers: adminHeaders() });
  if (r.status === 401) throw new Error("Unauthorized");
  if (!r.ok) throw new Error("Failed to fetch reports");
  return r.json();
}

export async function adminUpdateReportStatus(
  reportId: string,
  status: ReportStatus
): Promise<Report> {
  const r = await fetch(`${API_BASE}/api/admin/reports/${encodeURIComponent(reportId)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminHeaders() },
    body: JSON.stringify({ status }),
  });
  if (r.status === 401) throw new Error("Unauthorized");
  if (!r.ok) throw new Error("Failed to update status");
  return r.json();
}
