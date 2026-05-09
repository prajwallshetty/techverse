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
  Wallet
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
      setWarehouse(wData.warehouses.find((w: any) => w._id === warehouseId));
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
    const basePrice = (warehouse.pricePerTonPerWeek / 1000); // per kg
    return selectedSlots.length * 1000 * basePrice; // Each slot is 1000kg in seed
  };

  if (loading) return <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
    <Loader2 className="size-12 animate-spin text-primary" />
    <p className="font-black text-xl text-muted animate-pulse">Initializing Layout...</p>
  </div>;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      
      {/* Header Area */}
      <div className="p-6 border-b border-border/60 bg-surface/80 backdrop-blur-md z-20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/farmer/warehouses">
              <Button variant="secondary" className="rounded-full size-12 p-0">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-black leading-tight">{warehouse?.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black">Interactive Grid</Badge>
                <span className="text-xs text-muted font-bold flex items-center gap-1">
                  <ThermometerSnowflake className="size-3" /> Zone A-C
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-md border-2 border-primary/20 bg-surface" />
              <span className="text-xs font-bold text-muted">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-md bg-danger/20 border border-danger/40" />
              <span className="text-xs font-bold text-muted">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-md bg-primary shadow-lg shadow-primary/40 ring-2 ring-primary ring-offset-2 ring-offset-surface" />
              <span className="text-xs font-bold text-muted">Selected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        
        {/* The Grid Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          
          {/* Legend for mobile */}
          <div className="md:hidden flex flex-wrap gap-4 mb-8 justify-center">
             <div className="flex items-center gap-2">
              <div className="size-3 rounded-full border border-border bg-surface" />
              <span className="text-[10px] font-bold">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-danger/40" />
              <span className="text-[10px] font-bold">Occupied</span>
            </div>
          </div>

          <div className="space-y-16">
            {["A", "B", "C"].map(zone => {
              const zoneSlots = slots.filter(s => s.zone === zone);
              if (zoneSlots.length === 0) return null;

              return (
                <div key={zone} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-black text-muted tracking-widest uppercase">Zone {zone}</h3>
                    <div className="h-px flex-1 bg-border/40" />
                    <Badge intent="low" className="font-bold">{zoneSlots.length} Blocks</Badge>
                  </div>

                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {zoneSlots.map((slot) => {
                      const isSelected = selectedSlots.includes(slot._id);
                      const isOccupied = slot.status === "occupied";
                      const isLocked = slot.status === "locked";

                      return (
                        <motion.div
                          key={slot._id}
                          whileHover={!isOccupied ? { scale: 1.1, zIndex: 10 } : {}}
                          whileTap={!isOccupied ? { scale: 0.95 } : {}}
                          onClick={() => toggleSlot(slot._id, slot.status)}
                          className={`
                            relative aspect-square rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center transition-all duration-300
                            ${isSelected 
                              ? "bg-primary border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] text-white z-10 scale-105" 
                              : isOccupied 
                              ? "bg-danger/10 border-danger/20 text-danger/40 cursor-not-allowed opacity-60" 
                              : isLocked
                              ? "bg-amber-100 border-amber-300 text-amber-600 cursor-wait"
                              : "bg-surface border-border/60 hover:border-primary/40 hover:bg-primary/5"
                            }
                          `}
                        >
                          {isOccupied ? <Lock className="size-3 mb-0.5" /> : <Package className={`size-4 ${isSelected ? "text-white" : "text-muted/40"}`} />}
                          <span className={`text-[8px] font-black uppercase tracking-tighter mt-0.5 ${isSelected ? "text-white/80" : "text-muted"}`}>
                            {slot.slotNumber.split('-').slice(-2).join(':')}
                          </span>

                          {isSelected && (
                            <motion.div 
                              layoutId="selection-ring"
                              className="absolute inset-0 ring-4 ring-primary/20 rounded-xl"
                              initial={false}
                              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="w-full lg:w-[400px] bg-surface p-8 border-t lg:border-l border-border/60 flex flex-col shadow-2xl shadow-black/5">
          <div className="flex-1 space-y-8">
            <div>
              <h3 className="text-xl font-black tracking-tight">Booking Summary</h3>
              <p className="text-sm text-muted font-medium mt-1">Review your selected storage blocks.</p>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <AnimatePresence mode='popLayout'>
                {selectedSlots.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="py-10 text-center space-y-4 bg-surface-muted/30 rounded-[2rem] border-2 border-dashed border-border/60"
                  >
                    <div className="size-12 bg-surface rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Zap className="size-6 text-muted/40" />
                    </div>
                    <p className="text-sm font-bold text-muted">No blocks selected.<br/><span className="text-xs opacity-60 font-medium">Click on green blocks to reserve.</span></p>
                  </motion.div>
                ) : (
                  selectedSlots.map(id => {
                    const slot = slots.find(s => s._id === id);
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-4 bg-surface-muted/50 rounded-2xl border border-border/40 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                            {slot?.zone}
                          </div>
                          <div>
                            <p className="text-sm font-black">Block {slot?.slotNumber.split('-').pop()}</p>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{slot?.capacityKg} KG Capacity</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleSlot(id, "available")}
                          className="size-8 rounded-full hover:bg-danger/10 hover:text-danger flex items-center justify-center transition-colors text-muted"
                        >
                          <X className="size-4" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            <div className="pt-8 border-t border-border/60 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted font-bold">Total Weight</span>
                <span className="text-sm font-black">{(selectedSlots.length * 1.0).toFixed(1)} Metric Tons</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <span className="text-xs text-muted font-black uppercase tracking-widest">Total Price</span>
                  <p className="text-3xl font-black text-primary leading-none">₹{calculateTotal().toLocaleString()}</p>
                </div>
                <Badge intent="medium" className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 font-black">PROMO APPLIED</Badge>
              </div>
            </div>
          </div>

          <Button 
            className="w-full py-8 rounded-[1.5rem] text-xl font-black shadow-2xl shadow-primary/30 mt-8"
            disabled={selectedSlots.length === 0}
          >
            Confirm Reservation <CheckCircle2 className="ml-2 size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
