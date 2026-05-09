import { auth } from "@/lib/auth";
import {
  Sprout,
  Droplets,
  Sun,
  MapPin,
  TrendingUp,
  CloudRain,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";

export const metadata = {
  title: "Farmer Dashboard",
};

const farmStats = [
  {
    label: "Active Plots",
    value: "12",
    note: "Across 3 villages",
    icon: MapPin,
  },
  {
    label: "Crop Health",
    value: "87%",
    note: "Above regional average",
    icon: Sprout,
  },
  {
    label: "Irrigation",
    value: "92%",
    note: "Micro-drip coverage",
    icon: Droplets,
  },
  {
    label: "Season Yield",
    value: "↑ 14%",
    note: "Vs. last kharif",
    icon: TrendingUp,
  },
];

const cropAlerts = [
  {
    id: "1",
    crop: "Paddy",
    status: "low" as const,
    message: "Healthy growth stage — transplanting complete.",
  },
  {
    id: "2",
    crop: "Chilli",
    status: "medium" as const,
    message: "Moderate leaf curl risk detected. Monitor closely.",
  },
  {
    id: "3",
    crop: "Sugarcane",
    status: "high" as const,
    message: "Water stress alert — irrigation deficit for 3 days.",
  },
];

const weatherForecast = [
  { day: "Today", temp: "32°C", condition: "Sunny", icon: Sun },
  { day: "Tomorrow", temp: "29°C", condition: "Cloudy", icon: CloudRain },
  { day: "Wed", temp: "31°C", condition: "Partly Cloudy", icon: Sun },
];

export default async function FarmerDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "Farmer"} 🌾
        </h2>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s your farm overview for this season.
        </p>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {farmStats.map((stat) => (
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

      {/* Bottom grid */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Crop Alerts */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Crop Alerts</h3>
            <p className="text-sm text-muted">
              AI-powered monitoring across your plots.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {cropAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-md border border-border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{alert.crop}</p>
                  <Badge intent={alert.status}>{alert.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {alert.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weather */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Weather Forecast</h3>
            <p className="text-sm text-muted">Local conditions for your region.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherForecast.map((w) => (
              <div
                key={w.day}
                className="flex items-center justify-between rounded-md border border-border bg-surface-muted p-4"
              >
                <div className="flex items-center gap-3">
                  <w.icon className="size-5 text-accent" />
                  <div>
                    <p className="font-semibold">{w.day}</p>
                    <p className="text-xs text-muted">{w.condition}</p>
                  </div>
                </div>
                <p className="text-lg font-black">{w.temp}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
