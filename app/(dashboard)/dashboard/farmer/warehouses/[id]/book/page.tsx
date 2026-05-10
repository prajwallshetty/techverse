import { FarmerBookingForm } from "@/features/farmer/farmer-booking-form";

export const metadata = {
  title: "Select Storage Space | AgriHold AI",
};

export default async function VisualBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="bg-surface min-h-screen">
      <FarmerBookingForm warehouseId={id} />
    </div>
  );
}
