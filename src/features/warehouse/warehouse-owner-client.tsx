"use client";

import { useState, useEffect } from "react";
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
  Users, 
  Package, 
  Banknote, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Settings,
  LayoutDashboard,
  Box,
  MapPin,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/antigravity/tabs";
import { useTranslation } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#8884d8"];

export function WarehouseOwnerClient() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch("/api/warehouse/stats"),
        fetch("/api/warehouse/bookings")
      ]);
      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();
      
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

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="size-12 animate-spin text-primary" />
      <p className="font-black text-lg text-muted animate-pulse tracking-widest uppercase">Initializing Facility Dashboard...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto pb-32">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">{t("common.nav.inventory")} <span className="text-primary">.</span></h2>
          <p className="text-muted text-sm mt-2 font-medium flex items-center gap-2">
             <MapPin className="size-4" /> {stats?.warehouseName || "Facility Hub"} • Real-time Operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-6 py-6 rounded-2xl font-black text-xs uppercase tracking-widest border-border/60">
            Export Report
          </Button>
          <Button className="px-8 py-6 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Plus className="size-4" /> Add Space
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="bg-surface-muted/50 p-1.5 rounded-[2rem] border border-border/40 w-fit mb-10">
          <TabsTrigger value="overview" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <LayoutDashboard className="size-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <Clock className="size-4 mr-2" /> Bookings
          </TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <Box className="size-4 mr-2" /> Inventory
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs uppercase tracking-widest">
             <Settings className="size-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: t("common.dashboard.total_revenue"), value: `₹${stats?.totalRevenue?.toLocaleString()}`, icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+12.5%' },
              { label: t("common.dashboard.capacity_used"), value: `${stats?.currentStock} / ${stats?.totalCapacity} MT`, icon: Package, color: 'text-primary', bg: 'bg-primary/10', progress: stats?.utilizationRate },
              { label: t("common.dashboard.active_bookings"), value: `${stats?.activeBookings} Reservations`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Completed', value: `${stats?.completedBookings} Deliveries`, icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
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
                <h3 className="font-black text-xl mb-10 tracking-tight text-center">Capacity Allocation</h3>
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
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Utilized</p>
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

        <TabsContent value="bookings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/40 rounded-[3rem] overflow-hidden bg-surface shadow-xl shadow-black/5">
            <CardContent className="p-0">
              <div className="p-10 border-b border-border/40 flex items-center justify-between bg-surface-muted/10">
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-foreground">Reservation Queue</h3>
                  <p className="text-sm text-muted font-medium mt-1">Manage incoming and active storage requests.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge intent="low" className="rounded-xl px-4 py-2 font-black text-[10px] uppercase cursor-pointer hover:bg-surface-muted transition-colors">Pending</Badge>
                  <Badge intent="high" className="rounded-xl px-4 py-2 font-black text-[10px] uppercase cursor-pointer hover:bg-surface-muted transition-colors">Confirmed</Badge>
                </div>
              </div>
              <div className="overflow-x-auto px-6 pb-10 pt-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">Farmer Profile</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">Crop Spec</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">Storage Vol</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em]">Status</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase text-muted tracking-[0.2em] text-right">Actions</th>
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
                                  Complete Delivery
                                </Button>
                              )}
                              <Button variant="secondary" className="px-5 py-2.5 rounded-xl text-[10px] h-auto font-black uppercase tracking-widest border-border/60">
                                Details <ChevronRight className="size-3 ml-1" />
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

    </div>
  );
}
