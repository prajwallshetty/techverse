import { auth } from "@/lib/auth";
import { Booking } from "@/models/Booking";
import dbConnect from "@/lib/db/mongoose";
import { Package, Clock, CheckCircle2, XCircle, MapPin } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Bookings | AgriHold AI",
};

export default async function BookingsHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  await dbConnect();

  const bookings = await Booking.find({ farmerId: session.user.id })
    .populate("warehouseId", "name location pricePerTon")
    .sort({ createdAt: -1 })
    .lean();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge intent="high"><CheckCircle2 className="size-3 mr-1" /> Confirmed</Badge>;
      case "completed":
        return <Badge intent="medium">Completed</Badge>;
      case "cancelled":
      case "expired":
        return <Badge intent="low"><XCircle className="size-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge intent="low"><Clock className="size-3 mr-1" /> {status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black md:text-3xl">Booking History</h2>
        <p className="mt-1 text-sm text-muted">Manage your reserved warehouse capacity.</p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <Package className="size-10 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold">No bookings yet</p>
            <p className="text-sm text-muted">Book capacity from the interactive map to see it here.</p>
          </div>
        ) : (
          bookings.map((booking: any) => (
            <Card key={booking._id.toString()} className="border-border/60">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black">{booking.warehouseId?.name || "Unknown Warehouse"}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <MapPin className="size-4 text-primary" /> {booking.warehouseId?.location || "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-8 gap-y-4 bg-surface-muted/30 p-4 rounded-xl border border-border/50">
                    <div>
                      <p className="text-xs text-muted uppercase font-bold tracking-wider mb-1">Crop</p>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Package className="size-4 text-accent" /> {booking.cropName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase font-bold tracking-wider mb-1">Reserved</p>
                      <p className="font-mono font-bold text-foreground">{booking.quantityTons} MT</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase font-bold tracking-wider mb-1">Est. Cost</p>
                      <p className="font-black text-primary">₹{booking.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                </div>

                {booking.status === "confirmed" && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                    <Clock className="size-4 shrink-0 mt-0.5" />
                    <p className="font-medium">
                      Your space is reserved! Please drop off your crops within 48 hours to prevent cancellation.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
