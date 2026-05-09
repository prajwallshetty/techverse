"use client";

import { X, QrCode, ShieldCheck, Download } from "lucide-react";
import { Button } from "@/components/antigravity/button";

type ReceiptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
};

export function ReceiptModal({ isOpen, onClose, booking }: ReceiptModalProps) {
  if (!isOpen || !booking) return null;

  const downloadQR = () => {
    if (!booking.qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.href = booking.qrCodeDataUrl;
    link.download = `Receipt-${booking._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div className="text-center mt-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <QrCode className="size-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Digital Storage Receipt</h2>
          <p className="mt-1 text-xs font-medium text-muted">ID: {booking._id.toString().toUpperCase()}</p>
        </div>

        {/* QR Code Container */}
        <div className="mt-8 mb-6 relative mx-auto w-48 h-48 bg-white p-2 rounded-2xl shadow-inner border border-black/5">
          {booking.qrCodeDataUrl ? (
            <img src={booking.qrCodeDataUrl} alt="QR Code" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm font-medium text-center">
              QR Code Not Available
            </div>
          )}
          
          {/* Scan Overlay Line animation (Optional cool effect) */}
          <div className="absolute inset-x-2 top-0 h-0.5 bg-primary/50 shadow-[0_0_8px_2px_rgba(var(--primary),0.5)] animate-[pulse_2s_ease-in-out_infinite]" style={{ animation: "scan 3s ease-in-out infinite alternate" }} />
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scan {
              0% { top: 8px; }
              100% { top: 184px; }
            }
          `}} />
        </div>

        <div className="space-y-3 rounded-xl bg-surface-muted/30 p-4 border border-border/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted font-medium">Warehouse</span>
            <span className="font-bold text-right max-w-[150px] truncate">{booking.warehouseId?.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted font-medium">Crop Reserved</span>
            <span className="font-bold">{booking.quantityTons} MT {booking.cropName}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-border/40 pt-3">
            <span className="text-muted font-medium">Status</span>
            <span className="font-bold flex items-center text-emerald-500">
              <ShieldCheck className="size-4 mr-1" /> Verified
            </span>
          </div>
        </div>

        <Button className="w-full mt-6" variant="secondary" onClick={downloadQR}>
          <Download className="size-4 mr-2" /> Save to Device
        </Button>
      </div>
    </div>
  );
}
