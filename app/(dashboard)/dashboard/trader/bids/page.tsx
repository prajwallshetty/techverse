import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db/mongoose";
import { Bid } from "@/models/Bid";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Gavel, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Bids | Trader Dashboard",
};

export default async function TraderBidsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  await dbConnect();
  
  const bids = await Bid.find({ traderId: session.user.id })
    .populate("bookingId", "cropName quantityTons warehouseId")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-6 lg:p-10 pb-32 lg:pb-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Gavel className="size-8 text-primary" /> My Active Bids
        </h2>
        <p className="text-muted mt-2">Track and manage your ongoing market bids.</p>
      </div>

      <div className="grid gap-4">
        {bids.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl bg-surface">
            <Gavel className="size-10 text-muted opacity-20 mx-auto mb-4" />
            <p className="text-sm font-bold text-muted">You haven't placed any bids yet.</p>
            <Link href="/dashboard/trader/marketplace" className="mt-2 text-xs font-black text-primary hover:underline block">Explore Marketplace</Link>
          </div>
        ) : (
          bids.map((bid: any) => (
            <Card key={bid._id} className="border-border/60 bg-surface">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-foreground">{bid.bookingId?.cropName || "Unknown Crop"}</h3>
                  <p className="text-sm text-muted font-medium mt-1">Volume: {bid.bookingId?.quantityTons} MT</p>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest">Your Bid</p>
                    <p className="text-2xl font-black text-primary">₹{bid.amount.toLocaleString()}</p>
                  </div>
                  
                  <Badge 
                    intent={bid.status === "accepted" ? "high" : bid.status === "rejected" ? "low" : "medium"}
                    className="flex items-center gap-1.5 px-3 py-1.5"
                  >
                    {bid.status === "accepted" && <CheckCircle2 className="size-3" />}
                    {bid.status === "rejected" && <XCircle className="size-3" />}
                    {bid.status === "pending" && <Clock className="size-3" />}
                    {bid.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
