import { auth } from "@/lib/auth";
import { TraderDashboardClient } from "@/features/trader/trader-dashboard-client";

export const metadata = {
  title: "Trader Dashboard | AgriHold AI",
};

export default async function TraderDashboardPage() {
  const session = await auth();
  
  return (
    <div className="min-h-screen bg-surface">
      <TraderDashboardClient sessionUser={session?.user} />
    </div>
  );
}
