import { Activity, Droplets, IndianRupee, Sprout } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/antigravity/badge";
import { Card, CardContent, CardHeader } from "@/components/antigravity/card";
import type { Insight } from "@/types/domain";

const stats = [
  { label: "Active holdings", value: "128", note: "Across 9 districts", icon: Sprout },
  { label: "Water coverage", value: "76%", note: "11% improved this cycle", icon: Droplets },
  { label: "Risk alerts", value: "14", note: "3 high priority", icon: Activity },
  { label: "Market upside", value: "INR 2.8Cr", note: "Projected season delta", icon: IndianRupee },
];

const insights: Insight[] = [
  {
    id: "soil",
    label: "Soil recovery",
    value: "North cluster",
    trend: "Organic carbon scores improved after bio-input protocol.",
    status: "low",
  },
  {
    id: "irrigation",
    label: "Irrigation gap",
    value: "23 plots",
    trend: "Micro-drip coverage is below threshold for summer vegetables.",
    status: "medium",
  },
  {
    id: "disease",
    label: "Disease pressure",
    value: "Chilli",
    trend: "Image triage suggests early leaf curl pattern in two villages.",
    status: "high",
  },
];

export function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <p className="text-sm font-semibold text-muted">{stat.label}</p>
                <stat.icon className="size-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.note}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">Holding intelligence</h3>
              <p className="text-sm text-muted">
                A scalable workspace for farm asset data, crop plans, and AI risk scoring.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {["Land records", "Crop calendar", "Input ledger"].map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-border bg-surface-muted p-4"
                  >
                    <p className="font-semibold">{item}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Ready for API-backed workflows and Atlas collections.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">AI insights</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((item) => (
                <div key={item.id} className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.label}</p>
                    <Badge intent={item.status}>{item.status}</Badge>
                  </div>
                  <p className="mt-2 text-lg font-black">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.trend}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
