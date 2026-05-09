"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  MapPin, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Info,
  ChevronLeft,
  Navigation,
  Star,
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import Link from "next/link";
import { motion } from "framer-motion";

export function WarehouseDetailClient({ warehouseId }: { warehouseId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/warehouses/${warehouseId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [warehouseId]);

  if (loading) return <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
    <Loader2 className="size-12 animate-spin text-primary" />
    <p className="font-black text-xl text-muted animate-pulse">Loading Facility Data...</p>
  </div>;

  const { warehouse, slots } = data;
  const occupancy = Math.round((warehouse.currentStockTons / warehouse.capacityTons) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      
      {/* Hero Gallery Section */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl shadow-primary/10 border-4 border-white"
        >
          <img 
            src={warehouse.images?.[0] || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"} 
            className="w-full h-full object-cover"
            alt={warehouse.name}
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <Badge className="bg-white/90 text-primary backdrop-blur-md border-none font-black px-4 py-2">LIVE AVAILABILITY</Badge>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight">{warehouse.name}</h1>
              <div className="flex items-center gap-2 text-muted font-bold">
                <MapPin className="size-5 text-primary" />
                <span>{warehouse.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="size-12 rounded-full p-0 shadow-lg"><Share2 className="size-5" /></Button>
              <Button variant="secondary" className="size-12 rounded-full p-0 shadow-lg"><Star className="size-5" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-surface-muted/40 border-border/60">
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-1">Total Capacity</p>
                <p className="text-2xl font-black">{warehouse.capacityTons} MT</p>
                <div className="w-full bg-border/40 h-1.5 rounded-full mt-4">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${occupancy}%` }} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface-muted/40 border-border/60">
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-1">Pricing</p>
                <p className="text-2xl font-black text-emerald-600">₹{warehouse.pricePerTonPerWeek}<span className="text-xs text-muted">/MT/wk</span></p>
                <p className="text-[10px] font-bold text-muted mt-4">ZONE PRICING APPLIED</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            {warehouse.certifications?.map((c: string) => (
              <Badge key={c} intent="high" className="rounded-xl px-4 py-2 font-black text-xs uppercase tracking-widest">
                < ShieldCheck className="size-3 mr-2" /> {c}
              </Badge>
            ))}
            <Badge intent="medium" className="rounded-xl px-4 py-2 font-black text-xs uppercase tracking-widest">
              <ThermometerSnowflake className="size-3 mr-2" /> Cold Storage Available
            </Badge>
          </div>

          <Link href={`/dashboard/farmer/warehouses/${warehouseId}/book`}>
            <Button className="w-full py-8 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/20">
              Go to Visual Booking <ArrowRight className="ml-2 size-6" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Details & Specs */}
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          <section className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight">Facility Infrastructure</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: ThermometerSnowflake, label: "Temp Control", val: "Yes (-2°C)" },
                { icon: Package, label: "Max Load", val: "5000kg/m²" },
                { icon: Calendar, label: "Operating", val: "24/7 Access" },
                { icon: Layers, label: "Zones", val: "A, B & C" }
              ].map(item => (
                <div key={item.label} className="p-6 rounded-3xl bg-surface border border-border/60 text-center space-y-2 hover:bg-surface-muted/30 transition-colors">
                  <item.icon className="size-6 mx-auto text-primary" />
                  <p className="text-[10px] font-black uppercase text-muted tracking-widest">{item.label}</p>
                  <p className="text-sm font-black">{item.val}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight">Security & Compliance</h3>
            <div className="space-y-4">
              {[
                "AI-driven surveillance with motion tracking",
                "Fire-suppression system with automated sprinklers",
                "WDRA Negotiable Warehouse Receipt (NWR) facility",
                "Real-time pest and moisture monitoring sensors"
              ].map(item => (
                <div key={item} className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-700 font-bold">
                  <CheckCircle2 className="size-5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="space-y-8">
           <Card className="rounded-[2.5rem] border-border/60 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Navigation className="size-6 text-primary" />
                <h3 className="text-xl font-black tracking-tight">Locate Facility</h3>
              </div>
              <div className="h-64 rounded-3xl bg-surface-muted/50 border-2 border-dashed border-border/60 flex items-center justify-center text-center p-6">
                <div>
                  <MapPin className="size-10 mx-auto text-muted mb-4 opacity-40" />
                  <p className="text-sm font-bold text-muted">Interactive Map View Coming Soon</p>
                  <Button variant="secondary" className="mt-4 text-xs font-black px-4">Open in Google Maps</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted">Distance</span>
                  <span>14.2 km</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted">Avg. Turnaround</span>
                  <span>45 mins</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <Info className="size-5" />
              <h4 className="font-black">Owner's Note</h4>
            </div>
            <p className="text-sm font-medium text-amber-900/70 italic leading-relaxed">
              "We recently upgraded our Cold Storage units to supports Grade-A perishables. Special rates apply for long-term Paddy storage."
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

function CheckCircle2({ className, size }: { className?: string, size?: number }) {
  return <Badge className={`bg-emerald-500/10 text-emerald-500 rounded-full ${className}`} intent="high" />;
}
