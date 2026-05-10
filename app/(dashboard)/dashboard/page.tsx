import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROLE_DASHBOARD } from "@/types/domain";
import type { UserRole } from "@/types/domain";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardIndexPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  if (!session.user.role) {
    redirect("/onboarding");
  }

  const dashboard =
    ROLE_DASHBOARD[session.user.role as UserRole] ?? "/dashboard/farmer";
  redirect(dashboard);
}
