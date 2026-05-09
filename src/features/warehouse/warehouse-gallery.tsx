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
  Navigation
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import Link from "next/link";

export function WarehouseGallery() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch("/api/warehouses");
      const data = await res.json();
      setWarehouses(data.warehouses || []);
    } catch (error) {
      console.error("Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  const filtered = warehouses.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search & Stats Header */}
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
          <Button variant="secondary" className="px-5 py-6 rounded-2xl border-border/60">
            <Filter className="size-5 mr-2" /> Filters
          </Button>
          <Button className="px-5 py-6 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
            <Navigation className="size-5 mr-2" /> Map View
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-[400px] bg-surface-muted/20 animate-pulse rounded-3xl" />)}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filtered.map((warehouse) => (
              <motion.div
                key={warehouse._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="group overflow-hidden border-border/60 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 rounded-[2rem]">
                  <CardContent className="p-0">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={warehouse.images?.[0] || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"} 
                        alt={warehouse.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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

                    <div className="p-6 space-y-6">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{warehouse.name}</h3>
                        <div className="flex items-center gap-2 mt-2 text-muted text-sm font-medium">
                          <ShieldCheck className="size-4 text-emerald-500" />
                          Certified ISO 9001 Facility
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/40">
                          <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-1">Available</p>
                          <p className="text-lg font-black">{warehouse.availableCapacity} MT</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/40">
                          <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-1">Zones</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <ThermometerSnowflake className="size-4 text-blue-500" />
                            <WarehouseIcon className="size-4 text-amber-500" />
                          </div>
                        </div>
                      </div>

                      <Link href={`/dashboard/farmer/warehouses/${warehouse._id}/book`}>
                        <Button className="w-full py-7 rounded-2xl text-lg font-black group-hover:bg-primary transition-all">
                          Select Storage Space <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
