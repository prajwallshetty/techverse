import { WarehouseDashboard } from "@/features/warehouse/warehouse-dashboard";

export const metadata = {
  title: "Find Warehouses | AgriHold AI",
};

export default function WarehousesPage() {
  return (
    <div className="h-full w-full bg-surface">
      <WarehouseDashboard />
    </div>
  );
}
