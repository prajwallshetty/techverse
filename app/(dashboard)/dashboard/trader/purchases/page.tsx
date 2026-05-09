import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db/mongoose";
import { Bid } from "@/models/Bid";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { ShoppingCart, CheckCircle2, Truck, Package } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Purchases | Trader Dashboard",
};

export default async function TraderPurchasesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  await dbConnect();
  
  // A purchase is a bid that has been "accepted"
  const purchases = await Bid.find({ traderId: session.user.id, status: "accepted" })
    .populate("bookingId", "cropName quantityTons warehouseId totalPrice marketplaceStatus")
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black flex items-center gap-3">
          <ShoppingCart className="size-8 text-primary" /> My Purchases
        </h2>
        <p className="text-muted mt-2">View your successfully acquired commodities and tracking status.</p>
      </div>

      <div className="grid gap-4">
        {purchases.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl bg-surface">
            <Package className="size-10 text-muted opacity-20 mx-auto mb-4" />
            <p className="text-sm font-bold text-muted">You haven't won any auctions yet.</p>
            <Link href="/dashboard/trader/marketplace" className="mt-2 text-xs font-black text-primary hover:underline block">Explore Marketplace</Link>
          </div>
        ) : (
          purchases.map((purchase: any) => (
            <Card key={purchase._id} className="border-emerald-500/30 bg-surface relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-0"></div>
              
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-foreground">{purchase.bookingId?.cropName || "Unknown Crop"}</h3>
                    <Badge className="bg-emerald-500 text-white border-none"><CheckCircle2 className="size-3 mr-1" /> WON</Badge>
                  </div>
                  <p className="text-sm text-muted font-medium mt-1">Volume: {purchase.bookingId?.quantityTons} MT</p>
                  <p className="text-xs text-muted mt-1">Acquired on: {new Date(purchase.updatedAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest">Final Price</p>
                    <p className="text-2xl font-black text-emerald-600">₹{purchase.amount.toLocaleString()}</p>
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border/60 rounded-xl hover:bg-surface-muted transition-colors font-bold text-sm text-foreground">
                    <Truck className="size-4" /> Track Shipment
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
