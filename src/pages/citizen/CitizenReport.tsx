import { useState, useRef } from "react";
import {
  ParkingCircle,
  ShoppingCart,
  AlertTriangle,
  TrafficCone,
  Camera,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { createReport } from "@/lib/api";
import type { IssueType } from "@/lib/api";

const reportOptions: {
  id: IssueType;
  icon: typeof ParkingCircle;
  label: string;
  description: string;
}[] = [
  { id: "parking", icon: ParkingCircle, label: "Illegal Parking", description: "Vehicle parked in no-parking zone" },
  { id: "hawker", icon: ShoppingCart, label: "Hawker Blocking Road", description: "Street vendor causing obstruction" },
  { id: "blocked", icon: AlertTriangle, label: "Road Blocked / Accident", description: "Road blockage or accident scene" },
  { id: "signal", icon: TrafficCone, label: "Broken Signal", description: "Traffic signal not working" },
];

export default function CitizenReport() {
  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCaptureClick = () => {
    if (typeof window !== "undefined" && "mediaDevices" in navigator) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        fileInputRef.current?.setAttribute("capture", "environment");
      } else {
        fileInputRef.current?.removeAttribute("capture");
      }
      fileInputRef.current?.click();
    } else {
      fileInputRef.current?.removeAttribute("capture");
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoDataUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      return;
    }
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Could not get location. You can still submit without it."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      setSubmitError("Please select an issue type.");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Please enter your phone number.");
      return;
    }
    if (!photoFile) {
      setSubmitError("Please add a photo to submit your report.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await createReport({
        issue_type: selectedType,
        description: description.trim() || undefined,
        latitude: location?.lat,
        longitude: location?.lng,
        location_text: location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : undefined,
        phone_number: phone.trim(),
        photoFile,
      });
      setGeneratedReportId(result.report_id);
      setIsSubmitted(true);
      // Optionally store report ID locally for quick tracking
      try {
        const existing = JSON.parse(localStorage.getItem("citizen_report_ids") || "[]") as string[];
        if (!existing.includes(result.report_id)) {
          existing.unshift(result.report_id);
          localStorage.setItem("citizen_report_ids", JSON.stringify(existing.slice(0, 20)));
        }
      } catch {
        // ignore storage errors
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Report Submitted</h1>
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Your Report ID</p>
          <p className="text-xl font-mono font-bold text-primary">{generatedReportId}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Your report has been successfully submitted. Use this Report ID to track progress and ensure transparency.
          </p>
        </div>
        <p className="text-muted-foreground mb-6">Thank you. This helps improve traffic management in Solapur.</p>
        <div className="flex flex-col gap-3">
          <Link to="/citizen/my-reports" className="btn-gov-primary inline-flex items-center justify-center gap-2">
            Track Report Status
          </Link>
          <Link
            to="/citizen"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (selectedType) {
    const selected = reportOptions.find((o) => o.id === selectedType)!;
    const SelectedIcon = selected.icon;

    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <button
          onClick={() => setSelectedType(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </button>

        <div className="gov-card p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <SelectedIcon className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{selected.label}</h2>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>
          </div>
        </div>

        <div className="gov-card p-5 mb-6">
          <h3 className="font-medium text-foreground mb-3">Add Photo (Recommended)</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {photoDataUrl ? (
            <div className="space-y-2">
              <img
                src={photoDataUrl}
                alt="Upload"
                className="w-full aspect-video object-cover rounded-lg border border-border"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCaptureClick}
                  className="text-sm text-primary hover:underline"
                >
                  Change photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoDataUrl(null);
                  }}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCaptureClick}
              className="w-full aspect-video bg-muted/30 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Capture photo or choose from gallery</span>
            </button>
          )}
          <p className="text-xs text-muted-foreground mt-3">Photos help verify reports and speed up action</p>
        </div>

        <div className="gov-card p-5 mb-6">
          <h3 className="font-medium text-foreground mb-3">Location</h3>
          {location ? (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Location captured</p>
                <p className="text-xs text-muted-foreground">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
              </div>
              <span className="ml-auto text-xs bg-success/10 text-success px-2 py-1 rounded">✓</span>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={requestLocation}
                className="w-full flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50"
              >
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Use my location</span>
              </button>
              {locationError && <p className="text-xs text-destructive">{locationError}</p>}
            </div>
          )}
        </div>

        <div className="gov-card p-5 mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Phone number *</label>
          <Input
            type="tel"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="gov-card p-5 mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Description (optional)</label>
          <Input
            type="text"
            placeholder="Brief description of the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>

        {submitError && (
          <p className="text-sm text-destructive mb-4">{submitError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full btn-gov-primary py-3 text-base flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Submit Report
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Your report will be reviewed by SMC Traffic Department
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-warning/10 mx-auto mb-4">
          <AlertTriangle className="h-7 w-7 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Report Traffic Issue</h1>
        <p className="text-muted-foreground">Select the type of problem you want to report</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reportOptions.map((option) => {
          const Icon = option.icon;
          const colorMap: Record<IssueType, string> = {
            parking: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
            hawker: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
            blocked: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
            signal: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
          };
          return (
            <button
              key={option.id}
              onClick={() => setSelectedType(option.id)}
              className={cn(
                "group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all",
                "hover:shadow-md active:scale-[0.98]",
                colorMap[option.id]
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">{option.label}</p>
                <p className="text-xs opacity-80 mt-1">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          <span className="font-medium">Your privacy matters:</span> Your reports help SMC make better decisions.
        </p>
      </div>
    </div>
  );
}
