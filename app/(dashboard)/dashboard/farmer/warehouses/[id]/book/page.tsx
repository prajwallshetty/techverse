import { VisualBookingGrid } from "@/features/warehouse/visual-booking-grid";

export const metadata = {
  title: "Select Storage Space | AgriHold AI",
};

export default async function VisualBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="bg-surface h-screen overflow-hidden">
      <VisualBookingGrid warehouseId={id} />
    </div>
  );
}
