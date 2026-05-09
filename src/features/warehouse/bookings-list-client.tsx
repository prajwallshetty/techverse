"use client";

import { useState } from "react";
import { Package, Clock, CheckCircle2, XCircle, MapPin, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";
import { ReceiptModal } from "./receipt-modal";
import { AutoSellSettings } from "@/features/marketplace/auto-sell-settings";

export function BookingsListClient({ initialBookings }: { initialBookings: any[] }) {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

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
        <p className="mt-1 text-sm text-muted">Manage your reserved warehouse capacity and digital receipts.</p>
      </div>

      <div className="space-y-4">
        {initialBookings.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <Package className="size-10 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold">No bookings yet</p>
            <p className="text-sm text-muted">Book capacity from the interactive map to see it here.</p>
          </div>
        ) : (
          initialBookings.map((booking: any) => (
            <Card key={booking._id} className="border-border/60">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black">{booking.warehouseId?.name || "Unknown Warehouse"}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <MapPin className="size-4 text-primary" /> {booking.warehouseId?.location || "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-8 gap-y-4 bg-surface-muted/30 p-4 rounded-xl border border-border/50 shrink-0">
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
                  </div>

                  <div className="md:border-l border-border/50 md:pl-6 shrink-0 text-right w-full md:w-auto mt-4 md:mt-0 flex flex-col items-end">
                    <p className="text-xs text-muted uppercase font-bold tracking-wider mb-1">Est. Cost</p>
                    <p className="font-black text-primary text-xl mb-3">₹{booking.totalPrice.toLocaleString()}</p>
                    {booking.status === "confirmed" && booking.qrCodeDataUrl && (
                      <Button onClick={() => setSelectedBooking(booking)} className="px-3 py-1.5 text-xs h-auto w-full md:w-auto">
                        <QrCode className="size-4 mr-2" /> View Receipt
                      </Button>
                    )}
                  </div>
                </div>

                {booking.status === "confirmed" && booking.marketplaceStatus === "listed" && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                    <Clock className="size-4 shrink-0 mt-0.5" />
                    <p className="font-medium">
                      Your space is reserved! Please present your Digital Receipt at the warehouse within 48 hours.
                    </p>
                  </div>
                )}

                {booking.status === "confirmed" && booking.marketplaceStatus === "listed" && (
                  <AutoSellSettings 
                    bookingId={booking._id} 
                    initialEnabled={booking.isAutoSellEnabled}
                    initialTarget={booking.autoSellTargetPrice}
                  />
                )}
                
                {booking.marketplaceStatus === "sold" && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 animate-in fade-in zoom-in">
                    <div className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="size-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-emerald-600">Successfully Sold via Auto-Sell!</p>
                      <p className="text-xs text-emerald-600/70 font-medium">Funds are being processed for your {booking.cropName} storage.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ReceiptModal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        booking={selectedBooking} 
      />
    </div>
  );
}
