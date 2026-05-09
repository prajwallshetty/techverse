import { Loader2 } from "lucide-react";

export default function FarmerDashboardLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-5 py-20 text-center animate-[fadeIn_0.3s_ease]">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-24 rounded-full bg-primary/10 animate-pulse" />
        <div className="absolute size-16 rounded-full bg-primary/20 animate-pulse delay-75" />
        <Loader2 className="size-8 animate-spin text-primary relative z-10" />
      </div>
      <h2 className="mt-8 text-xl font-black tracking-tight text-foreground">
        Loading Intelligence
      </h2>
      <p className="mt-2 text-sm font-medium text-muted max-w-[280px]">
        Fetching real-time mandi prices and calculating AI projections...
      </p>
    </div>
  );
}
