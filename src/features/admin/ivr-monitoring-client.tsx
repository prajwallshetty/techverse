"use client";

import { useState, useEffect } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
} from "recharts";
import { 
  PhoneCall, 
  Users, 
  Clock, 
  Activity, 
  Search, 
  FileText,
  Loader2,
  PhoneIncoming,
  Headphones,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function IVRMonitoringClient() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/ivr/stats");
      const data = await res.json();
      setStats(data.stats);
      setLogs(data.logs);
      setChartData(data.chartData);
    } catch (err) {
      console.error("Failed to fetch IVR data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="size-10 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            IVR Voice Ops <Badge intent="medium" className="bg-primary/10 text-primary border-none text-[10px]">REAL-TIME</Badge>
          </h2>
          <p className="text-muted text-sm mt-1">Monitoring offline farmer interactions via Exotel.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={fetchData} className="px-4 flex items-center gap-2">
            <Activity className="size-4" /> Refresh Logs
          </Button>
          <Button className="px-6 shadow-lg shadow-primary/20 bg-primary text-white">Call Center Config</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/60 bg-gradient-to-br from-surface to-primary/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <PhoneIncoming className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Total Calls</p>
            <h3 className="text-2xl font-black mt-1">{stats?.totalCalls.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Users className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Unique Callers</p>
            <h3 className="text-2xl font-black mt-1">{stats?.uniqueCallers.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <Headphones className="size-5" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-muted tracking-widest">Top Service</p>
            <h3 className="text-2xl font-black mt-1">{stats?.topService}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Call Log Table */}
        <Card className="lg:col-span-2 border-border/60 overflow-hidden shadow-2xl shadow-primary/5">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border/60 flex items-center justify-between bg-surface-muted/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg text-white">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Live Interaction Log</h3>
                  <p className="text-xs text-muted font-medium">Real-time stream of IVR keypad entries.</p>
                </div>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input type="text" placeholder="Search phone numbers..." className="w-full bg-surface border border-border/60 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-muted/30 border-b border-border/60">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Caller ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Farmer</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Service</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Digit</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-surface-muted/10 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-sm text-primary">{log.callerId}</td>
                      <td className="px-6 py-4 font-bold text-sm">{log.farmerId?.name || <span className="text-muted italic opacity-50">Guest</span>}</td>
                      <td className="px-6 py-4">
                        <Badge intent={
                          log.serviceRequested === "LOANS" ? "high" : 
                          log.serviceRequested === "MARKETPLACE" ? "medium" : "low"
                        }>
                          {log.serviceRequested}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="size-7 rounded-lg bg-surface-muted flex items-center justify-center font-black text-xs border border-border/60">
                          {log.digitsPressed}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted font-medium">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution Pie */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="font-black text-lg mb-6">Service Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-6">
              {chartData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="font-bold text-muted uppercase">{d.name}</span>
                  <span className="ml-auto font-black">{d.value} hits</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
