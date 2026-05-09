import { auth } from "@/lib/auth";
import {
  Users,
  ShieldCheck,
  Activity,
  Server,
  BarChart3,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";

export const metadata = {
  title: "Admin Dashboard",
};

const platformStats = [
  {
    label: "Total Users",
    value: "1,247",
    note: "+84 this month",
    icon: Users,
  },
  {
    label: "Active Sessions",
    value: "342",
    note: "Real-time",
    icon: Activity,
  },
  {
    label: "API Uptime",
    value: "99.97%",
    note: "Last 30 days",
    icon: Server,
  },
  {
    label: "New Signups",
    value: "84",
    note: "This month",
    icon: UserPlus,
  },
];

const userBreakdown = [
  { role: "Farmers", count: 842, percentage: "67.5%", intent: "low" as const },
  {
    role: "Warehouse Owners",
    count: 156,
    percentage: "12.5%",
    intent: "medium" as const,
  },
  { role: "Traders", count: 203, percentage: "16.3%", intent: "medium" as const },
  { role: "Admins", count: 46, percentage: "3.7%", intent: "high" as const },
];

const recentActivity = [
  {
    id: "1",
    action: "New farmer registered",
    user: "Rajesh Kumar",
    time: "2 min ago",
  },
  {
    id: "2",
    action: "Warehouse capacity updated",
    user: "Priya Warehousing",
    time: "15 min ago",
  },
  {
    id: "3",
    action: "Trade executed",
    user: "Vikram Traders",
    time: "1 hr ago",
  },
  {
    id: "4",
    action: "OTP login",
    user: "Anita Devi",
    time: "2 hrs ago",
  },
  {
    id: "5",
    action: "Password reset",
    user: "Suresh Exports",
    time: "3 hrs ago",
  },
];

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black">
          Welcome back,{" "}
          {session?.user?.name?.split(" ")[0] ?? "Admin"} ⚙️
        </h2>
        <p className="mt-1 text-sm text-muted">
          Platform administration and system oversight.
        </p>
      </div>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {platformStats.map((stat) => (
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

      {/* Users + Activity */}
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <h3 className="text-xl font-bold">User Breakdown</h3>
            </div>
            <p className="text-sm text-muted">Users by role across the platform.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {userBreakdown.map((u) => (
              <div
                key={u.role}
                className="flex items-center justify-between rounded-md border border-border p-4"
              >
                <div>
                  <p className="font-semibold">{u.role}</p>
                  <p className="text-xs text-muted">{u.percentage} of total</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-black">{u.count}</p>
                  <Badge intent={u.intent}>{u.role}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <h3 className="text-xl font-bold">Recent Activity</h3>
            </div>
            <p className="text-sm text-muted">Latest platform events.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-md px-3 py-3 transition hover:bg-surface-muted"
                >
                  <div>
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted">{a.user}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
