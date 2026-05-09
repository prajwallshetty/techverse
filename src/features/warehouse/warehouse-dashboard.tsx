"use client";

import { useState, useMemo } from "react";
import { getDistance } from "geolib";
import { WarehouseMap, type MapWarehouse } from "./warehouse-map";
import { BookingModal } from "./booking-modal";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";
import { Search, MapPin, Map, Filter, Package, Star, ArrowRight } from "lucide-react";

// The farmer's assumed location for distance calculations
const FARMER_LOCATION = { latitude: 18.5204, longitude: 73.8567 };

// Mock realistic spatial data
const MOCK_WAREHOUSES: MapWarehouse[] = [
  { id: "w1", name: "AgriSafe Storage Pune", latitude: 18.5590, longitude: 73.7868, capacityTons: 5000, availableCapacity: 1200, pricePerTon: 45 },
  { id: "w2", name: "Deccan Cold Chain", latitude: 18.4636, longitude: 73.8681, capacityTons: 2000, availableCapacity: 450, pricePerTon: 55 },
  { id: "w3", name: "Kisan Godown Co.", latitude: 18.6161, longitude: 73.7420, capacityTons: 10000, availableCapacity: 8000, pricePerTon: 35 },
  { id: "w4", name: "Western Ghats Silos", latitude: 18.4204, longitude: 73.7867, capacityTons: 3000, availableCapacity: 50, pricePerTon: 40 },
  { id: "w5", name: "Premium Fresh Hub", latitude: 18.5804, longitude: 73.9267, capacityTons: 1500, availableCapacity: 600, pricePerTon: 60 },
];

export function WarehouseDashboard() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(false);

  // Add distance calculation and filter logic
  const processedWarehouses = useMemo(() => {
    return MOCK_WAREHOUSES.map((w) => {
      const distanceMeters = getDistance(FARMER_LOCATION, {
        latitude: w.latitude,
        longitude: w.longitude,
      });
      return { ...w, distanceKm: Math.round(distanceMeters / 100) / 10 };
    })
    .filter(w => w.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [search]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row overflow-hidden">
      
      {/* Mobile Map Toggle */}
      <div className="md:hidden p-4 border-b border-border bg-surface flex items-center justify-between z-10">
        <h2 className="text-lg font-black tracking-tight">Find Warehouses</h2>
        <Button variant="secondary" className="px-3 py-1.5 text-xs h-auto" onClick={() => setShowMapMobile(!showMapMobile)}>
          {showMapMobile ? <Filter className="size-4 mr-2" /> : <Map className="size-4 mr-2" />}
          {showMapMobile ? "Show List" : "Map View"}
        </Button>
      </div>

      {/* Left Panel: Sidebar List */}
      <div className={`w-full md:w-[400px] lg:w-[480px] bg-surface flex flex-col border-r border-border shrink-0 transition-transform md:translate-x-0 ${showMapMobile ? "-translate-x-full absolute h-full" : "relative h-full"}`}>
        
        {/* Search Header */}
        <div className="p-5 border-b border-border/60">
          <h2 className="hidden md:block text-2xl font-black tracking-tight mb-4">Find Warehouses</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-muted/50 border border-border/80 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            <Badge className="whitespace-nowrap">Nearest First</Badge>
            <Badge className="whitespace-nowrap bg-transparent hover:bg-surface-muted border-border cursor-pointer">Available Capacity</Badge>
            <Badge className="whitespace-nowrap bg-transparent hover:bg-surface-muted border-border cursor-pointer">Lowest Price</Badge>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {processedWarehouses.map((w) => (
            <div 
              key={w.id} 
              onClick={() => {
                setSelectedId(w.id);
                if (window.innerWidth < 768) setShowMapMobile(true);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedId === w.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                  : "border-border/60 bg-surface hover:border-border hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-foreground text-base tracking-tight">{w.name}</h3>
                <div className="flex items-center gap-1 bg-surface-muted px-2 py-0.5 rounded text-xs font-bold text-foreground">
                  <Star className="size-3 text-accent fill-accent" /> 4.8
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" /> {w.distanceKm} km away
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package className="size-3.5 text-accent" /> {w.availableCapacity} MT avail.
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <span className="text-lg font-black text-foreground">₹{w.pricePerTon}</span>
                  <span className="text-[10px] uppercase font-bold text-muted ml-1">/ MT / Mo</span>
                </div>
                <Button className="px-3 py-1.5 text-xs h-auto" variant={selectedId === w.id ? "primary" : "secondary"}>
                  View <ArrowRight className="size-3 ml-1.5" />
                </Button>
              </div>
            </div>
          ))}
          {processedWarehouses.length === 0 && (
            <div className="text-center py-10">
              <MapPin className="size-10 text-border mx-auto mb-3" />
              <p className="text-muted text-sm">No warehouses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className={`w-full md:flex-1 h-full relative transition-transform md:translate-x-0 ${!showMapMobile ? "translate-x-full absolute md:relative" : "translate-x-0"}`}>
        <WarehouseMap 
          warehouses={processedWarehouses} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
        
        {/* Floating Book Action panel on Desktop when selected */}
        {selectedId && (
          <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[360px]">
            <Card className="shadow-2xl border-primary/20 bg-surface/95 backdrop-blur-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{processedWarehouses.find(w => w.id === selectedId)?.name}</p>
                  <p className="text-xs text-muted mt-0.5">Select dates to calculate final cost</p>
                </div>
                <Button onClick={() => setIsBookingModalOpen(true)}>
                  Book Space
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          warehouse={processedWarehouses.find(w => w.id === selectedId) || null}
          onSuccess={() => {
            setIsBookingModalOpen(false);
            setBookingSuccessMsg(true);
            setTimeout(() => setBookingSuccessMsg(false), 5000);
          }}
        />

        {/* Success Toast Overlay */}
        {bookingSuccessMsg && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-[fadeIn_0.3s_ease]">
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2">
              <Package className="size-5" />
              Space Successfully Booked!
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
