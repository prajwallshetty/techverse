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
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#8884d8"];

export function WarehouseOwnerClient() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch("/api/warehouse/stats"),
        fetch("/api/warehouse/bookings")
      ]);
      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();
      
      setStats(statsData.stats);
      setChartData(statsData.chartData);
      setBookings(bookingsData.bookings);
    } catch (error) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="size-10 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Facility Overview</h2>
          <p className="text-muted text-sm mt-1">Real-time capacity tracking and revenue analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4">Export Report</Button>
          <Button className="px-6 shadow-lg shadow-primary/20">Manage Capacity</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/60 bg-gradient-to-br from-surface to-primary/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <IndianRupee className="size-5" />
              </div>
              <Badge intent="high" className="bg-emerald-500/10 text-emerald-600 border-none">+12%</Badge>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Total Revenue</p>
            <h3 className="text-2xl font-black mt-1">₹{stats?.totalRevenue.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <Package className="size-5" />
              </div>
              <span className="text-[10px] font-bold text-muted">{stats?.utilizationRate}% Utilized</span>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Capacity Used</p>
            <h3 className="text-2xl font-black mt-1">{stats?.currentStock} / {stats?.totalCapacity} MT</h3>
            <div className="w-full bg-surface-muted h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-accent h-full rounded-full" style={{ width: `${stats?.utilizationRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Clock className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Active Bookings</p>
            <h3 className="text-2xl font-black mt-1">{stats?.activeBookings} Reservations</h3>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Fulfilled</p>
            <h3 className="text-2xl font-black mt-1">{stats?.completedBookings} Completed</h3>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-6">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2"><TrendingUp className="size-5 text-primary" /> Stock Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="font-black text-lg mb-6">Capacity Breakdown</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {chartData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="font-medium">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value} MT</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Management */}
      <Card className="border-border/60 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h3 className="font-black text-lg">Active Management</h3>
            <div className="flex items-center gap-2">
              <Badge intent="low" className="cursor-pointer">Pending</Badge>
              <Badge intent="high" className="cursor-pointer">Confirmed</Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-muted/30 border-b border-border/60">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Farmer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Crop Type</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-surface-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm">{booking.farmerId?.name}</p>
                      <p className="text-xs text-muted">{booking.farmerId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-surface-muted border-border font-bold text-[10px]">{booking.cropName}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-sm">{booking.quantityTons} MT</td>
                    <td className="px-6 py-4">
                      <Badge intent={booking.status === "confirmed" ? "high" : booking.status === "completed" ? "medium" : "low"}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === "confirmed" && (
                          <Button 
                            className="px-3 py-1 text-[10px] h-auto bg-emerald-500 hover:bg-emerald-600 font-black uppercase"
                            onClick={() => handleUpdateStatus(booking._id, "completed")}
                          >
                            Mark Fulfilled
                          </Button>
                        )}
                        <Button variant="secondary" className="px-3 py-1 text-[10px] h-auto font-black uppercase">Details</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
