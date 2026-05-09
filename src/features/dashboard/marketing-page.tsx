import { ArrowRight, CloudSun, Database, LockKeyhole, Radar, Sprout } from "lucide-react";

import { Badge } from "@/components/antigravity/badge";
import { Card, CardContent, CardHeader } from "@/components/antigravity/card";
import { LinkButton } from "@/components/antigravity/button";

const metrics = [
  ["42K", "acres monitored"],
  ["18%", "yield upside found"],
  ["6 days", "risk response window"],
  ["91", "soil health index"],
];

const capabilities = [
  {
    title: "Farm holding graph",
    body: "Unify plots, owners, crops, soil data, irrigation assets, labor, and market exposure in MongoDB Atlas.",
    icon: Database,
  },
  {
    title: "Crop risk cockpit",
    body: "Prioritize disease, water stress, input variance, and price volatility from one responsive command center.",
    icon: Radar,
  },
  {
    title: "Secure founder stack",
    body: "Auth.js, protected API routes, typed payload validation, and environment-first configuration.",
    icon: LockKeyhole,
  },
];

export function MarketingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="mx-auto grid min-h-[88vh] max-w-7xl gap-10 px-5 py-8 lg:grid-cols-[1fr_460px] lg:px-8">
          <div className="flex flex-col justify-center py-12">
            <div className="mb-6 flex flex-wrap gap-3">
              <Badge>Atlas ready</Badge>
              <Badge intent="medium">Hackathon stack</Badge>
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.04] tracking-normal text-foreground md:text-7xl">
              AgriHold AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              A fullstack agricultural operating platform for farm holdings,
              predictive crop intelligence, and investable rural supply chains.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/signin">
                Sign in to AgriHold
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton href="/api/health" variant="secondary">
                Check API health
              </LinkButton>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-lg border border-border bg-surface p-4 shadow-sm">
              <div className="rounded-md bg-[linear-gradient(135deg,#dcefd8,#fff7df_48%,#d8edf0)] p-5 text-foreground">
                <div className="flex items-center justify-between">
                  <Sprout className="size-8 text-primary" />
                  <CloudSun className="size-8 text-accent-foreground" />
                </div>
                <div className="mt-20 grid grid-cols-2 gap-3">
                  {metrics.map(([value, label]) => (
                    <div key={label} className="rounded-md bg-white/80 p-4">
                      <p className="text-2xl font-black">{value}</p>
                      <p className="mt-1 text-sm font-medium text-muted">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {capabilities.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="size-5 text-primary" />
                <h2 className="text-lg font-bold">{item.title}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
