"use client";

import { useState, useEffect } from "react";
import { PriceAdvisorCard } from "@/components/ui/price-advisor-card";
import { WarehouseCard } from "@/components/ui/warehouse-card";
import { 
  Warehouse as WarehouseIcon, 
  Banknote, 
  TrendingUp, 
  Gavel,
  ArrowRight,
  Info,
  BellRing,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/antigravity/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function FarmerDashboardClient({ sessionUser }: { sessionUser: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const firstName = sessionUser?.name?.split(" ")[0] ?? "Farmer";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/farmer/stats");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="size-12 animate-spin text-primary" />
      <p className="font-black text-lg text-muted animate-pulse">Synchronizing with Mandi APIs...</p>
    </div>
  );

  return (
    <div className="p-4 space-y-8 max-w-5xl mx-auto pb-24">
      
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-container p-10 text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 space-y-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tight"
          >
            Good Morning, {firstName} 🌾
          </motion.h2>
          <p className="text-white/80 font-medium max-w-md">Your agricultural assets are secure. Market prices for Paddy are trending up in your region.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/farmer/warehouses">
              <Button className="bg-white text-primary hover:bg-white/90 px-6 py-6 rounded-2xl font-black text-sm shadow-xl transition-all">
                Book Storage
              </Button>
            </Link>
            <Link href="/dashboard/farmer/loans">
              <Button className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-6 py-6 rounded-2xl font-black text-sm transition-all">
                Instant Loan
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute -right-12 -bottom-12 opacity-10 size-64 pointer-events-none rotate-12">
          <WarehouseIcon size={256} />
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Stored Crops', value: `${data?.stats?.totalStoredWeight || 0} Tons`, icon: WarehouseIcon, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active Loan', value: `₹${data?.stats?.activeLoanAmount?.toLocaleString() || 0}`, icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Market Profit', value: '+₹12,400', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10', highlight: true },
          { label: 'Active Bids', value: data?.stats?.activeBidsCount || 0, icon: Gavel, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        ].map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface p-5 rounded-[2rem] border border-border/40 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group"
          >
            <div className={`size-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <p className={`text-xl font-black mt-1 ${stat.highlight ? 'text-emerald-500' : 'text-foreground'}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* AI Recommendation Section */}
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <PriceAdvisorCard />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-[2rem] bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <BellRing className="absolute -right-4 -top-4 size-24 opacity-10 group-hover:rotate-12 transition-transform" />
            <h4 className="font-black text-lg">Price Alerts</h4>
            <p className="text-white/80 text-sm mt-1 font-medium">You will be notified when Paddy hits ₹2,600.</p>
            <Button className="mt-4 bg-white text-indigo-600 hover:bg-white/90 rounded-xl font-black text-xs h-10 w-full shadow-lg">
              Manage Alerts
            </Button>
          </div>
          <div className="p-6 rounded-[2rem] bg-surface border border-border/40 flex items-center justify-between hover:bg-surface-muted/30 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Info size={20} />
              </div>
              <span className="font-black text-sm">Farmer Support</span>
            </div>
            <ChevronRight size={20} className="text-muted group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Nearby Warehouses */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <div>
            <h3 className="text-2xl font-black tracking-tight">Nearby Warehouses</h3>
            <p className="text-sm text-muted font-medium">Verified facilities within 50km of your location.</p>
          </div>
          <Link href="/dashboard/farmer/warehouses">
            <Button variant="secondary" className="font-black text-xs uppercase tracking-widest px-4 py-2 h-auto flex items-center gap-1 hover:text-primary">
              View All <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.warehouses?.map((w: any) => (
             <WarehouseCard 
              key={w._id} 
              name={w.name}
              location={w.location}
              price={w.pricePerTonPerWeek}
              capacityUsage={Math.round((w.currentStockTons / w.capacityTons) * 100)}
              imageUrl={w.images?.[0] || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"}
              tags={w.certifications || ["ISO Certified", "Secure"]}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
