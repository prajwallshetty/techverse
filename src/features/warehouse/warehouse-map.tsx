"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { MapWarehouse } from "./warehouse-map-client";

// Leaflet relies on the browser 'window' object, which causes Next.js SSR to crash.
// We use next/dynamic with ssr: false to only render this in the browser.
const WarehouseMapClient = dynamic(() => import("./warehouse-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-border/60 bg-surface-muted/50">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="mt-2 text-sm font-medium text-muted">Loading map data...</p>
    </div>
  ),
});

export type { MapWarehouse };

export function WarehouseMap(props: {
  warehouses: MapWarehouse[];
  selectedId?: string;
  onSelect: (id: string) => void;
  farmerLocation?: { latitude: number; longitude: number };
}) {
  return <WarehouseMapClient {...props} />;
}
