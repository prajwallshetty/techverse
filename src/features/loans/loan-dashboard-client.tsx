"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IndianRupee, ShieldCheck, Banknote, Clock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import { Input } from "@/components/antigravity/input";
import type { DecentroEligibilityResult } from "@/lib/decentro";

type LoanDashboardProps = {
  eligibility: DecentroEligibilityResult & { totalCollateralValue: number };
  loans: any[];
};

export function LoanDashboardClient({ eligibility, loans }: LoanDashboardProps) {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxAmount = eligibility.maxEligibleAmount;
  const reqAmountNum = Number(requestedAmount);
  const isValidAmount = reqAmountNum >= 5000 && reqAmountNum <= maxAmount;

  const handleApply = async () => {
    if (!isValidAmount) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: reqAmountNum,
          totalCollateralValue: eligibility.totalCollateralValue,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsApplying(false);
      setRequestedAmount("");
      router.refresh(); // Refresh the server component to load new loans
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge intent="high"><CheckCircle2 className="size-3 mr-1" /> Active</Badge>;
      case "approved":
        return <Badge intent="medium"><ShieldCheck className="size-3 mr-1" /> Approved</Badge>;
      case "applied":
        return <Badge intent="low"><Clock className="size-3 mr-1" /> Processing</Badge>;
      default:
        return <Badge intent="low">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black md:text-3xl">Microloans</h2>
        <p className="mt-1 text-sm text-muted">Leverage your stored crops for instant liquidity via Decentro.</p>
      </div>

      {/* Dynamic Eligibility Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-8 border shadow-lg ${
        eligibility.isEligible 
          ? "bg-gradient-to-br from-primary/10 via-surface to-primary/5 border-primary/20" 
          : "bg-surface border-border/60"
      }`}>
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Banknote className="size-32 text-primary" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-muted">
              <ShieldCheck className="size-4 text-emerald-500" />
              Powered by Decentro Risk Engine
            </div>
            
            {eligibility.isEligible ? (
              <>
                <h3 className="text-3xl font-black tracking-tight text-foreground">
                  Eligible for <span className="text-primary">₹{maxAmount.toLocaleString()}</span> instant loan.
                </h3>
                <p className="mt-2 text-sm font-medium text-muted max-w-lg">
                  Based on your physically stored warehouse collateral valued at ₹{eligibility.totalCollateralValue.toLocaleString()}, you are pre-approved for an instant line of credit at {eligibility.interestRate}% APY.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-black tracking-tight">Not currently eligible for a loan.</h3>
                <p className="mt-2 text-sm font-medium text-muted max-w-md">
                  {eligibility.message} Store more crops in our certified warehouses to unlock instant capital.
                </p>
              </>
            )}
          </div>

          {eligibility.isEligible && (
            <Button 
              className="w-full md:w-auto shrink-0 shadow-xl shadow-primary/20 px-8 py-3 h-auto"
              onClick={() => setIsApplying(true)}
            >
              Get Capital Now <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <h2 className="text-2xl font-black tracking-tight">Request Loan</h2>
            <p className="mt-1 text-sm font-medium text-muted mb-6">Instantly disbursed to your registered bank account.</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <label>Loan Amount (INR)</label>
                  <span className="text-primary">Max: ₹{maxAmount.toLocaleString()}</span>
                </div>
                <Input 
                  type="number" 
                  placeholder="Min. ₹5,000"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  error={reqAmountNum > maxAmount ? "Exceeds eligible limit" : reqAmountNum !== 0 && reqAmountNum < 5000 ? "Minimum ₹5,000" : undefined}
                />
              </div>

              <div className="rounded-xl border border-border/60 bg-surface-muted/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-muted">Interest Rate (APY)</span>
                  <span className="font-semibold">{eligibility.interestRate}%</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-sm">
                  <span className="font-medium text-muted">Collateral Locked</span>
                  <span className="font-semibold">₹{eligibility.totalCollateralValue.toLocaleString()}</span>
                </div>
              </div>

              {error && <p className="text-sm font-bold text-danger">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setIsApplying(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleApply} disabled={!isValidAmount || isSubmitting}>
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan History / Active Loans */}
      <div className="mt-10">
        <h3 className="text-xl font-black mb-4">Your Loans</h3>
        {loans.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Banknote className="size-10 text-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted">You have no active or past loans.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {loans.map((loan) => (
              <Card key={loan._id} className="border-border/60">
                <CardContent className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          <IndianRupee className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted uppercase tracking-wider">Principal</p>
                          <p className="text-lg font-black leading-none">₹{loan.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      {getStatusBadge(loan.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 bg-surface-muted/30 p-3 rounded-lg border border-border/50">
                      <div>
                        <p className="text-[11px] font-bold text-muted uppercase">Interest</p>
                        <p className="font-semibold text-sm">{loan.interestRate}% APY</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-muted uppercase">Collateral</p>
                        <p className="font-semibold text-sm">Crop Backed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
