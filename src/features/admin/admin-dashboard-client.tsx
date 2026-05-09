"use client";

import { useState, useEffect } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  Database, 
  Activity, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  FileText,
  Building2,
  Banknote
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function AdminDashboardClient() {
  const [stats, setStats] = useState<any>(null);
  const [roleData, setRoleData] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, auditRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/transactions")
      ]);
      const statsData = await statsRes.json();
      const auditData = await auditRes.json();
      
      setStats(statsData.stats);
      setRoleData(statsData.roleData);
      setAuditLog(auditData.auditLog);
    } catch (err) {
      console.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="size-10 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Governance Portal <Badge intent="medium" className="bg-primary/10 text-primary border-none text-[10px]">SYSTEM ADMIN</Badge>
          </h2>
          <p className="text-muted text-sm mt-1">Global oversight of the AgriHold AI ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 flex items-center gap-2">
            <ShieldAlert className="size-4" /> Fraud Reports
          </Button>
          <Button className="px-6 shadow-lg shadow-primary/20">Platform Settings</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/60 bg-gradient-to-br from-surface to-primary/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Database className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Total Tonnage</p>
            <h3 className="text-2xl font-black mt-1">{stats?.totalTonnage.toLocaleString()} MT</h3>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Banknote className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Loan Exposure</p>
            <h3 className="text-2xl font-black mt-1">₹{stats?.loanExposure.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <Users className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Total Users</p>
            <h3 className="text-2xl font-black mt-1">{stats?.totalUsers} Accounts</h3>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Activity className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Market Activity</p>
            <h3 className="text-2xl font-black mt-1">{stats?.totalBids} Bids</h3>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-6">
            <h3 className="font-black text-lg mb-6">Marketplace Liquidity</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {roleData.map((_, index) => (
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
            <h3 className="font-black text-lg mb-6">User Role Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {roleData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {roleData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="font-bold text-muted uppercase">{d.name}</span>
                  <span className="ml-auto font-black">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Transaction Log */}
      <Card className="border-border/60 overflow-hidden shadow-2xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/60 flex items-center justify-between bg-surface-muted/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white">
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="font-black text-lg">System Audit Log</h3>
                <p className="text-xs text-muted font-medium">Real-time stream of platform events.</p>
              </div>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input type="text" placeholder="Search transactions..." className="w-full bg-surface border border-border/60 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-muted/30 border-b border-border/60">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Event Type</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Primary Actor</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Amount/Val</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {auditLog.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.type === "BOOKING" && <Building2 className="size-4 text-primary" />}
                        {item.type === "LOAN" && <Banknote className="size-4 text-emerald-500" />}
                        {item.type === "BID" && <TrendingUp className="size-4 text-accent" />}
                        <span className="text-xs font-black tracking-tight">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">{item.user || "System"}</td>
                    <td className="px-6 py-4 font-mono font-bold text-sm">₹{item.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge intent={
                        item.status === "confirmed" || item.status === "active" || item.status === "accepted" 
                          ? "high" : "low"
                      }>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted font-medium">
                      {new Date(item.date).toLocaleString()}
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
