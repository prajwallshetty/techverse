import { auth } from "@/lib/auth";
import {
  Warehouse,
  Package,
  Truck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";

export const metadata = {
  title: "Warehouse Dashboard",
};

const stats = [
  {
    label: "Total Capacity",
    value: "2,400 MT",
    note: "Across 3 warehouses",
    icon: Warehouse,
  },
  {
    label: "Current Stock",
    value: "1,860 MT",
    note: "78% utilization",
    icon: Package,
  },
  {
    label: "Incoming",
    value: "340 MT",
    note: "Expected this week",
    icon: ArrowDownRight,
  },
  {
    label: "Dispatched",
    value: "520 MT",
    note: "This month",
    icon: ArrowUpRight,
  },
];

const inventory = [
  {
    id: "1",
    commodity: "Rice (Sona Masoori)",
    quantity: "780 MT",
    quality: "low" as const,
    qualityLabel: "Grade A",
  },
  {
    id: "2",
    commodity: "Wheat",
    quantity: "450 MT",
    quality: "low" as const,
    qualityLabel: "Grade A",
  },
  {
    id: "3",
    commodity: "Chilli (Guntur)",
    quantity: "320 MT",
    quality: "medium" as const,
    qualityLabel: "Grade B",
  },
  {
    id: "4",
    commodity: "Sugarcane",
    quantity: "310 MT",
    quality: "high" as const,
    qualityLabel: "Pending QC",
  },
];

const recentShipments = [
  {
    id: "SHP-001",
    destination: "Hyderabad APMC",
    commodity: "Rice",
    status: "In Transit",
    eta: "2 days",
  },
  {
    id: "SHP-002",
    destination: "Vijayawada Market",
    commodity: "Chilli",
    status: "Loading",
    eta: "4 days",
  },
  {
    id: "SHP-003",
    destination: "Mumbai Terminal",
    commodity: "Wheat",
    status: "Scheduled",
    eta: "7 days",
  },
];

export default async function WarehouseDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black">
          Welcome back,{" "}
          {session?.user?.name?.split(" ")[0] ?? "Manager"} 🏭
        </h2>
        <p className="mt-1 text-sm text-muted">
          Warehouse operations overview and inventory management.
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

      {/* Inventory + Shipments */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Inventory Overview</h3>
            <p className="text-sm text-muted">
              Current stock levels by commodity.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-semibold text-muted">Commodity</th>
                    <th className="pb-3 font-semibold text-muted">Quantity</th>
                    <th className="pb-3 font-semibold text-muted">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-3 font-medium">{item.commodity}</td>
                      <td className="py-3 font-mono">{item.quantity}</td>
                      <td className="py-3">
                        <Badge intent={item.quality}>
                          {item.qualityLabel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Recent Shipments</h3>
            <p className="text-sm text-muted">Track outbound dispatches.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentShipments.map((s) => (
              <div
                key={s.id}
                className="rounded-md border border-border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{s.commodity}</p>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted">
                    {s.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <Truck className="size-3.5" />
                  <span>{s.destination}</span>
                  <span className="ml-auto">ETA: {s.eta}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
