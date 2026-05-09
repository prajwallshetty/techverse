import { AdminDashboardClient } from "@/features/admin/admin-dashboard-client";

export const metadata = {
  title: "Platform Admin | AgriHold AI",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen w-full bg-surface">
      <AdminDashboardClient />
    </div>
  );
}
