"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/antigravity/button";
import { useTranslation } from "@/lib/i18n/context";

export function AutoSellSettings({ 
  bookingId, 
  initialEnabled, 
  initialTarget 
}: { 
  bookingId: string; 
  initialEnabled: boolean; 
  initialTarget?: number;
}) {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [targetPrice, setTargetPrice] = useState<number | "">(initialTarget || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace/auto-sell", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          isAutoSellEnabled: isEnabled,
          autoSellTargetPrice: targetPrice === "" ? undefined : Number(targetPrice),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Failed to update auto-sell settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-end gap-4 bg-surface-muted/20 p-4 rounded-xl border border-border/40 mt-4">
      <div className="flex-1">
        <label className="text-[10px] font-black uppercase text-muted mb-2 block tracking-widest flex items-center gap-1.5">
          <Zap className={`size-3 ${isEnabled ? "text-primary fill-primary" : ""}`} /> 
          {isEnabled ? t('dashboard.marketplace.auto_sell.smart_active') : t('dashboard.marketplace.auto_sell.smart_disabled')}
        </label>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEnabled(!isEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isEnabled ? "bg-primary" : "bg-surface-muted"
            }`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isEnabled ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
          
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">₹</span>
            <input 
              type="number"
              placeholder={t('dashboard.marketplace.auto_sell.target_price')} 
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={!isEnabled}
              className="w-full bg-surface border border-border/60 rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <Button 
        variant={isEnabled ? "primary" : "secondary"} 
        className="h-9 px-4 text-[10px] font-black uppercase shrink-0"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? <Loader2 className="size-3 animate-spin" /> : (
          success ? <CheckCircle2 className="size-3" /> : t('dashboard.marketplace.auto_sell.save_logic')
        )}
      </Button>
    </div>
  );
}
