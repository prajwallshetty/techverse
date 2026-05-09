import { WarehouseGallery } from "@/features/warehouse/warehouse-gallery";

export const metadata = {
  title: "Browse Warehouses | AgriHold AI",
};

export default function WarehouseBrowsePage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">Premium Storage Network</h1>
        <p className="text-muted text-lg mt-2 font-medium">Discover and book verified storage space with real-time occupancy tracking.</p>
      </div>
      <WarehouseGallery />
    </div>
  );
}
