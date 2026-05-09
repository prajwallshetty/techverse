"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Package, IndianRupee } from "lucide-react";

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
function MapController({ selectedId, warehouses }: { selectedId?: string; warehouses: MapWarehouse[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedId) {
      const w = warehouses.find((wh) => wh.id === selectedId);
      if (w) {
        map.flyTo([w.latitude, w.longitude], 12, { animate: true, duration: 1 });
      }
    }
  }, [selectedId, warehouses, map]);

  return null;
}

export default function WarehouseMapClient({
  warehouses,
  selectedId,
  onSelect,
}: {
  warehouses: MapWarehouse[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const PUNE_COORDS: [number, number] = [18.5204, 73.8567];

  // Helper to create the custom Antigravity UI price marker
  const createCustomIcon = (w: MapWarehouse, isSelected: boolean) => {
    const bgColor = isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-surface text-foreground border-border/80";
    const arrowColor = isSelected ? "border-t-primary" : "border-t-surface";
    const scaleClass = isSelected ? "scale-110 z-50" : "scale-100 hover:scale-105";

    const html = `
      <div class="flex flex-col items-center transition-transform ${scaleClass}">
        <div class="px-2 py-1 rounded-md text-xs font-bold shadow-md whitespace-nowrap flex items-center gap-1 border ${bgColor}">
          ₹${w.pricePerTon} / MT
        </div>
        <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${arrowColor}"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: "custom-leaflet-marker", // Removes default leaflet styling
      iconSize: [80, 40],
      iconAnchor: [40, 40], // Point the arrow exactly at the coordinates
      popupAnchor: [0, -40],
    });
  };

  return (
    <div className="h-full w-full relative bg-surface-muted/50 rounded-xl overflow-hidden border border-border/60 z-0">
      <MapContainer
        center={PUNE_COORDS}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
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
                <Popup closeOnClick={false} eventHandlers={{ remove: () => onSelect("") }}>
                  <div className="p-0.5 min-w-[180px]">
                    <p className="font-bold text-[14px] text-foreground m-0">{w.name}</p>
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[12px] flex items-center gap-1.5 text-muted-foreground m-0">
                        <Package className="size-3.5" /> 
                        <span className="font-medium text-foreground">{w.availableCapacity} MT</span> available
                      </p>
                      <p className="text-[12px] flex items-center gap-1.5 text-muted-foreground m-0">
                        <IndianRupee className="size-3.5" /> 
                        <span className="font-medium text-foreground">₹{w.pricePerTon}</span> per MT / mo
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
