import { WarehouseDetailClient } from "@/features/warehouse/warehouse-detail-client";

export const metadata = {
  title: "Warehouse Details | AgriHold AI",
};

export default async function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      <WarehouseDetailClient warehouseId={id} />
    </div>
  );
}
