"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Fix broken default Leaflet marker icons in webpack/Next.js ──────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
// ─────────────────────────────────────────────────────────────────────────────

export type OwnerMapStats = {
  warehouseName: string;
  location: string;
  latitude: number;
  longitude: number;
  utilizationRate: number;
  totalCapacity: number;
  currentStock: number;
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
};

// Auto-fits the map to the warehouse coordinates on load
function MapFitter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13, { animate: true });
  }, [lat, lng, map]);
  return null;
}

// The main warehouse hero marker icon — large pill badge
function createWarehouseIcon(name: string, utilizationRate: number): L.DivIcon {
  const fillColor =
    utilizationRate > 80
      ? "#ef4444"
      : utilizationRate > 50
      ? "#f59e0b"
      : "#1E7B4B";

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        padding:8px 14px;
        border-radius:12px;
        background:#1E7B4B;
        color:#fff;
        font-family:system-ui,sans-serif;
        font-size:12px;
        font-weight:800;
        white-space:nowrap;
        box-shadow:0 6px 20px rgba(30,123,75,0.35);
        border:2px solid rgba(255,255,255,0.3);
        letter-spacing:-0.3px;
        display:flex;
        align-items:center;
        gap:6px;
      ">
        <div style="
          width:8px;height:8px;border-radius:50%;
          background:${fillColor};
          box-shadow:0 0 0 3px rgba(255,255,255,0.4);
        "></div>
        ${name}
      </div>
      <div style="
        width:0;height:0;
        border-left:7px solid transparent;
        border-right:7px solid transparent;
        border-top:10px solid #1E7B4B;
        margin-top:-1px;
        filter:drop-shadow(0 2px 4px rgba(30,123,75,0.2));
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [160, 52],
    iconAnchor: [80, 52],
    popupAnchor: [0, -54],
  });
}

export default function WarehouseOwnerMapClient({
  stats,
}: {
  stats: OwnerMapStats;
}) {
  const center: [number, number] = [stats.latitude, stats.longitude];

  // Utilization ring color
  const ringColor =
    stats.utilizationRate > 80
      ? "#ef4444"
      : stats.utilizationRate > 50
      ? "#f59e0b"
      : "#1E7B4B";

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFitter lat={stats.latitude} lng={stats.longitude} />

        {/* Capacity utilization halo ring */}
        <Circle
          center={center}
          radius={400}
          pathOptions={{
            color: ringColor,
            fillColor: ringColor,
            fillOpacity: 0.06,
            weight: 2,
            opacity: 0.3,
            dashArray: "6 4",
          }}
        />

        {/* Main facility marker */}
        <Marker
          position={center}
          icon={createWarehouseIcon(stats.warehouseName, stats.utilizationRate)}
        >
          <Popup closeOnClick={false}>
            <div style={{ padding: "6px 4px", minWidth: "200px" }}>
              <p style={{ fontWeight: 800, fontSize: "14px", margin: 0, marginBottom: "10px" }}>
                {stats.warehouseName}
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px" }}>
                📍 {stats.location}
              </p>
              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "8px", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
                <p style={{ fontSize: "12px", margin: 0 }}>
                  <strong>Capacity:</strong> {stats.currentStock} / {stats.totalCapacity} MT
                </p>
                <p style={{ fontSize: "12px", margin: 0 }}>
                  <strong>Utilization:</strong>{" "}
                  <span
                    style={{
                      color:
                        stats.utilizationRate > 80
                          ? "#ef4444"
                          : stats.utilizationRate > 50
                          ? "#f59e0b"
                          : "#1E7B4B",
                      fontWeight: 700,
                    }}
                  >
                    {stats.utilizationRate}%
                  </span>
                </p>
                <p style={{ fontSize: "12px", margin: 0 }}>
                  <strong>Active Bookings:</strong> {stats.activeBookings}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
