import { auth } from "@/lib/auth";
import {
  TrendingUp,
  IndianRupee,
  BrainCircuit,
  Wallet,
  Activity,
  ArrowRight,
  Package,
  Sprout,
  CalendarClock
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";
import { PriceChart } from "@/features/dashboard/price-chart";

export const metadata = {
  title: "Farmer Dashboard | AgriHold AI",
};

// Mock data
const chartData = [
  { date: "May 1", historicalPrice: 3100 },
  { date: "May 5", historicalPrice: 3150 },
  { date: "May 10", historicalPrice: 3080 },
  { date: "May 15", historicalPrice: 3200 },
  { date: "May 20", historicalPrice: 3350, predictedPrice: 3350 }, // Present
  { date: "May 25", predictedPrice: 3420 },
  { date: "May 30", predictedPrice: 3580 }, // Peak
  { date: "Jun 4", predictedPrice: 3450 },
  { date: "Jun 9", predictedPrice: 3300 },
];

const storedCrops = [
  { id: "1", name: "Sugarcane", quantity: "45 MT", quality: "high", grade: "Grade A", date: "12 Days ago" },
  { id: "2", name: "Paddy (Rice)", quantity: "18 MT", quality: "medium", grade: "Grade B", date: "30 Days ago" },
];

const liveBids = [
  { id: "B1", trader: "Vikram Traders", crop: "Sugarcane", amount: "₹3,400/qt", expires: "2 hrs", type: "Premium" },
  { id: "B2", trader: "Metro Agri", crop: "Paddy (Rice)", amount: "₹2,100/qt", expires: "14 hrs", type: "Standard" },
];

export default async function FarmerDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8 px-5 py-8 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black md:text-3xl">
            Welcome, {session?.user?.name?.split(" ")[0] ?? "Farmer"} 🌾
          </h2>
          <p className="mt-1 text-sm text-muted font-medium">
            Your market intelligence and portfolio at a glance.
          </p>
        </div>
        <Badge intent="high" className="w-max px-3 py-1.5 text-xs">
          <Activity className="size-3.5 mr-1.5" /> Trust Score: 92/100
        </Badge>
      </div>

      {/* Top KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Current Mandi Price</p>
            <IndianRupee className="size-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black">₹3,350</p>
              <span className="text-xs font-semibold text-emerald-600">/ qt</span>
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="size-3" /> +2.4% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">AI Predicted Peak</p>
            <BrainCircuit className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-primary">₹3,580</p>
              <span className="text-xs font-semibold text-muted">/ qt</span>
            </div>
            <p className="mt-1 text-xs font-medium text-muted">Expected in <span className="font-bold text-foreground">10 days</span></p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-surface-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Expected Profit Inc.</p>
            <TrendingUp className="size-4 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-accent">+₹10,350</p>
            <p className="mt-1 text-xs font-medium text-muted">By waiting to sell Sugarcane</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Loan Eligibility</p>
            <Wallet className="size-4 text-muted" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">₹4.5L</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Against stored inventory</p>
              <span className="text-[10px] font-bold uppercase text-primary hover:underline cursor-pointer">Apply</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Middle Section: Chart & AI Action */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight">Market Trajectory: Sugarcane</h3>
                <p className="text-xs font-medium text-muted mt-1">AI-powered 30-day price forecast</p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">94% Accuracy</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <PriceChart data={chartData} />
          </CardContent>
        </Card>

        {/* AI Action Center */}
        <Card className="shadow-md border-primary/20 bg-gradient-to-b from-surface to-surface-muted/30">
          <CardHeader>
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <BrainCircuit className="size-5 text-primary" /> Action Center
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl bg-primary text-primary-foreground p-5 shadow-lg shadow-primary/20">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Recommendation</p>
              <p className="text-2xl font-black">HOLD INVENTORY</p>
              <p className="text-sm mt-2 opacity-90 leading-relaxed">
                Market deficit predicted due to late monsoons. Prices will surge by ~6.8% next week.
              </p>
              <div className="mt-5 flex items-center gap-2 bg-black/10 rounded-lg p-3">
                <CalendarClock className="size-4" />
                <span className="text-sm font-semibold">Target Sell: May 30</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full justify-between group">
                Enable Auto-Sell at Peak
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="secondary" className="w-full">
                Review Warehouse Costs
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom Section: Inventory & Bids */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Package className="size-5 text-muted" /> Active Stored Crops
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storedCrops.map((crop) => (
                <div key={crop.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-surface-muted/30 transition hover:bg-surface-muted/60">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Sprout className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold">{crop.name}</p>
                      <p className="text-xs text-muted font-medium mt-0.5">Stored {crop.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold">{crop.quantity}</p>
                    <Badge intent={crop.quality as any} className="mt-1 text-[10px]">{crop.grade}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Activity className="size-5 text-muted" /> Live Trader Bids
              </h3>
              <span className="flex size-6 items-center justify-center rounded-full bg-danger/10 text-xs font-bold text-danger">
                2
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveBids.map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-surface transition hover:border-primary/30 hover:shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{bid.trader}</p>
                      {bid.type === "Premium" && (
                        <span className="text-[10px] uppercase font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    <p className="text-xs text-muted font-medium mt-1">For {bid.crop}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-primary">{bid.amount}</p>
                    <p className="text-[10px] font-semibold text-danger mt-0.5">Expires in {bid.expires}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
