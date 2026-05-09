"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Package, IndianRupee } from "lucide-react";

// ─── Fix broken default Leaflet marker icons in webpack/Next.js ──────────────
// Leaflet bundles its marker PNGs as relative paths which webpack can't resolve.
// We delete the broken _getIconUrl and re-set the icon prototype with CDN URLs.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
// ─────────────────────────────────────────────────────────────────────────────

export type MapWarehouse = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacityTons: number;
  availableCapacity: number;
  pricePerTon: number;
  distanceKm?: number;
};

// Component to handle map centering when a warehouse is selected from the sidebar
function MapController({
  selectedId,
  warehouses,
}: {
  selectedId?: string;
  warehouses: MapWarehouse[];
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const w = warehouses.find((wh) => wh.id === selectedId);
      if (w) {
        map.flyTo([w.latitude, w.longitude], 13, { animate: true, duration: 1 });
      }
    }
  }, [selectedId, warehouses, map]);

  return null;
}

// Creates a price-pill marker using ONLY inline styles (no Tailwind, no CSS vars)
// because L.divIcon injects raw HTML into a detached DOM node where Tailwind is unavailable.
function createCustomIcon(w: MapWarehouse, isSelected: boolean): L.DivIcon {
  const pillBg = isSelected ? "#1E7B4B" : "#ffffff";
  const pillColor = isSelected ? "#ffffff" : "#181d19";
  const pillBorder = isSelected ? "#1E7B4B" : "#d1d5db";
  const arrowBorderTop = isSelected ? "#1E7B4B" : "#ffffff";
  const shadow = isSelected
    ? "0 4px 12px rgba(30,123,75,0.4)"
    : "0 2px 6px rgba(0,0,0,0.15)";

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;transform:${isSelected ? "scale(1.1)" : "scale(1)"};transition:transform 0.2s;">
      <div style="
        padding:4px 10px;
        border-radius:8px;
        font-size:12px;
        font-weight:700;
        font-family:system-ui,sans-serif;
        white-space:nowrap;
        background:${pillBg};
        color:${pillColor};
        border:1.5px solid ${pillBorder};
        box-shadow:${shadow};
        letter-spacing:-0.2px;
      ">₹${w.pricePerTon}/MT</div>
      <div style="
        width:0;height:0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:8px solid ${arrowBorderTop};
        margin-top:-1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "", // Removes ALL default leaflet marker styling
    iconSize: [90, 42],
    iconAnchor: [45, 42],
    popupAnchor: [0, -44],
  });
}

// Creates a simple "You are here" blue dot icon
function createFarmerIcon(): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          padding:6px 12px;
          border-radius:20px;
          background:#2563eb;
          color:#fff;
          font-family:system-ui,sans-serif;
          font-size:11px;
          font-weight:800;
          white-space:nowrap;
          box-shadow:0 4px 12px rgba(37,99,235,0.4);
          border:2px solid #fff;
          letter-spacing:0.5px;
        ">YOU ARE HERE</div>
        <div style="
          width:12px;height:12px;
          border-radius:50%;
          background:#2563eb;
          border:2px solid #fff;
          margin-top:-6px;
        "></div>
      </div>
    `,
    className: "",
    iconSize: [100, 40],
    iconAnchor: [50, 40],
  });
}

export default function WarehouseMapClient({
  warehouses,
  selectedId,
  onSelect,
  farmerLocation,
}: {
  warehouses: MapWarehouse[];
  selectedId?: string;
  onSelect: (id: string) => void;
  farmerLocation?: { latitude: number; longitude: number };
}) {
  // Center on the cluster of warehouses + farmer, or fall back to Pune
  const center: [number, number] =
    farmerLocation
      ? [farmerLocation.latitude, farmerLocation.longitude]
      : warehouses.length > 0
      ? [
          warehouses.reduce((s, w) => s + w.latitude, 0) / warehouses.length,
          warehouses.reduce((s, w) => s + w.longitude, 0) / warehouses.length,
        ]
      : [18.5204, 73.8567];

  return (
    <div
      style={{ height: "100%", width: "100%", position: "relative" }}
      className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
    >
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Farmer's current location marker */}
        {farmerLocation && (
          <Marker 
            position={[farmerLocation.latitude, farmerLocation.longitude]} 
            icon={createFarmerIcon()}
            zIndexOffset={500}
          />
        )}

        <MapController selectedId={selectedId} warehouses={warehouses} />

        {warehouses.map((w) => {
          const isSelected = selectedId === w.id;
          return (
            <Marker
              key={w.id}
              position={[w.latitude, w.longitude]}
              icon={createCustomIcon(w, isSelected)}
              eventHandlers={{
                click: () => onSelect(w.id),
              }}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              {isSelected && (
                <Popup
                  closeOnClick={false}
                  eventHandlers={{ remove: () => onSelect("") }}
                >
                  <div style={{ padding: "4px 2px", minWidth: "180px" }}>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "14px",
                        margin: 0,
                        marginBottom: "8px",
                      }}
                    >
                      {w.name}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <p style={{ fontSize: "12px", margin: 0, color: "#555" }}>
                        <strong style={{ color: "#181d19" }}>
                          {w.availableCapacity} MT
                        </strong>{" "}
                        available
                      </p>
                      <p style={{ fontSize: "12px", margin: 0, color: "#555" }}>
                        <strong style={{ color: "#181d19" }}>
                          ₹{w.pricePerTon}
                        </strong>{" "}
                        per MT / mo
                      </p>
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
