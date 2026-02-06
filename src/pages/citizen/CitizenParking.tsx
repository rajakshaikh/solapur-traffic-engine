import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
// @ts-ignore - leaflet.markercluster types are incomplete
import "leaflet.markercluster";
import {
  MapPin,
  Search,
  Car,
  AlertTriangle,
  Navigation,
  Clock,
  X,
  FileText,
  Bus,
  Map as MapIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  parkingZonesGeoJSON,
  pressureZonesGeoJSON,
  noParkingZonesGeoJSON,
  busStopsGeoJSON,
  type ParkingZone,
} from "@/data/parkingGeoJSON";
import { searchLocationByName } from "@/lib/parkingNominatim";
import {
  analyzeParkingConditions,
  calculateDistance,
  estimateWalkingTime,
} from "@/lib/parkingGuidance";
import { estimateParkingAvailability } from "@/lib/parkingAvailabilityEstimator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER: [number, number] = [17.6599, 75.9064]; // Solapur city center [lat, lng]
const DEFAULT_ZOOM = 15;

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface SelectedParking {
  parking: ParkingZone;
  availability: ReturnType<typeof estimateParkingAvailability>;
  distanceMeters: number;
  walkingTimeMinutes: number;
}

/**
 * Citizen Parking Guidance System using OpenStreetMap + Leaflet
 * No Google Maps, no billing, no watermarks
 */
export default function CitizenParking() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const layersRef = useRef<{
    pressureZones: L.LayerGroup;
    noParkingZones: L.LayerGroup;
    busStops: L.LayerGroup;
  } | null>(null);

  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedParking | null>(null);
  const [pressureAlert, setPressureAlert] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<SelectedParking[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showBusStops, setShowBusStops] = useState(false);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported. Using Solapur city center.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCenter: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setCenter(newCenter);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(newCenter, DEFAULT_ZOOM);
        }
      },
      () => {
        setGeoError("Unable to access your location. Using Solapur city center.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize map with OpenStreetMap tiles
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    // Add OpenStreetMap tile layer (clean, Google-like style)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Create layer groups
    const pressureLayerGroup = L.layerGroup().addTo(map);
    const noParkingLayerGroup = L.layerGroup().addTo(map);
    const busStopsLayerGroup = L.layerGroup().addTo(map);

    layersRef.current = {
      pressureZones: pressureLayerGroup,
      noParkingZones: noParkingLayerGroup,
      busStops: busStopsLayerGroup,
    };

    // Add user location marker
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `<div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #4285F4;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const userMarker = L.marker(center, { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup("Your Location");

    // Draw pressure zones (heatmap-like visualization)
    pressureZonesGeoJSON.forEach((zone) => {
      const color =
        zone.properties.severity === "high"
          ? "#e53935"
          : zone.properties.severity === "medium"
            ? "#fdd835"
            : "#43a047";

      const polygon = L.polygon(zone.geometry.coordinates as any, {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        weight: 2,
        opacity: 0.6,
      }).addTo(pressureLayerGroup);

      polygon.bindPopup(`
        <div style="min-width: 180px;">
          <p style="font-weight: 600; margin: 0 0 4px 0; color: ${color};">${zone.properties.name}</p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            <strong>Severity:</strong> ${zone.properties.severity.toUpperCase()}
          </p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            <strong>Peak Time:</strong> ${zone.properties.peakTime}
          </p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            <strong>Reports:</strong> ${zone.properties.reportCount}
          </p>
        </div>
      `);
    });

    // Draw no-parking zones (dashed red polygons)
    noParkingZonesGeoJSON.forEach((zone) => {
      const polygon = L.polygon(zone.geometry.coordinates as any, {
        color: "#ff0000",
        fillColor: "#ff0000",
        fillOpacity: 0.1,
        weight: 2,
        opacity: 0.8,
        dashArray: "10, 5",
      }).addTo(noParkingLayerGroup);

      polygon.bindPopup(`
        <div style="min-width: 180px;">
          <p style="font-weight: 600; margin: 0 0 4px 0; color: #ff0000;">🚫 ${zone.properties.name}</p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            <strong>Reason:</strong> ${zone.properties.reason}
          </p>
          ${zone.properties.timeWindow ? `
            <p style="font-size: 12px; color: #666; margin: 2px 0;">
              <strong>Time Window:</strong> ${zone.properties.timeWindow}
            </p>
          ` : ""}
        </div>
      `);
    });

    // Add bus stops (optional layer)
    busStopsGeoJSON.forEach((stop) => {
      const busIcon = L.divIcon({
        className: "bus-stop-marker",
        html: `<div style="
          width: 20px;
          height: 20px;
          border-radius: 3px;
          background: #1976d2;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: bold;
        ">🚌</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const busMarker = L.marker(
        [stop.geometry.coordinates[1], stop.geometry.coordinates[0]],
        { icon: busIcon },
      ).addTo(busStopsLayerGroup);

      busMarker.bindPopup(`
        <div style="min-width: 150px;">
          <p style="font-weight: 600; margin: 0 0 4px 0;">🚌 ${stop.properties.name}</p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            <strong>Routes:</strong> ${stop.properties.routes.join(", ")}
          </p>
          ${stop.properties.nextArrival ? `
            <p style="font-size: 12px; color: #666; margin: 2px 0;">
              <strong>Next Arrival:</strong> ${stop.properties.nextArrival}
            </p>
          ` : ""}
        </div>
      `);
    });

    // Initially hide bus stops
    busStopsLayerGroup.removeFrom(map);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when center changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, DEFAULT_ZOOM);
    }
  }, [center]);

  // Add parking markers with clustering
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    if (clusterGroupRef.current) {
      clusterGroupRef.current.clearLayers();
      clusterGroupRef.current.removeFrom(mapInstanceRef.current);
    }

    // Create marker cluster group
    const clusterGroup = new (L as any).MarkerClusterGroup({
      maxClusterRadius: 50,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="
            background: #1976d2;
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">${count}</div>`,
          className: "marker-cluster",
          iconSize: [40, 40],
        });
      },
    });

    // Add parking markers
    parkingZonesGeoJSON.forEach((parking) => {
      const [lng, lat] = parking.geometry.coordinates;
      const availability = estimateParkingAvailability(parking.properties);
      const distance = calculateDistance(
        { lat: center[0], lng: center[1] },
        { lat, lng },
      );
      const walkingTime = estimateWalkingTime(distance);

      // Create custom parking icon based on availability
      const parkingIcon = L.divIcon({
        className: "parking-marker",
        html: `<div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${availability.color};
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        ">🅿️</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: parkingIcon });

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <p style="font-weight: 600; margin: 0 0 4px 0;">🅿️ ${parking.properties.name}</p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            ${parking.properties.address}
          </p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            <strong>Distance:</strong> ${Math.round(distance)}m (~${walkingTime} min walk)
          </p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">
            <strong>Availability:</strong> 
            <span style="color: ${availability.color}; font-weight: 600;">${availability.label}</span>
          </p>
          ${parking.properties.capacity ? `
            <p style="font-size: 12px; color: #666; margin: 2px 0;">
              <strong>Capacity:</strong> ${parking.properties.capacity} slots
            </p>
          ` : ""}
        </div>
      `);

      marker.on("click", () => {
        setSelected({
          parking,
          availability,
          distanceMeters: Math.round(distance),
          walkingTimeMinutes: walkingTime,
        });
        mapInstanceRef.current?.setView([lat, lng], 16);
      });

      clusterGroup.addLayer(marker);
      markersRef.current.push(marker);
    });

    clusterGroup.addTo(mapInstanceRef.current);
    clusterGroupRef.current = clusterGroup;

    // Analyze conditions and generate recommendations
    // Convert GeoJSON parking zones to format expected by analyzeParkingConditions
    const parkingPlaces = parkingZonesGeoJSON.map((p) => {
      const [lng, lat] = p.geometry.coordinates;
      return {
        name: p.properties.name,
        vicinity: p.properties.address,
        formatted_address: p.properties.address,
        geometry: {
          location: { lat, lng },
        },
      };
    });
    const analysis = analyzeParkingConditions(
      { lat: center[0], lng: center[1] },
      parkingPlaces,
    );
    setPressureAlert(analysis.pressureAlert);

    const recs: SelectedParking[] = parkingZonesGeoJSON
      .map((parking) => {
        const [lng, lat] = parking.geometry.coordinates;
        const distance = calculateDistance(
          { lat: center[0], lng: center[1] },
          { lat, lng },
        );
        if (distance > 1000) return null; // Skip if too far

        return {
          parking,
          availability: estimateParkingAvailability(parking.properties),
          distanceMeters: Math.round(distance),
          walkingTimeMinutes: estimateWalkingTime(distance),
        };
      })
      .filter((r): r is SelectedParking => r !== null)
      .sort((a, b) => {
        const levelOrder = {
          LIKELY_AVAILABLE: 0,
          LIMITED: 1,
          LIKELY_FULL: 2,
        };
        const levelDiff =
          levelOrder[a.availability.level] - levelOrder[b.availability.level];
        if (levelDiff !== 0) return levelDiff;
        return a.distanceMeters - b.distanceMeters;
      })
      .slice(0, 3);

    setRecommendations(recs);
  }, [center, parkingZonesGeoJSON]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchLocationByName(searchQuery);
      if (result) {
        const newCenter: [number, number] = [result.lat, result.lng];
        setCenter(newCenter);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(newCenter, 16);
        }
        setSearchQuery("");
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigate = (parking: ParkingZone) => {
    const [lng, lat] = parking.geometry.coordinates;
    const url = `https://www.openstreetmap.org/directions?to=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const toggleBusStops = () => {
    if (!mapInstanceRef.current || !layersRef.current) return;
    if (showBusStops) {
      layersRef.current.busStops.removeFrom(mapInstanceRef.current);
    } else {
      layersRef.current.busStops.addTo(mapInstanceRef.current);
    }
    setShowBusStops(!showBusStops);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <MapIcon className="h-3 w-3" />
          Parking Guidance System (OpenStreetMap)
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Find Parking Around You
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Get intelligent parking guidance with pressure zones, recommendations, and
          walking distance estimates. Powered by OpenStreetMap — no billing, no watermarks.
        </p>
        {geoError && (
          <p className="text-xs text-amber-700 mt-1">{geoError}</p>
        )}
      </header>

      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder='Search area (e.g., "Civil Chowk", "Station Road")'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={toggleBusStops}
          className={cn(showBusStops && "bg-primary/10")}
        >
          <Bus className="h-4 w-4" />
        </Button>
      </div>

      {/* Pressure Alert */}
      {pressureAlert && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{pressureAlert}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider parking further away or using public transport.
            </p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="gov-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">
              Recommended Parking
            </h3>
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <div
                className="h-3 w-3 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: rec.availability.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">
                  {rec.parking.properties.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {rec.parking.properties.address}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {rec.distanceMeters}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{rec.walkingTimeMinutes} min walk
                  </span>
                  <span
                    className="rounded px-1.5 py-0.5 text-[0.65rem] font-semibold text-white"
                    style={{ backgroundColor: rec.availability.color }}
                  >
                    {rec.availability.label}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleNavigate(rec.parking)}
                className="flex-shrink-0"
              >
                <Navigation className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <section className="flex flex-wrap gap-2 text-xs">
        <LegendItem
          color="#e53935"
          label="High Pressure"
          description="Red zone"
        />
        <LegendItem
          color="#fdd835"
          label="Medium Pressure"
          description="Yellow zone"
        />
        <LegendItem
          color="#43a047"
          label="Low Pressure"
          description="Green zone"
        />
        <LegendItem
          color="#ff0000"
          label="No Parking"
          description="Restricted area"
          dashed
        />
      </section>

      {/* Map */}
      <section className="relative border border-border rounded-lg overflow-hidden min-h-[400px] md:min-h-[500px] bg-muted/40">
        <div
          ref={mapContainerRef}
          className="w-full h-full min-h-[400px] md:min-h-[500px]"
        />
        {isSearching && (
          <div className="absolute top-3 right-3 rounded-md bg-background/90 px-3 py-1 text-xs shadow-sm z-[1000]">
            Searching…
          </div>
        )}
        {selected && (
          <div className="absolute bottom-3 left-1/2 z-[1000] w-[95%] max-w-md -translate-x-1/2 rounded-lg bg-background shadow-lg border border-border p-4 text-xs md:text-sm space-y-2">
            <div className="flex items-start justify-between">
              <div className="font-semibold text-foreground">
                🅿️ {selected.parking.properties.name}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-muted-foreground">
              {selected.parking.properties.address}
            </div>
            <div className="flex flex-wrap gap-3 items-center text-xs">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selected.distanceMeters}m away
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{selected.walkingTimeMinutes} min walk
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Estimated availability:</span>
              <span
                className="rounded px-2 py-0.5 text-[0.7rem] font-semibold text-white"
                style={{ backgroundColor: selected.availability.color }}
              >
                {selected.availability.label}
              </span>
            </div>
            <p className="text-[0.68rem] text-muted-foreground">
              {selected.availability.reason}
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => handleNavigate(selected.parking)}
                className="flex-1"
              >
                <Navigation className="h-3 w-3 mr-1" />
                Navigate
              </Button>
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link to="/citizen/report">
                  <FileText className="h-3 w-3 mr-1" />
                  Report Issue
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gov-card p-4">
          <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            No-Parking Zones
          </h3>
          <p className="text-xs text-muted-foreground">
            Red dashed areas indicate restricted parking zones. Check time windows
            for peak-hour restrictions.
          </p>
        </div>
        <div className="gov-card p-4">
          <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
            <Bus className="h-4 w-4 text-primary" />
            Public Transport
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Toggle bus stops on the map. Consider using public transport during peak
            hours to avoid parking stress.
          </p>
          <Link
            to="/citizen/bus"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            Check bus schedule →
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <section className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-3 text-[0.7rem] text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">Disclaimer:</span> Parking
        availability is indicative and based on estimates, not real-time slot data.
        Pressure zones are derived from historical congestion patterns and citizen
        reports. Powered by OpenStreetMap — free and open-source mapping data.
      </section>
    </div>
  );
}

function LegendItem(props: {
  color: string;
  label: string;
  description: string;
  dashed?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 border border-border">
      <span
        className={cn(
          "h-3 w-3 rounded-[4px]",
          props.dashed && "border-2 border-dashed",
        )}
        style={{
          backgroundColor: props.dashed ? "transparent" : props.color,
          borderColor: props.color,
        }}
      />
      <div className="flex flex-col leading-tight">
        <span className="font-medium text-foreground text-[0.72rem]">
          {props.label}
        </span>
        <span className="text-[0.68rem] text-muted-foreground">
          {props.description}
        </span>
      </div>
    </div>
  );
}
