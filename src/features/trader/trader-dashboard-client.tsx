"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Banknote, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  CheckCircle2,
  Package,
  History,
  ChevronRight,
  Loader2,
  LayoutDashboard,
  ShoppingCart,
  LineChart
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function TraderDashboardClient({ sessionUser }: { sessionUser: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const firstName = sessionUser?.name?.split(" ")[0] ?? "Trader";

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/trader/stats");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch trader stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="size-12 animate-spin text-primary" />
      <p className="font-black text-lg text-muted animate-pulse tracking-widest uppercase">Syncing Market Data...</p>
    </div>
  );

  const stats = [
    { label: "Portfolio Value", value: `₹${((data?.stats?.portfolioValue || 42000000) / 10000000).toFixed(1)} Cr`, note: "↑ 8.3% this month", icon: Banknote, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Bids", value: data?.stats?.activeTrades || 0, note: "Pending response", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
    { label: "Win Rate", value: `${data?.stats?.winRate || 0}%`, note: "Last 90 days", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Monthly P&L", value: `+₹${((data?.stats?.monthlyPnL || 184000) / 1000).toFixed(1)}K`, note: "Net realized", icon: LineChart, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Welcome back, {firstName} 📈</h2>
          <p className="text-muted text-sm mt-2 font-medium">Market intelligence and active trade management.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/dashboard/trader/marketplace">
            <Button className="px-8 py-6 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <ShoppingCart className="size-4" /> Go to Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface p-8 rounded-[2.5rem] border border-border/40 flex flex-col gap-6 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative"
          >
            <div className={`size-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1 text-foreground">{stat.value}</h3>
              <p className="text-xs text-muted mt-1 font-medium">{stat.note}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Live Market Card */}
        <Card className="lg:col-span-2 border-border/40 rounded-[3rem] shadow-sm overflow-hidden bg-surface">
          <CardContent className="p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-xl flex items-center gap-3"><TrendingUp className="size-6 text-primary" /> APMC Mandi Rates</h3>
              <Badge intent="low" className="font-bold">Real-time (Agmarknet)</Badge>
            </div>
            <div className="grid gap-4">
              {(data?.marketPrices || []).map((m: any) => (
                <div key={m.commodity} className="flex items-center justify-between p-5 rounded-3xl border border-border/40 bg-surface-muted/10 group hover:bg-surface-muted/30 transition-colors">
                  <span className="font-black text-sm text-foreground/80">{m.commodity}</span>
                  <div className="flex items-center gap-6">
                    <span className="font-mono font-bold text-sm">{m.price}</span>
                    <span className={`flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${m.up ? 'bg-emerald-500/10 text-emerald-600' : 'bg-danger/10 text-danger'}`}>
                      {m.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {m.change}
                    </span>
                  </div>
                </div>
              ))}
              {data?.marketPrices?.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-border/40 rounded-3xl">
                  <p className="text-muted text-sm font-bold">No active marketplace data.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bids Card */}
        <Card className="border-border/40 rounded-[3rem] shadow-sm overflow-hidden bg-surface flex flex-col">
          <CardContent className="p-10 flex flex-col h-full">
            <h3 className="font-black text-xl mb-10 flex items-center gap-3"><History className="size-6 text-primary" /> Active Activity</h3>
            <div className="space-y-4 flex-1">
              {data?.recentBids?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/40 rounded-[2rem]">
                  <Clock className="size-10 text-muted opacity-20 mb-4" />
                  <p className="text-sm font-bold text-muted">No recent bids found.</p>
                  <Link href="/dashboard/trader/marketplace" className="mt-2 text-xs font-black text-primary hover:underline">Start Bidding</Link>
                </div>
              ) : (
                data?.recentBids?.map((bid: any) => (
                  <div key={bid._id} className="p-5 rounded-3xl border border-border/40 bg-surface-muted/10 hover:bg-surface-muted/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-black text-sm text-foreground">{bid.bookingId?.cropName}</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{bid.bookingId?.quantityTons} MT</p>
                      </div>
                      <Badge intent={bid.status === "accepted" ? "high" : bid.status === "rejected" ? "low" : "medium"}>
                        {bid.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
                      <span className="font-black text-lg text-primary">₹{bid.amount.toLocaleString()}</span>
                      <p className="text-[10px] text-muted font-bold">{new Date(bid.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/trader/marketplace">
              <Button variant="secondary" className="w-full mt-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                View Marketplace <ChevronRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
