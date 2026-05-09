"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Package, 
  ArrowUpRight, 
  History,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Zap,
  Bell
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import { pusherClient } from "@/lib/pusher/client";
import { useTranslation } from "@/lib/i18n/context";

// Countdown Timer Component
function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const end = new Date(endsAt).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("EXPIRED");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <div className={`flex items-center gap-1.5 font-bold text-xs ${timeLeft === 'EXPIRED' ? 'text-danger' : 'text-amber-500'}`}>
      <Clock className="size-3" /> {timeLeft}
    </div>
  );
}

export function MarketplaceClient({ sessionUser }: { sessionUser?: any }) {
  const { t } = useTranslation();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [maxAutoBid, setMaxAutoBid] = useState<number | "">("");
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/marketplace?location=${search}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();

    const channel = pusherClient.subscribe("marketplace-global");
    channel.bind("bid-count-update", (data: { bookingId: string }) => {
      setListings((prev) => 
        prev.map(l => l._id === data.bookingId ? { ...l, bidCount: (l.bidCount || 0) + 1 } : l)
      );
    });

    return () => {
      pusherClient.unsubscribe("marketplace-global");
    };
  }, [search]);

  // Handle Real-time Bid Updates for selected listing
  useEffect(() => {
    if (!selectedListing) return;

    const channel = pusherClient.subscribe(`marketplace-${selectedListing._id}`);
    
    channel.bind("new-bid", (data: any) => {
      setListings((prev) => 
        prev.map(l => l._id === selectedListing._id ? { ...l, highestBid: Math.max(l.highestBid, data.amount) } : l)
      );
      setBidHistory((prev) => {
        if (prev.find(b => b._id === data._id)) return prev;
        return [data, ...prev].sort((a, b) => b.amount - a.amount);
      });
    });

    channel.bind("auto-sold", (data: any) => {
       addToast(`Listing sold automatically at ₹${data.amount}!`, "info");
       fetchListings();
    });

    return () => {
      pusherClient.unsubscribe(`marketplace-${selectedListing._id}`);
    };
  }, [selectedListing]);

  // Listen for outbid alerts
  useEffect(() => {
    if (!sessionUser?.id) return;
    const channel = pusherClient.subscribe(`trader-${sessionUser.id}`);
    channel.bind("outbid-alert", (data: any) => {
      addToast(`You were outbid on ${data.cropName}! New bid: ₹${data.newAmount}`, "error");
    });
    return () => {
      pusherClient.unsubscribe(`trader-${sessionUser.id}`);
    }
  }, [sessionUser?.id]);

  const fetchBidHistory = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/marketplace/bid?bookingId=${bookingId}`);
      const data = await res.json();
      setBidHistory(data.bids || []);
    } catch (err) {
      console.error("Failed to fetch bid history");
    }
  };

  const handleSelectListing = (listing: any) => {
    setSelectedListing(listing);
    setBidAmount(listing.highestBid ? listing.highestBid + 50 : listing.startingBid || 100);
    setMaxAutoBid("");
    setIsAutoBidEnabled(false);
    setError(null);
    setSuccess(false);
    fetchBidHistory(listing._id);
  };

  const handlePlaceBid = async () => {
    if (!selectedListing || !bidAmount) return;
    setIsSubmitting(true);
    setError(null);

    const payload: any = {
      bookingId: selectedListing._id,
      amount: Number(bidAmount),
    };

    if (isAutoBidEnabled && maxAutoBid) {
      payload.maxAutoBid = Number(maxAutoBid);
    }

    try {
      const res = await fetch("/api/marketplace/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      addToast("Bid placed successfully!", "success");
      fetchListings();
      fetchBidHistory(selectedListing._id);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-surface relative">
      
      {/* Toast Container */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-bold border ${
            t.type === 'error' ? 'bg-danger/10 text-danger border-danger/20' :
            t.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
            'bg-surface border-border text-foreground'
          }`}>
            <Bell className="size-4" />
            {t.message}
          </div>
        ))}
      </div>

      {/* Left: Main Marketplace Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <div className="p-6 border-b border-border/60 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">{t("common.marketplace.title")}</h2>
              <p className="text-sm text-muted">{t("common.marketplace.subtitle")}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input 
                  type="text" 
                  placeholder="Filter by location..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-surface-muted/50 border border-border/80 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button variant="secondary" className="px-3"><Filter className="size-4" /></Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl">
              <Package className="size-12 text-muted/40 mx-auto mb-4" />
              <p className="text-lg font-bold text-muted">No listings found</p>
              <p className="text-sm text-muted/60">Try adjusting your filters or location search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card 
                  key={listing._id}
                  onClick={() => handleSelectListing(listing)}
                  className={`cursor-pointer transition-all hover:shadow-xl hover:translate-y-[-4px] border-border/60 ${
                    selectedListing?._id === listing._id ? "ring-2 ring-primary border-transparent" : ""
                  }`}
                >
                  <CardContent className="p-0 overflow-hidden relative">
                    <div className="h-32 bg-gradient-to-br from-primary/5 to-accent/5 p-5 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                         <Package className="size-32" />
                      </div>
                      <div className="flex justify-between items-start relative z-10">
                        <Badge className="bg-white/80 backdrop-blur-sm text-primary border-none font-black">{listing.cropName}</Badge>
                        {listing.auctionEndsAt && (
                          <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                            <CountdownTimer endsAt={listing.auctionEndsAt} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-black mt-2 relative z-10">{listing.quantityTons} MT Reserved</h3>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-muted font-medium">
                          <MapPin className="size-4 text-primary" /> {listing.warehouseId?.location || "Local Warehouse"}
                        </div>
                        <div className="flex items-center gap-1.5 text-accent font-bold">
                          <TrendingUp className="size-4" /> {listing.bidCount || 0} Bids
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/40 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted tracking-wider mb-0.5">{t("common.marketplace.highest_bid")}</p>
                          <p className="text-2xl font-black text-primary">₹{listing.highestBid?.toLocaleString() || listing.startingBid?.toLocaleString() || "---"}</p>
                        </div>
                        <Button variant="secondary" className="px-2 py-1 h-auto text-[10px] font-black uppercase">
                          Bid Now <ArrowUpRight className="size-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Bidding Sidebar */}
      <div className={`w-full lg:w-[400px] border-l border-border bg-surface-muted/10 h-full flex flex-col transition-transform duration-300 ${
        selectedListing ? "translate-x-0" : "translate-x-full absolute right-0"
      }`}>
        {selectedListing && (
          <>
            <div className="p-6 border-b border-border/60 flex items-center justify-between bg-surface sticky top-0 z-10">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Zap className="size-5 text-amber-500" /> Auction Arena
              </h3>
              <button onClick={() => setSelectedListing(null)} className="p-2 hover:bg-surface-muted rounded-full transition-colors">
                <X className="size-5 text-muted" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
              <div className="bg-surface border border-border/60 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Market Summary</p>
                   {selectedListing.auctionEndsAt && <CountdownTimer endsAt={selectedListing.auctionEndsAt} />}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Commodity</span>
                    <span className="text-sm font-bold">{selectedListing.cropName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Volume</span>
                    <span className="text-sm font-bold">{selectedListing.quantityTons} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Current Market Price</span>
                    <span className="text-sm font-bold text-emerald-600">₹{selectedListing.basePrice?.toLocaleString() || "---"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-surface p-5 rounded-2xl border border-border shadow-sm">
                <div>
                  <label className="text-xs font-black mb-2 block uppercase tracking-wider text-muted">Standard Bid (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input 
                      type="number"
                      placeholder={`Min ₹${(selectedListing.highestBid || selectedListing.startingBid || 0) + 1}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-surface-muted/30 border-2 border-border/60 rounded-xl pl-9 pr-4 py-3 text-lg font-black focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Auto Bid Toggle */}
                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase tracking-wider text-muted flex items-center gap-1">
                      <Zap className="size-3 text-amber-500" /> Enable Auto-Bid
                    </label>
                    <input 
                      type="checkbox" 
                      checked={isAutoBidEnabled}
                      onChange={(e) => setIsAutoBidEnabled(e.target.checked)}
                      className="w-4 h-4 text-primary rounded border-border"
                    />
                  </div>
                  
                  {isAutoBidEnabled && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                        <input 
                          type="number"
                          placeholder="Maximum limit to auto-bid"
                          value={maxAutoBid}
                          onChange={(e) => setMaxAutoBid(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full bg-amber-500/5 border-2 border-amber-500/30 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-sm font-bold transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-muted mt-2 font-medium">We'll automatically bid up to this limit to keep you in the lead.</p>
                    </div>
                  )}
                </div>

                {error && <p className="text-xs font-bold text-danger flex items-center gap-1 bg-danger/5 p-2 rounded-lg"><AlertCircle className="size-3" /> {error}</p>}

                <Button 
                  className="w-full py-6 text-lg shadow-xl shadow-primary/20 mt-4"
                  disabled={!bidAmount || isSubmitting}
                  onClick={handlePlaceBid}
                >
                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : (
                    success ? <CheckCircle2 className="size-5" /> : t("common.marketplace.confirm_bid")
                  )}
                </Button>
              </div>

              {/* Bid History Timeline */}
              <div className="space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest text-muted flex items-center gap-2">
                  <History className="size-4" /> Live Bid History
                </h4>
                <div className="space-y-3">
                  {bidHistory.length === 0 ? (
                    <p className="text-xs text-muted/60 italic p-4 text-center border border-dashed border-border rounded-xl">No bids placed yet. Be the first!</p>
                  ) : (
                    bidHistory.map((bid, i) => (
                      <div key={bid._id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        i === 0 ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" : "bg-surface border-border/40 opacity-70"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            i === 0 ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-surface-muted text-muted"
                          }`}>
                            {bid.traderId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground flex items-center gap-2">
                              {bid.traderId?.name}
                              {bid.maxAutoBid && <Zap className="size-3 text-amber-500" title="Auto-Bid Active" />}
                            </p>
                            <p className="text-[10px] text-muted">{new Date(bid.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-sm ${i === 0 ? "text-primary text-base" : "text-foreground"}`}>₹{bid.amount.toLocaleString()}</p>
                          {i === 0 && <Badge className="text-[8px] px-1.5 py-0.5 h-auto bg-primary text-white border-none mt-1">WINNING</Badge>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
