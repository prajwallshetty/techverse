"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  CheckCircle2, 
  Info, 
  ThermometerSnowflake, 
  Package, 
  Zap,
  ArrowLeft,
  Loader2,
  Lock,
  Wallet,
  LayoutGrid,
  Search
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function VisualBookingGrid({ warehouseId }: { warehouseId: string }) {
  const router = useRouter();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [warehouse, setWarehouse] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, warehousesRes] = await Promise.all([
        fetch(`/api/warehouses/${warehouseId}/slots`),
        fetch(`/api/warehouses`)
      ]);
      const slotsData = await slotsRes.json();
      const wData = await warehousesRes.json();
      
      setSlots(slotsData.slots || []);
      // Try to find the specific warehouse from the list
      const foundWarehouse = wData.warehouses?.find((w: any) => w._id === warehouseId);
      setWarehouse(foundWarehouse || null);
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = (slotId: string, status: string) => {
    if (status !== "available") return;
    setSelectedSlots(prev => 
      prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
    );
  };

  const calculateTotal = () => {
    if (!warehouse) return 0;
    // Each slot is 1 ton (1000kg)
    const basePrice = warehouse.pricePerTonPerWeek || 500;
    return selectedSlots.length * basePrice;
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <div className="relative">
        <Loader2 className="size-16 animate-spin text-primary opacity-20" />
        <Loader2 className="size-16 animate-spin text-primary absolute inset-0 [animation-delay:-0.5s]" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-black text-2xl tracking-tighter uppercase italic">AgriHold<span className="text-primary">.</span>OS</p>
        <p className="font-bold text-xs text-muted animate-pulse tracking-widest uppercase">Initializing Digital Facility Layout...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      
      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="px-8 py-6 border-b border-border/40 bg-surface/50 backdrop-blur-xl z-30">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/farmer/warehouses">
              <Button variant="secondary" className="rounded-xl size-10 p-0 border-border/60 hover:bg-white hover:shadow-xl transition-all active:scale-95">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight text-foreground">{warehouse?.name || "Facility Hub"}</h2>
                <Badge className="bg-primary/10 text-primary border-none text-[9px] px-2 py-0.5 uppercase font-black tracking-wider">Interactive</Badge>
              </div>
              <div className="flex items-center gap-4 text-muted">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <ThermometerSnowflake className="size-3 text-primary" /> Climate Controlled
                </span>
                <span className="size-1 rounded-full bg-border" />
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <LayoutGrid className="size-3 text-primary" /> {slots.length} Total Units
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 bg-surface-muted/30 px-6 py-3 rounded-2xl border border-border/40">
            <LegendItem color="bg-surface border-border" label="Available" />
            <LegendItem color="bg-danger/20 border-danger/30" label="Occupied" />
            <LegendItem color="bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" label="Selected" />
          </div>
        </div>
      </header>

      {/* ── Main Content Area ──────────────────────────────────────── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1800px] mx-auto w-full">
        
        {/* Left: Interactive Grid Canvas */}
        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar relative">
          
          {slots.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 max-w-md mx-auto space-y-6">
              <div className="size-20 rounded-[2.5rem] bg-surface flex items-center justify-center shadow-2xl border border-border/40">
                <Search className="size-10 text-muted/30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-foreground">No Layout Found</h3>
                <p className="text-sm text-muted font-medium">This facility hasn't digitalized its storage layout yet. Please contact the warehouse owner or try another facility.</p>
              </div>
              <Link href="/dashboard/farmer/warehouses">
                <Button className="rounded-2xl px-8 font-black text-xs uppercase tracking-widest bg-primary text-white">Browse Others</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-16 pb-20">
              {["A", "B", "C"].map(zone => {
                const zoneSlots = slots.filter(s => s.zone === zone);
                if (zoneSlots.length === 0) return null;

                return (
                  <div key={zone} className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                          {zone}
                        </div>
                        <h3 className="text-sm font-black text-muted tracking-[0.2em] uppercase">Sector {zone}</h3>
                      </div>
                      <div className="h-px flex-1 bg-border/20" />
                      <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest">{zoneSlots.length} Storage Units</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                      {zoneSlots.map((slot) => {
                        const isSelected = selectedSlots.includes(slot._id);
                        const isOccupied = slot.status === "occupied";
                        const isLocked = slot.status === "locked";

                        return (
                          <motion.div
                            key={slot._id}
                            whileHover={!isOccupied ? { scale: 1.08, y: -4, transition: { duration: 0.2 } } : {}}
                            whileTap={!isOccupied ? { scale: 0.95 } : {}}
                            onClick={() => toggleSlot(slot._id, slot.status)}
                            className={`
                              relative aspect-square rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center transition-all duration-300
                              ${isSelected 
                                ? "bg-primary border-primary shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] text-white z-10" 
                                : isOccupied 
                                ? "bg-surface-muted border-transparent text-muted/30 cursor-not-allowed grayscale" 
                                : isLocked
                                ? "bg-amber-100 border-amber-300 text-amber-600 cursor-wait"
                                : "bg-surface border-border/40 hover:border-primary/40 hover:shadow-xl group"
                              }
                            `}
                          >
                            <div className="relative">
                              {isOccupied ? (
                                <Lock className="size-4 opacity-50" />
                              ) : (
                                <Package className={`size-5 transition-colors ${isSelected ? "text-white" : "text-muted/20 group-hover:text-primary/40"}`} />
                              )}
                              {isSelected && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 size-3 bg-white rounded-full flex items-center justify-center"
                                >
                                  <div className="size-1.5 bg-primary rounded-full" />
                                </motion.div>
                              )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter mt-2 ${isSelected ? "text-white/80" : "text-muted/60"}`}>
                              {slot.slotNumber.split('-').pop()}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Floating Summary Panel */}
        <aside className="w-full lg:w-[450px] bg-surface border-t lg:border-t-0 lg:border-l border-border/40 flex flex-col z-20 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.1)]">
          <div className="p-10 flex-1 flex flex-col">
            <div className="space-y-2 mb-10">
              <h3 className="text-2xl font-black tracking-tight text-foreground">Booking Summary</h3>
              <p className="text-sm text-muted font-medium">Review your unit selection and total costs.</p>
            </div>

            <div className="flex-1 min-h-[200px] overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-4">
              <AnimatePresence mode='popLayout'>
                {selectedSlots.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 bg-surface-muted/30 rounded-[2.5rem] border-2 border-dashed border-border/60 space-y-4"
                  >
                    <div className="size-14 bg-surface rounded-2xl flex items-center justify-center shadow-lg">
                      <Zap className="size-7 text-primary/30" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">Selection Empty</p>
                      <p className="text-xs text-muted font-medium mt-1">Tap storage units on the grid to add them to your reservation.</p>
                    </div>
                  </motion.div>
                ) : (
                  selectedSlots.map(id => {
                    const slot = slots.find(s => s._id === id);
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="flex items-center justify-between p-5 bg-surface border border-border/60 rounded-2xl hover:shadow-lg hover:border-primary/20 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs shadow-inner">
                            {slot?.zone}
                          </div>
                          <div>
                            <p className="font-black text-foreground">Unit {slot?.slotNumber.split('-').pop()}</p>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
                              <Wallet className="size-3 text-primary" /> {slot?.capacityKg || 1000} KG Volume
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleSlot(id, "available")}
                          className="size-10 rounded-xl hover:bg-danger/10 hover:text-danger flex items-center justify-center transition-all text-muted/40 hover:rotate-90"
                        >
                          <X className="size-5" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            <div className="mt-10 pt-10 border-t border-border/40 space-y-6">
              <div className="flex justify-between items-center px-2">
                <div className="space-y-1">
                  <p className="text-xs font-black text-muted uppercase tracking-widest">Aggregate Mass</p>
                  <p className="text-lg font-black text-foreground">{(selectedSlots.length * 1.0).toFixed(1)} MT</p>
                </div>
                <Badge intent="medium" className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 font-black text-[10px] tracking-widest">PROMO APPLIED</Badge>
              </div>

              <div className="bg-surface-muted/40 p-6 rounded-3xl border border-border/40 space-y-1">
                <p className="text-xs font-black text-muted uppercase tracking-widest">Estimated Weekly Cost</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground/40">₹</span>
                  <span className="text-5xl font-black text-primary tracking-tighter tabular-nums leading-[1.1]">
                    {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full py-10 rounded-3xl text-xl font-black bg-primary text-white shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-3"
                disabled={selectedSlots.length === 0}
              >
                Reserve Space <CheckCircle2 className="size-7" />
              </Button>
              
              <p className="text-[10px] text-center text-muted font-bold px-10 leading-relaxed uppercase tracking-widest">
                By confirming, you agree to the <span className="text-primary hover:underline cursor-pointer">storage terms</span> & facility protocols.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`size-4 rounded-lg border ${color}`} />
      <span className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</span>
    </div>
  );
}

