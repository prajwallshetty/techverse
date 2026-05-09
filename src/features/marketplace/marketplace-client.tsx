"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Package, 
  ChevronRight, 
  ArrowUpRight, 
  History,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  IndianRupee
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import { Input } from "@/components/antigravity/input";
import { pusherClient } from "@/lib/pusher/client";

export function MarketplaceClient() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchListings();

    // Subscribe to global updates (for bid counts on cards)
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
      // 1. Update highest bid in the listings grid
      setListings((prev) => 
        prev.map(l => l._id === selectedListing._id ? { ...l, highestBid: Math.max(l.highestBid, data.amount) } : l)
      );

      // 2. Add to local bid history in the sidebar
      setBidHistory((prev) => {
        if (prev.find(b => b._id === data._id)) return prev;
        return [data, ...prev].sort((a, b) => b.amount - a.amount);
      });
    });

    return () => {
      pusherClient.unsubscribe(`marketplace-${selectedListing._id}`);
    };
  }, [selectedListing]);

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
    setBidAmount("");
    setError(null);
    setSuccess(false);
    fetchBidHistory(listing._id);
  };

  const handlePlaceBid = async () => {
    if (!selectedListing || !bidAmount) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/marketplace/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedListing._id,
          amount: Number(bidAmount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      fetchListings();
      fetchBidHistory(selectedListing._id);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-surface">
      
      {/* Left: Main Marketplace Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header & Filters */}
        <div className="p-6 border-b border-border/60 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Crop Marketplace</h2>
              <p className="text-sm text-muted">Direct trade between farmers and verified traders.</p>
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

        {/* Scrollable Grid */}
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
                  <CardContent className="p-0 overflow-hidden">
                    {/* Visual Header */}
                    <div className="h-32 bg-gradient-to-br from-primary/5 to-accent/5 p-5 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Package className="size-32" />
                      </div>
                      <Badge className="mb-2 bg-white/80 backdrop-blur-sm text-primary border-none">{listing.cropName}</Badge>
                      <h3 className="text-xl font-black">{listing.quantityTons} MT Reserved</h3>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-muted font-medium">
                          <MapPin className="size-4 text-primary" /> {listing.warehouseId?.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-accent font-bold">
                          <TrendingUp className="size-4" /> {listing.bidCount} Bids
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/40 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted tracking-wider mb-0.5">Current Highest Bid</p>
                          <p className="text-2xl font-black text-primary">₹{listing.highestBid.toLocaleString() || "---"}</p>
                        </div>
                        <Button variant="secondary" className="px-2 py-1 h-auto text-[10px] font-black uppercase">
                          Details <ArrowUpRight className="size-3 ml-1" />
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

      {/* Right: Bidding Sidebar (Conditional) */}
      <div className={`w-full lg:w-[400px] border-l border-border bg-surface-muted/10 h-full flex flex-col transition-all duration-300 ${
        selectedListing ? "translate-x-0" : "translate-x-full absolute right-0"
      }`}>
        {selectedListing && (
          <>
            <div className="p-6 border-b border-border/60 flex items-center justify-between">
              <h3 className="font-black text-lg">Place a Bid</h3>
              <button onClick={() => setSelectedListing(null)} className="p-2 hover:bg-surface-muted rounded-full transition-colors">
                <X className="size-5 text-muted" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Summary Card */}
              <div className="bg-surface border border-border/60 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-4">Market Summary</p>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Crop Unit</span>
                    <span className="text-sm font-bold">{selectedListing.cropName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Total Tonnage</span>
                    <span className="text-sm font-bold">{selectedListing.quantityTons} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Storage Facility</span>
                    <span className="text-sm font-bold text-right truncate max-w-[150px]">{selectedListing.warehouseId?.name}</span>
                  </div>
                </div>
              </div>

              {/* Bidding Input */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-black mb-2 block uppercase tracking-wider text-muted">Your Bid per MT (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input 
                      type="number"
                      placeholder={selectedListing.highestBid ? `Above ₹${selectedListing.highestBid}` : "Enter bid amount"}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-surface border-2 border-border/60 rounded-xl pl-9 pr-4 py-3 text-lg font-black focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  {error && <p className="mt-2 text-xs font-bold text-danger flex items-center gap-1"><AlertCircle className="size-3" /> {error}</p>}
                </div>

                <Button 
                  className="w-full py-6 text-lg shadow-xl shadow-primary/20"
                  disabled={!bidAmount || isSubmitting}
                  onClick={handlePlaceBid}
                >
                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : (
                    success ? <CheckCircle2 className="size-5" /> : "Confirm Bid"
                  )}
                </Button>
              </div>

              {/* Bid History Timeline */}
              <div className="space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest text-muted flex items-center gap-2">
                  <History className="size-4" /> Recent Bids
                </h4>
                <div className="space-y-3">
                  {bidHistory.length === 0 ? (
                    <p className="text-xs text-muted/60 italic p-4 text-center border border-dashed border-border rounded-xl">No bids placed yet. Be the first!</p>
                  ) : (
                    bidHistory.map((bid, i) => (
                      <div key={bid._id} className={`flex items-center justify-between p-3 rounded-xl border ${
                        i === 0 ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" : "bg-surface border-border/40"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            i === 0 ? "bg-primary text-white" : "bg-surface-muted text-muted"
                          }`}>
                            {bid.traderId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{bid.traderId?.name}</p>
                            <p className="text-[10px] text-muted">{new Date(bid.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-sm ${i === 0 ? "text-primary" : "text-foreground"}`}>₹{bid.amount.toLocaleString()}</p>
                          {i === 0 && <Badge className="text-[8px] px-1 py-0 h-auto">HIGHEST</Badge>}
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
