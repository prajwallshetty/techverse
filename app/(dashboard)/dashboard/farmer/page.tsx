import { auth } from "@/lib/auth";
import { FarmerDashboardClient } from "@/features/farmer/farmer-dashboard-client";

export const metadata = {
  title: "Farmer Dashboard | AgriHold AI",
};

export default async function FarmerDashboardPage() {
  const session = await auth();
  
  return (
    <div className="min-h-screen bg-surface">
      <FarmerDashboardClient sessionUser={session?.user} />
    </div>
  );
}
