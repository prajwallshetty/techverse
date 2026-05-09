"use client";

import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";
import type { OwnerMapStats } from "./warehouse-owner-map-client";

// Leaflet requires the browser 'window' object — import dynamically with ssr:false.
const WarehouseOwnerMapClient = dynamic(
  () => import("./warehouse-owner-map-client"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 bg-surface-muted/30">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted">Loading facility map...</p>
      </div>
    ),
  }
);

export type { OwnerMapStats };

/**
 * WarehouseOwnerMap — renders only when the warehouse has lat/lng coordinates.
 * If coordinates are missing (i.e. the warehouse was created without them),
 * a friendly "no coordinates" placeholder is shown with instructions.
 */
export function WarehouseOwnerMap({ stats }: { stats: OwnerMapStats | null }) {
  if (!stats) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 bg-surface-muted/30">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted">Loading stats...</p>
      </div>
    );
  }

  if (!stats.latitude || !stats.longitude) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-border/60 bg-surface-muted/20 p-10 text-center">
        <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center">
          <MapPin className="size-8 text-primary" />
        </div>
        <div>
          <p className="font-black text-lg text-foreground">Map Coordinates Not Set</p>
          <p className="text-sm text-muted font-medium mt-2 max-w-xs">
            Your warehouse&apos;s GPS coordinates have not been configured yet.
            Update your facility settings to enable the map view.
          </p>
        </div>
      </div>
    );
  }

  return <WarehouseOwnerMapClient stats={stats} />;
}
