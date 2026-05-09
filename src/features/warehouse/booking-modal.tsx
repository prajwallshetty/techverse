"use client";

import { useState, useEffect } from "react";
import { X, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/antigravity/button";
import { Input } from "@/components/antigravity/input";
import type { MapWarehouse } from "./warehouse-map-client";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  warehouse: MapWarehouse | null;
  onSuccess: () => void;
};

export function BookingModal({ isOpen, onClose, warehouse, onSuccess }: BookingModalProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer Logic
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(600);
      setCropName("");
      setQuantity("");
      setError(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          alert("Booking session expired. Please try again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen || !warehouse) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpiringSoon = timeLeft < 60;

  const qty = Number(quantity);
  const isQtyValid = qty > 0 && qty <= warehouse.availableCapacity;
  const totalPrice = isQtyValid ? qty * warehouse.pricePerTon : 0;

  const handleBooking = async () => {
    if (!cropName || !isQtyValid) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouseId: warehouse.id,
          cropName,
          quantityTons: qty,
          totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book warehouse.");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <h2 className="text-2xl font-black tracking-tight">Book Capacity</h2>
        <p className="mt-1 text-sm font-medium text-muted">{warehouse.name}</p>

        {/* Expiry Timer */}
        <div className={`mt-4 flex items-center gap-2 rounded-lg border p-3 text-sm font-semibold ${
          isExpiringSoon ? "border-danger/20 bg-danger/10 text-danger" : "border-accent/20 bg-accent/10 text-accent"
        }`}>
          <Clock className="size-4" />
          <span>Session expires in {minutes}:{seconds.toString().padStart(2, "0")}</span>
          <span className="ml-auto text-xs opacity-80">Capacity temporarily held</span>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label="Crop Type"
            placeholder="e.g. Sugarcane, Paddy"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-bold">Quantity (Metric Tons)</label>
              <span className="text-xs font-semibold text-primary">{warehouse.availableCapacity} MT Available</span>
            </div>
            <Input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
              error={qty > warehouse.availableCapacity ? "Exceeds available capacity" : undefined}
            />
          </div>

          <div className="rounded-xl border border-border/60 bg-surface-muted/30 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted">Price per MT</span>
              <span className="font-semibold">₹{warehouse.pricePerTon}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-lg">
              <span className="font-bold">Total Estimated Cost</span>
              <span className="font-black text-primary">₹{totalPrice.toLocaleString()} / mo</span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <Button
            className="w-full h-12 text-base mt-2"
            disabled={!cropName || !isQtyValid || isSubmitting}
            onClick={handleBooking}
          >
            {isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="size-5 mr-2" />
                Confirm Booking
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
