"use client";

import { useState } from "react";
import { QrCode, ScanLine, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Input } from "@/components/antigravity/input";
import { Button } from "@/components/antigravity/button";

export default function WarehouseVerificationPage() {
  const [scannedData, setScannedData] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  // Simulated Verification Logic (In production, this would call a secure API endpoint)
  const handleVerify = async () => {
    if (!scannedData) return;
    setIsVerifying(true);
    setResult(null);

    // Simulate API network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // In a real scenario, the scannedData would be the JSON from the QR code.
      // We simulate a parse check here.
      if (scannedData.includes("bookingId") || scannedData.length > 10) {
        setResult("success");
      } else {
        throw new Error("Invalid QR Signature");
      }
    } catch (err) {
      setResult("error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 bg-surface-muted/30">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-sm">
          <ScanLine className="size-8" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Verify Drop-off</h1>
        <p className="text-muted text-sm mb-8">
          Scan the farmer&apos;s Digital Storage Receipt QR code to authenticate their booking and accept inventory.
        </p>

        <Card className="border-border/60 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
          <CardContent className="p-8">
            {/* Simulated Camera View */}
            <div className="relative mx-auto w-48 h-48 border-2 border-dashed border-primary/40 rounded-xl mb-6 flex flex-col items-center justify-center bg-surface">
              <QrCode className="size-10 text-muted/30 mb-2" />
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Camera Feed</p>
              
              {/* Scanning Animation line */}
              <div className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] opacity-50 animate-[scan_2s_ease-in-out_infinite]" />
            </div>

            <div className="space-y-4 text-left">
              <Input 
                label="Manual Override (Booking ID or JSON)"
                placeholder="Paste scanned payload..."
                value={scannedData}
                onChange={(e) => setScannedData(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={handleVerify}
                disabled={!scannedData || isVerifying}
              >
                {isVerifying ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <ScanLine className="size-4 mr-2" />
                )}
                Verify Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Toast Overlay */}
        {result === "success" && (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 animate-[fadeIn_0.3s_ease]">
            <CheckCircle2 className="size-6" />
            <div className="text-left">
              <p className="font-bold text-sm">Receipt Verified</p>
              <p className="text-xs opacity-80">Booking authenticated. You may now accept the inventory.</p>
            </div>
          </div>
        )}

        {result === "error" && (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-danger/10 border border-danger/20 p-4 text-danger animate-[fadeIn_0.3s_ease]">
            <AlertTriangle className="size-6" />
            <div className="text-left">
              <p className="font-bold text-sm">Verification Failed</p>
              <p className="text-xs opacity-80">Invalid or expired QR code. Do not accept inventory.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
