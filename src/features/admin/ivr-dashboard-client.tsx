"use client";

import { useState, useEffect } from "react";
import { PhoneCall, BarChart2, CheckCircle2, Search, HelpCircle, AlertCircle } from "lucide-react";
import { pusherClient } from "@/lib/pusher/client";

export function IvrDashboardClient({ initialCalls }: { initialCalls: any[] }) {
  const [calls, setCalls] = useState(initialCalls);

  useEffect(() => {
    // Listen for real-time IVR bookings
    const channel = pusherClient.subscribe("ivr-channel");
    channel.bind("new-ivr-booking", (data: any) => {
      // Refresh the page or update state to show the new booking
      // For simplicity in this MVP, we can just show an alert or prepend a fake call log
      alert(`New IVR Booking Alert! ${data.tons} Tons from ${data.farmerPhone}`);
    });

    return () => {
      pusherClient.unsubscribe("ivr-channel");
    };
  }, []);

  const totalCalls = calls.length;
  const bookingsMade = calls.filter(c => c.actionTaken === "booking_created").length;
  const conversionRate = totalCalls > 0 ? Math.round((bookingsMade / totalCalls) * 100) : 0;

  const actionIcons: Record<string, React.ReactNode> = {
    "booking_created": <CheckCircle2 className="size-4 text-emerald-500" />,
    "search_warehouse": <Search className="size-4 text-primary" />,
    "price_check": <BarChart2 className="size-4 text-indigo-500" />,
    "menu_navigated": <HelpCircle className="size-4 text-muted" />,
    "status_check": <HelpCircle className="size-4 text-blue-500" />,
    "failed": <AlertCircle className="size-4 text-danger" />
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <PhoneCall className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Total IVR Calls</p>
              <p className="text-3xl font-black">{totalCalls}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Bookings Created</p>
              <p className="text-3xl font-black">{bookingsMade}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600">
              <BarChart2 className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Conversion Rate</p>
              <p className="text-3xl font-black">{conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-black text-lg">Recent Call Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-muted/30">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">Time</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">Phone Number</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">Action Taken</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">Call SID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {calls.map((call) => (
                <tr key={call._id} className="hover:bg-surface-muted/10 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-muted">
                    {new Date(call.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono text-sm">{call.callerPhone}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 bg-surface-muted/50 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {actionIcons[call.actionTaken]} {call.actionTaken.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted truncate max-w-[120px]">
                    {call.callSid}
                  </td>
                </tr>
              ))}
              {calls.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-muted font-medium">
                    No IVR calls recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
