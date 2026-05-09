"use client";

import { useState, useEffect } from "react";
import { 
  Warehouse as WarehouseIcon, 
  Banknote, 
  Gavel,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export function FarmerDashboardClient({ sessionUser }: { sessionUser: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const firstName = sessionUser?.name?.split(" ")[0] ?? "Farmer";

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

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="size-10 animate-spin text-primary" />
      <p className="font-semibold text-muted">Loading your dashboard...</p>
    </div>
  );

  const stats = [
    {
      label: 'Stored Crops',
      value: `${data?.stats?.totalStoredWeight ?? 0} MT`,
      icon: WarehouseIcon,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Active Bids',
      value: data?.stats?.activeBidsCount ?? 0,
      icon: Gavel,
      color: 'text-indigo-600',
      bg: 'bg-indigo-500/10',
    },
  ];

  const quickActions = [
    { label: 'Book Storage', href: '/dashboard/farmer/warehouses', icon: WarehouseIcon, primary: true },
    { label: 'My Bookings', href: '/dashboard/farmer/bookings', icon: CheckCircle2, primary: false },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1400px] mx-auto pb-32">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Good morning, {firstName} 🌾
          </h1>
          <p className="text-muted font-medium mt-1">
            Here&apos;s an overview of your agricultural assets today.
          </p>
        </div>
        <Link
          href="/dashboard/farmer/warehouses"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          Book Storage <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">{stat.label}</p>
              <p className="text-2xl font-black text-foreground mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-muted mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center justify-between p-4 rounded-2xl border font-semibold text-sm transition-all hover:shadow-md group ${
                action.primary
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:bg-primary/90'
                  : 'bg-surface border-border text-foreground hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <action.icon className="size-5 shrink-0" />
                {action.label}
              </div>
              <ArrowRight className="size-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted">Recent Bookings</h2>
          <Link
            href="/dashboard/farmer/bookings"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="size-3" />
          </Link>
        </div>

        {data?.bookings?.length === 0 || !data?.bookings ? (
          <div className="bg-surface border border-dashed border-border rounded-2xl p-12 text-center">
            <WarehouseIcon className="size-10 text-muted/40 mx-auto mb-3" />
            <p className="font-semibold text-muted">No bookings yet</p>
            <p className="text-sm text-muted/60 mt-1">Book your first storage slot to get started.</p>
            <Link
              href="/dashboard/farmer/warehouses"
              className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              Browse Warehouses <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted/30">
                  <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted">Warehouse</th>
                  <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted">Crop</th>
                  <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted">Quantity</th>
                  <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data.bookings as any[]).slice(0, 5).map((b: any) => (
                  <tr key={b._id} className="hover:bg-surface-muted/10 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary shrink-0" />
                        <span className="text-sm font-semibold truncate max-w-[140px]">{b.warehouseId?.name ?? 'N/A'}</span>
                      </div>
                      <p className="text-xs text-muted ml-6">{b.warehouseId?.location}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold">{b.cropName}</td>
                    <td className="px-5 py-4 text-sm font-mono font-bold">{b.quantityTons} MT</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600' :
                        b.status === 'completed' ? 'bg-primary/10 text-primary' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {b.status === 'confirmed' && <CheckCircle2 className="size-3" />}
                        {b.status === 'pending' && <Clock className="size-3" />}
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Market Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-primary/20 bg-primary/5">
        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <TrendingUp className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-foreground">Paddy prices are trending up in your region</p>
          <p className="text-xs text-muted mt-0.5">List your stored crops on the marketplace to get competitive bids from traders.</p>
        </div>
        <Link
          href="/dashboard/farmer/bookings"
          className="shrink-0 text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          View Bookings <ArrowRight className="size-3" />
        </Link>
      </div>

    </div>
  );
}
