"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ThermometerSnowflake,
  Warehouse as WarehouseIcon,
  Filter,
  Navigation,
  LayoutGrid,
  Star,
  Flame,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import Link from "next/link";
import { WarehouseDashboard } from "./warehouse-dashboard";

// ── Trust tier config ─────────────────────────────────────────────────────────
function getTierConfig(tier?: string) {
  switch (tier) {
    case "Platinum": return { label: "Platinum", color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-400/30", dot: "bg-indigo-500" };
    case "Gold":     return { label: "Gold",     color: "text-amber-600",  bg: "bg-amber-400/10",  border: "border-amber-400/30",  dot: "bg-amber-500"  };
    case "Silver":   return { label: "Silver",   color: "text-slate-500",  bg: "bg-slate-400/10",  border: "border-slate-400/30",  dot: "bg-slate-400"  };
    default:         return { label: "Bronze",   color: "text-orange-700", bg: "bg-orange-400/10", border: "border-orange-400/30", dot: "bg-orange-500" };
  }
}

function TrustBadge({ score, tier }: { score: number; tier?: string }) {
  const cfg = getTierConfig(tier);
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white shadow-md border ${cfg.border}`}>
      <ShieldCheck className={`size-3 ${cfg.color} shrink-0`} />
      <span className={`text-[9px] font-black uppercase tracking-wide ${cfg.color} whitespace-nowrap`}>
        {cfg.label} · {score}
      </span>
    </div>
  );
}

export function WarehouseGallery() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch("/api/warehouses");
      const data = await res.json();
      // Already sorted by trustScore desc from the API
      setWarehouses(data.warehouses || []);
    } catch (error) {
      console.error("Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  const filtered = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.location.toLowerCase().includes(search.toLowerCase())
  );

  // ── Map View ──────────────────────────────────────────────────────────────
  if (viewMode === "map") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Map View</h2>
            <p className="text-muted text-sm font-medium mt-0.5">
              Browse warehouses on an interactive map.
            </p>
          </div>
          <Button
            variant="secondary"
            className="px-5 py-3 rounded-2xl border-border/60 flex items-center gap-2"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="size-5" /> Grid View
          </Button>
        </div>

        <div className="h-[calc(100vh-14rem)] min-h-[500px] rounded-3xl overflow-hidden border border-border/60 shadow-lg">
          <WarehouseDashboard warehouses={warehouses} />
        </div>
      </div>
    );
  }

  // ── Grid View ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Search & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted/60" />
          <input
            type="text"
            placeholder="Search by city, warehouse name, or crop type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border-2 border-border/40 rounded-2xl pl-12 pr-4 py-4 text-base font-medium focus:outline-none focus:border-primary/50 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* Trust sort indicator */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary/5 border border-primary/10 text-primary">
            <TrendingUp className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sorted by Trust</span>
          </div>
          <Button
            variant="secondary"
            className="px-5 py-6 rounded-2xl border-border/60"
          >
            <Filter className="size-5 mr-2" /> Filters
          </Button>
          <Button
            className="px-5 py-6 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20"
            onClick={() => setViewMode("map")}
          >
            <Navigation className="size-5 mr-2" /> Map View
          </Button>
        </div>
      </div>

      {/* Sorted explanation */}
      <p className="text-xs font-bold text-muted flex items-center gap-2">
        <ShieldCheck className="size-4 text-emerald-500" />
        Showing {filtered.length} verified facilities — highest trust score first
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[460px] bg-surface-muted/20 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((warehouse, index) => {
              const tier = getTierConfig(warehouse.trustTier);
              const score = warehouse.trustScore ?? 50;
              const isTopPick = index === 0 && filtered.length > 1;

              return (
                <motion.div
                  key={warehouse._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`group overflow-hidden border-border/40 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 rounded-[2rem] relative ${isTopPick ? "ring-2 ring-primary/20" : ""}`}>
                    {/* Top Pick — corner ribbon, no overlap */}
                    {isTopPick && (
                      <div className="absolute top-0 right-0 z-20">
                        <div className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl rounded-tr-2xl flex items-center gap-1 shadow-lg">
                          <Star className="size-2.5 fill-white" /> Top Pick
                        </div>
                      </div>
                    )}
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={
                            warehouse.images?.[0] ||
                            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
                          }
                          alt={warehouse.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                        {/* Trust badge — top-left, clear of the ribbon */}
                        <div className="absolute top-4 left-4">
                          <TrustBadge score={score} tier={warehouse.trustTier} />
                        </div>

                        {/* Location + price — bottom */}
                        <div className="absolute bottom-4 left-5 right-4 flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span className="text-sm font-bold">{warehouse.location}</span>
                          </div>
                          <Badge className="bg-white/20 backdrop-blur-md border-none text-white font-bold">
                            ₹{warehouse.pricePerTonPerWeek}/MT
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 space-y-5">
                        {/* Name + certifications */}
                        <div>
                          <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                            {warehouse.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-muted text-xs font-medium">
                            <ShieldCheck className="size-3.5 text-emerald-500" />
                            {(warehouse.certifications || []).length > 0
                              ? warehouse.certifications.slice(0, 2).join(" · ")
                              : "Registered Facility"}
                          </div>
                        </div>

                        {/* Trust score bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted">Farmer Trust</span>
                            <span className={`text-[10px] font-black ${tier.color}`}>{score}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 0.9, delay: index * 0.05 + 0.2, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                score >= 85 ? "bg-indigo-500" :
                                score >= 65 ? "bg-amber-500" :
                                score >= 40 ? "bg-emerald-500" :
                                "bg-orange-400"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-2xl bg-surface-muted/40 border border-border/40">
                            <p className="text-[9px] font-black uppercase text-muted tracking-widest mb-1">Available</p>
                            <p className="text-base font-black">{warehouse.availableCapacity ?? (warehouse.capacityTons - warehouse.currentStockTons)} MT</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-surface-muted/40 border border-border/40">
                            <p className="text-[9px] font-black uppercase text-muted tracking-widest mb-1">Zones</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <ThermometerSnowflake className="size-4 text-blue-500" />
                              <WarehouseIcon className="size-4 text-amber-500" />
                            </div>
                          </div>
                        </div>

                        <Link href={`/dashboard/farmer/warehouses/${warehouse._id}/book`}>
                          <Button className="w-full py-6 rounded-2xl text-base font-black group-hover:bg-primary transition-all">
                            Select Storage Space{" "}
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
