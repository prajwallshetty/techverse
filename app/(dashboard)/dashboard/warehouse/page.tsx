import { WarehouseOwnerClient } from "@/features/warehouse/warehouse-owner-client";

export const metadata = {
  title: "Facility Dashboard | AgriHold AI",
};

export default function WarehouseDashboardPage() {
  return (
    <div className="min-h-screen w-full bg-surface">
      <WarehouseOwnerClient />
    </div>
  );
}
