import { auth } from "@/lib/auth";
import {
  TrendingUp,
  IndianRupee,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";

export const metadata = {
  title: "Trader Dashboard",
};

const stats = [
  {
    label: "Portfolio Value",
    value: "₹4.2 Cr",
    note: "↑ 8.3% this month",
    icon: IndianRupee,
  },
  {
    label: "Active Trades",
    value: "23",
    note: "Across 8 commodities",
    icon: Activity,
  },
  {
    label: "Win Rate",
    value: "78%",
    note: "Last 90 days",
    icon: TrendingUp,
  },
  {
    label: "Monthly P&L",
    value: "+₹18.4L",
    note: "Net realized",
    icon: BarChart3,
  },
];

const marketPrices = [
  {
    commodity: "Rice (Sona Masoori)",
    price: "₹3,450/qt",
    change: "+2.1%",
    up: true,
  },
  {
    commodity: "Wheat",
    price: "₹2,890/qt",
    change: "-0.8%",
    up: false,
  },
  {
    commodity: "Chilli (Guntur S4)",
    price: "₹14,200/qt",
    change: "+5.3%",
    up: true,
  },
  {
    commodity: "Turmeric",
    price: "₹11,800/qt",
    change: "+1.2%",
    up: true,
  },
  {
    commodity: "Cotton",
    price: "₹7,150/qt",
    change: "-1.5%",
    up: false,
  },
];

const activeTrades = [
  {
    id: "TRD-101",
    commodity: "Rice",
    type: "Buy",
    quantity: "50 MT",
    status: "low" as const,
    statusLabel: "Executed",
  },
  {
    id: "TRD-102",
    commodity: "Chilli",
    type: "Sell",
    quantity: "20 MT",
    status: "medium" as const,
    statusLabel: "Pending",
  },
  {
    id: "TRD-103",
    commodity: "Cotton",
    type: "Buy",
    quantity: "30 MT",
    status: "high" as const,
    statusLabel: "At Risk",
  },
];

export default async function TraderDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black">
          Welcome back,{" "}
          {session?.user?.name?.split(" ")[0] ?? "Trader"} 📈
        </h2>
        <p className="mt-1 text-sm text-muted">
          Market intelligence and trade management.
        </p>
      </div>

      {/* Stats */}
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

      {/* Markets + Trades */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Live Market Prices</h3>
            <p className="text-sm text-muted">APMC mandi rates — updated daily.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {marketPrices.map((m) => (
                <div
                  key={m.commodity}
                  className="flex items-center justify-between rounded-md border border-border bg-surface-muted p-3"
                >
                  <p className="font-medium">{m.commodity}</p>
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-sm font-bold">{m.price}</p>
                    <span
                      className={`flex items-center gap-0.5 text-xs font-semibold ${
                        m.up
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {m.up ? (
                        <ArrowUpRight className="size-3" />
                      ) : (
                        <ArrowDownRight className="size-3" />
                      )}
                      {m.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Active Trades</h3>
            <p className="text-sm text-muted">Your open positions.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTrades.map((t) => (
              <div
                key={t.id}
                className="rounded-md border border-border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{t.commodity}</p>
                    <p className="text-xs text-muted">
                      {t.type} · {t.quantity}
                    </p>
                  </div>
                  <Badge intent={t.status}>{t.statusLabel}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
