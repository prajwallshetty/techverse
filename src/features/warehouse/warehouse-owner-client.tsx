"use client";

import { useState, useEffect, useRef } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  TrendingUp, 
  Package, 
  Banknote, 
  Clock,
  CheckCircle2,
  Loader2,
  Plus,
  Settings,
  LayoutDashboard,
  Box,
  MapPin,
  Map,
  ChevronRight,
  Activity,
  AlertTriangle,
  X,
  Building2,
  Warehouse
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/antigravity/tabs";
import { useTranslation } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";
import { WarehouseOwnerMap } from "./warehouse-owner-map";
import { useSearchParams, useRouter } from "next/navigation";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#8884d8"];

const DEFAULT_FORM = {
  name: "",
  location: "",
  latitude: "",
  longitude: "",
  capacityTons: "",
  pricePerTonPerWeek: "500",
  certifications: "",
};

export function WarehouseOwnerClient() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  // Sync state with URL query param
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Add Space modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch("/api/warehouse/stats"),
        fetch("/api/warehouse/bookings")
      ]);
      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();
      // stats now includes warehouseName, location, latitude, longitude, pendingBookings
      setStats(statsData?.stats || null);
      setChartData(statsData?.chartData || []);
      setBookings(bookingsData?.bookings || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch("/api/warehouse/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Update failed");
    }
  };

  const handleAddSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          latitude: form.latitude || undefined,
          longitude: form.longitude || undefined,
          capacityTons: Number(form.capacityTons),
          pricePerTonPerWeek: Number(form.pricePerTonPerWeek),
          certifications: form.certifications
            ? form.certifications.split(",").map((c) => c.trim()).filter(Boolean)
            : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create warehouse.");
      } else {
        setSuccessMsg(`"${data.warehouse.name}" added successfully!`);
        setForm(DEFAULT_FORM);
        fetchData();
        setTimeout(() => {
          setShowAddModal(false);
          setSuccessMsg(null);
        }, 2000);
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="size-12 animate-spin text-primary" />
      <p className="font-black text-lg text-muted animate-pulse tracking-widest uppercase">{t('common.status.loading')}</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto pb-32">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">{t('dashboard.warehouse.owner_dashboard')} <span className="text-primary">.</span></h2>
          <p className="text-muted text-sm mt-2 font-medium flex items-center gap-2">
             <MapPin className="size-4" /> {stats?.warehouseName || t('dashboard.warehouse.facility_name')} • {t('common.status.active')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-6 py-6 rounded-2xl font-black text-xs uppercase tracking-widest border-border/60">
            {t('common.actions.export')}
          </Button>
          <Button
            className="px-8 py-6 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 font-black text-xs uppercase tracking-widest flex items-center gap-2"
            onClick={() => { setShowAddModal(true); setFormError(null); setSuccessMsg(null); }}
          >
            <Plus className="size-4" /> {t('dashboard.warehouse.add_new')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-surface-muted/50 p-1.5 rounded-[2rem] border border-border/40 w-fit mb-10">
          <TabsTrigger value="overview" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <LayoutDashboard className="size-4 mr-2" /> {t('common.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <Clock className="size-4 mr-2" /> {t('dashboard.warehouse.recent_bookings')}
          </TabsTrigger>
          <TabsTrigger value="map" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <Map className="size-4 mr-2" /> {t('common.tabs.map')}
          </TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <Box className="size-4 mr-2" /> {t('common.nav.inventory')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <Settings className="size-4 mr-2" /> {t('common.nav.settings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: t("common.dashboard.total_revenue"), value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+12.5%' },
              { label: t("common.dashboard.capacity_used"), value: `${stats?.currentStock ?? 0} / ${stats?.totalCapacity ?? 0} MT`, icon: Package, color: 'text-primary', bg: 'bg-primary/10', progress: stats?.utilizationRate ?? 0 },
              { label: t("common.dashboard.active_bookings"), value: `${stats?.activeBookings ?? 0}`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: t('common.status.completed'), value: `${stats?.completedBookings ?? 0}`, icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            ].map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface p-8 rounded-[2.5rem] border border-border/40 flex flex-col gap-6 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative"
              >
                <div className="flex justify-between items-start">
                  <div className={`size-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={28} />
                  </div>
                  {stat.trend && (
                    <Badge intent="high" className="bg-emerald-500/10 text-emerald-600 border-none rounded-xl font-black">{stat.trend}</Badge>
                  )}
                </div>
                <div>
                  <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-2xl font-black mt-1 text-foreground">{stat.value}</h3>
                </div>
                {stat.progress !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-primary h-full rounded-full" 
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-border/40 rounded-[3rem] shadow-sm overflow-hidden bg-surface">
              <CardContent className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-black text-xl flex items-center gap-3"><TrendingUp className="size-6 text-primary" /> {t("common.dashboard.stock_distribution")}</h3>
                  <Badge intent="low" className="font-bold">MT / Crop Type</Badge>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold' }}
                        cursor={{ fill: '#f1f5f9', radius: 10 }}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 rounded-[3rem] shadow-sm overflow-hidden bg-surface">
              <CardContent className="p-10">
                <h3 className="font-black text-xl mb-10 tracking-tight text-center">{t('dashboard.warehouse.capacity_allocation')}</h3>
                <div className="h-[300px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-black text-foreground">{stats?.utilizationRate}%</p>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">{t('dashboard.warehouse.utilized')}</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  {chartData.slice(0, 3).map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-muted/30 transition-colors group cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="size-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-black text-sm text-foreground/80">{d.name}</span>
                      </div>
                      <span className="font-black text-sm">{d.value} MT</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Map Tab ──────────────────────────────────────────────────────── */}
        <TabsContent value="map" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left: live map */}
            <div className="flex-1 h-[520px] lg:h-[600px] rounded-[3rem] overflow-hidden border border-border/40 shadow-sm">
              <WarehouseOwnerMap stats={stats} />
            </div>

            {/* Right: stats sidebar */}
            <div className="lg:w-[340px] space-y-5">

              {/* Facility card */}
              <Card className="border-border/40 rounded-[2.5rem] bg-surface shadow-sm">
                <CardContent className="p-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-foreground leading-tight">{stats?.warehouseName || t('dashboard.warehouse.facility_name')}</p>
                      <p className="text-xs text-muted font-medium mt-0.5">{stats?.location || "—"}</p>
                    </div>
                  </div>

                  {/* Utilization bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-muted tracking-widest">{t('dashboard.warehouse.utilized')}</span>
                      <span className={`text-sm font-black ${
                        (stats?.utilizationRate ?? 0) > 80
                          ? "text-red-500"
                          : (stats?.utilizationRate ?? 0) > 50
                          ? "text-amber-500"
                          : "text-primary"
                      }`}>{stats?.utilizationRate ?? 0}%</span>
                    </div>
                    <div className="w-full bg-surface-muted h-3 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.utilizationRate ?? 0}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          (stats?.utilizationRate ?? 0) > 80
                            ? "bg-red-500"
                            : (stats?.utilizationRate ?? 0) > 50
                            ? "bg-amber-500"
                            : "bg-primary"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted font-medium mt-1.5">
                      {stats?.currentStock ?? 0} MT used of {stats?.totalCapacity ?? 0} MT total
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Booking status grid */}
              {[
                { label: t('common.status.active'), value: stats?.activeBookings ?? 0, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: t('dashboard.warehouse.pending'), value: stats?.pendingBookings ?? 0, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: t('common.status.completed'), value: stats?.completedBookings ?? 0, icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                { label: t('common.dashboard.total_revenue'), value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: Banknote, color: "text-primary", bg: "bg-primary/10" },
              ].map((item) => (
                <Card key={item.label} className="border-border/40 rounded-[2rem] bg-surface shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                      <item.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted tracking-widest">{item.label}</p>
                      <p className="text-xl font-black text-foreground mt-0.5">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Recent bookings list */}
              {bookings.length > 0 && (
                <Card className="border-border/40 rounded-[2.5rem] bg-surface shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-4">{t('dashboard.warehouse.recent_bookings')}</p>
                    <div className="space-y-3">
                      {bookings.slice(0, 4).map((b: any) => (
                        <div key={b._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                              {b.farmerId?.name?.[0] ?? "F"}
                            </div>
                            <div>
                              <p className="text-xs font-black leading-none">{b.farmerId?.name ?? t('auth.farmer')}</p>
                              <p className="text-[10px] text-muted font-medium mt-0.5">{b.cropName} · {b.quantityTons} MT</p>
                            </div>
                          </div>
                          <Badge
                            intent={b.status === "confirmed" ? "high" : b.status === "completed" ? "medium" : "low"}
                            className="rounded-xl text-[9px] font-black uppercase"
                          >
                            {b.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/40 rounded-[3rem] overflow-hidden bg-surface shadow-xl shadow-black/5">
            <CardContent className="p-0">
              <div className="p-10 border-b border-border/40 flex items-center justify-between bg-surface-muted/10">
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-foreground">{t('dashboard.warehouse.reservation_queue')}</h3>
                  <p className="text-sm text-muted font-medium mt-1">{t('dashboard.warehouse.queue_desc')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge intent="low" className="rounded-xl px-4 py-2 font-black text-[10px] uppercase cursor-pointer hover:bg-surface-muted transition-colors">{t('dashboard.warehouse.pending')}</Badge>
                  <Badge intent="high" className="rounded-xl px-4 py-2 font-black text-[10px] uppercase cursor-pointer hover:bg-surface-muted transition-colors">{t('dashboard.warehouse.confirmed')}</Badge>
                </div>
              </div>
              <div className="overflow-x-auto px-6 pb-10 pt-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">{t('dashboard.warehouse.farmer_profile')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">{t('dashboard.warehouse.crop_spec')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">{t('dashboard.warehouse.storage_vol')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">{t('dashboard.warehouse.status')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em] text-right">{t('dashboard.warehouse.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    <AnimatePresence>
                      {bookings.map((booking, idx) => (
                        <motion.tr 
                          key={booking._id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-surface-muted/10 transition-all group"
                        >
                          <td className="px-6 py-8">
                            <div className="flex items-center gap-4">
                              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-inner">
                                {booking.farmerId?.name?.[0] || 'F'}
                              </div>
                              <div>
                                <p className="font-black text-foreground leading-none">{booking.farmerId?.name}</p>
                                <p className="text-xs text-muted font-medium mt-1.5">{booking.farmerId?.email || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-8">
                            <Badge className="bg-surface-muted text-foreground border-border/60 rounded-xl font-black text-[10px] uppercase tracking-widest px-3 py-1.5">{booking.cropName}</Badge>
                          </td>
                          <td className="px-6 py-8">
                            <div className="flex items-end gap-1.5">
                              <span className="font-black text-xl text-foreground">{booking.quantityTons}</span>
                              <span className="text-[10px] font-black text-muted uppercase mb-1">MT</span>
                            </div>
                          </td>
                          <td className="px-6 py-8">
                            <Badge 
                              intent={booking.status === "confirmed" ? "high" : booking.status === "completed" ? "medium" : "low"}
                              className="rounded-xl px-4 py-1.5 font-black text-[10px] uppercase"
                            >
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-8 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {booking.status === "confirmed" && (
                                <Button 
                                  className="px-5 py-2.5 rounded-xl text-[10px] h-auto bg-emerald-500 hover:bg-emerald-600 font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10"
                                  onClick={() => handleUpdateStatus(booking._id, "completed")}
                                >
                                  {t('common.actions.complete_delivery')}
                                </Button>
                              )}
                              <Button variant="secondary" className="px-5 py-2.5 rounded-xl text-[10px] h-auto font-black uppercase tracking-widest border-border/60">
                                {t('common.actions.view')} <ChevronRight className="size-3 ml-1" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Add Space Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-surface rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-border/30">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-foreground tracking-tight">{t('dashboard.warehouse.add_new')}</h3>
                    <p className="text-xs text-muted font-medium mt-0.5">{t('dashboard.warehouse.add_new_desc')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="size-10 rounded-2xl flex items-center justify-center hover:bg-surface-muted transition-colors text-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleAddSpace} className="px-10 py-8 space-y-5">
                {formError && (
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-semibold text-red-500">
                    {formError}
                  </div>
                )}
                {successMsg && (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-semibold text-emerald-600">
                    ✓ {successMsg}
                  </div>
                )}

                {/* Warehouse Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('dashboard.warehouse.facility_name')} *</label>
                  <div className="relative">
                    <Warehouse className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. North Hub Storage"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border/60 bg-surface-muted/30 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('dashboard.warehouse.location')} *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Bagalkot, KA"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border/60 bg-surface-muted/30 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Lat / Lng */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('dashboard.warehouse.latitude')}</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="16.1815"
                      value={form.latitude}
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border/60 bg-surface-muted/30 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('dashboard.warehouse.longitude')}</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="75.6961"
                      value={form.longitude}
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border/60 bg-surface-muted/30 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('dashboard.warehouse.capacity_tons')} *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="5000"
                      value={form.capacityTons}
                      onChange={(e) => setForm({ ...form, capacityTons: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border/60 bg-surface-muted/30 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('dashboard.warehouse.price_ton')}</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="500"
                      value={form.pricePerTonPerWeek}
                      onChange={(e) => setForm({ ...form, pricePerTonPerWeek: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border/60 bg-surface-muted/30 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('dashboard.warehouse.certifications')} <span className="normal-case font-medium">{t('dashboard.warehouse.cert_desc')}</span></label>
                  <input
                    type="text"
                    placeholder="FSSAI, ISO 9001, Cold Chain"
                    value={form.certifications}
                    onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border/60 bg-surface-muted/30 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-border/60"
                    onClick={() => setShowAddModal(false)}
                  >
                    {t('common.actions.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    {submitting ? t('common.status.saving') : t('common.actions.create_facility')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
