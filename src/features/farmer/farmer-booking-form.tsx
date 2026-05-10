"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Package, 
  Wallet, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Sprout
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import Link from "next/link";

interface WarehouseData {
  _id: string;
  name: string;
  location: string;
  capacityTons: number;
  currentStockTons: number;
  pricePerTonPerWeek: number;
}

export function FarmerBookingForm({ warehouseId }: { warehouseId: string }) {
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<WarehouseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [cropName, setCropName] = useState("");
  const [quantityTons, setQuantityTons] = useState<number | "">("");
  const [durationWeeks, setDurationWeeks] = useState<number | "">(4); // Default 1 month
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/warehouses/${warehouseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setWarehouse(data.warehouse);
        }
      })
      .catch(() => setError("Failed to load warehouse data"))
      .finally(() => setLoading(false));
  }, [warehouseId]);

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
      <Loader2 className="size-10 animate-spin text-primary" />
      <p className="font-black text-sm text-muted animate-pulse tracking-widest uppercase">Loading Facility Data...</p>
    </div>
  );

  if (error || !warehouse) return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[60vh]">
      <p className="text-danger font-bold">{error || "Warehouse not found"}</p>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  const availableCapacity = warehouse.capacityTons - warehouse.currentStockTons;
  const safeQuantity = quantityTons === "" ? 0 : Number(quantityTons);
  const safeDuration = durationWeeks === "" ? 0 : Number(durationWeeks);
  
  const isOverCapacity = safeQuantity > availableCapacity;
  const totalPrice = safeQuantity * safeDuration * warehouse.pricePerTonPerWeek;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverCapacity || safeQuantity <= 0 || !cropName.trim() || safeDuration <= 0) return;
    
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouseId,
          cropName: cropName.trim(),
          quantityTons: safeQuantity,
          totalPrice
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/farmer/bookings");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[60vh] gap-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="size-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl">
          <CheckCircle2 className="size-12" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Booking Confirmed!</h2>
          <p className="text-muted font-medium mt-2">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 lg:p-10 pb-32">
      <Link href={`/dashboard/farmer/warehouses/${warehouseId}`} className="inline-flex items-center gap-2 text-sm font-black text-muted hover:text-foreground transition-colors uppercase tracking-widest mb-8">
        <ArrowLeft className="size-4" /> Back to Details
      </Link>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: Form */}
        <div className="flex-1 w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Secure <span className="text-primary">Storage</span></h1>
            <p className="text-muted mt-2 font-medium">Enter your crop details and required space to generate a booking request.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border/40 rounded-[2.5rem] bg-surface shadow-sm">
              <CardContent className="p-8 space-y-6">
                
                {error && (
                  <div className="p-4 rounded-2xl bg-danger/10 text-danger border border-danger/20 text-sm font-bold">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <Sprout className="size-3" /> Crop Type
                  </label>
                  <input 
                    type="text" 
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Premium Wheat, Organic Rice..."
                    className="w-full bg-surface-muted border-none rounded-2xl px-5 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2"><Package className="size-3" /> Quantity (Tons)</span>
                      <span className={`text-[9px] ${isOverCapacity ? 'text-danger' : 'text-emerald-500'}`}>
                        {availableCapacity} MT Available
                      </span>
                    </label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      step="0.5"
                      value={quantityTons}
                      onChange={(e) => setQuantityTons(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Amount to store"
                      className={`w-full bg-surface-muted border rounded-2xl px-5 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/50 transition-all ${isOverCapacity ? 'border-danger focus:ring-danger/50 bg-danger/5 text-danger' : 'border-transparent'}`}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Wallet className="size-3" /> Duration (Weeks)
                    </label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      max="52"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Storage duration"
                      className="w-full bg-surface-muted border-none rounded-2xl px-5 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted/50"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>

            <Button 
              type="submit" 
              disabled={submitting || isOverCapacity || safeQuantity <= 0 || !cropName.trim()}
              className="w-full py-6 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? "Processing..." : "Confirm & Book Space"}
            </Button>
          </form>
        </div>

        {/* Right: Summary */}
        <aside className="w-full lg:w-[400px] shrink-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="border-border/40 rounded-[3rem] bg-surface shadow-2xl shadow-black/5 sticky top-24">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground tracking-tight leading-tight">{warehouse.name}</h3>
                  <p className="text-xs text-muted font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3" /> {warehouse.location}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between pb-5 border-b border-border/40">
                  <span className="text-xs font-bold text-muted">Rate per Ton (Weekly)</span>
                  <span className="text-sm font-black text-foreground">₹{warehouse.pricePerTonPerWeek.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between pb-5 border-b border-border/40">
                  <span className="text-xs font-bold text-muted">Quantity</span>
                  <span className="text-sm font-black text-foreground">{safeQuantity || 0} MT</span>
                </div>

                <div className="flex items-center justify-between pb-5 border-b border-border/40">
                  <span className="text-xs font-bold text-muted">Duration</span>
                  <span className="text-sm font-black text-foreground">{safeDuration || 0} Weeks</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Estimated Total</p>
                      <Badge intent="low" className="bg-emerald-500/10 text-emerald-600 border-none">Due on drop-off</Badge>
                    </div>
                    <span className="text-4xl font-black tracking-tighter text-foreground">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
