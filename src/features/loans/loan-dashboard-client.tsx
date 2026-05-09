"use client";

import { useState, useEffect } from "react";
import { 
  Banknote, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Package, 
  Loader2,
  Calendar,
  ChevronRight,
  TrendingUp,
  History
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { Badge } from "@/components/antigravity/badge";
import { CreditEngine } from "@/lib/loans/credit-engine";
import { useTranslation } from "@/lib/i18n/context";

type Booking = {
  _id: string;
  cropName: string;
  quantityTons: number;
  totalPrice: number;
  warehouseId: { name: string };
  status: string;
};

type Loan = {
  _id: string;
  eligibleAmount: number;
  cropType: string;
  loanStatus: string;
  repaymentStatus: string;
  repaymentDate: string;
  transactionId: string;
  createdAt: string;
};

export function LoanDashboardClient({ initialBookings }: { initialBookings: Booking[] }) {
  const { t } = useTranslation();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [applicationStep, setApplicationStep] = useState<"idle" | "calculating" | "approved" | "success">("idle");
  const [currentOffer, setCurrentOffer] = useState<{ amount: number; crop: string } | null>(null);

  // Filter for confirmed bookings that don't have a loan yet (in a real system we'd track this more strictly)
  const availableBookings = initialBookings.filter(b => b.status === "confirmed");

  const fetchLoans = async () => {
    try {
      const res = await fetch("/api/loans");
      const data = await res.json();
      setLoans(data.loans || []);
    } catch (error) {
      console.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleCheckEligibility = () => {
    const booking = availableBookings.find(b => b._id === selectedBooking);
    if (!booking) return;

    setApplicationStep("calculating");
    
    // Simulate realistic "Smart Credit" assessment
    setTimeout(() => {
      const value = CreditEngine.calculateCropValue(booking.cropName, booking.quantityTons);
      const amount = CreditEngine.estimateLoanAmount(value);
      setCurrentOffer({ amount, crop: booking.cropName });
      setApplicationStep("approved");
    }, 2000);
  };

  const handleClaimLoan = async () => {
    const booking = availableBookings.find(b => b._id === selectedBooking);
    if (!booking || !currentOffer) return;

    setApplicationStep("success");
    
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          cropType: booking.cropName,
          quantity: booking.quantityTons,
        }),
      });

      if (res.ok) {
        fetchLoans();
        // Keep success screen for 3s then reset
        setTimeout(() => {
          setApplicationStep("idle");
          setSelectedBooking("");
          setCurrentOffer(null);
        }, 3500);
      }
    } catch (error) {
      console.error("Payout failed");
    }
  };

  return (
    <div className="space-y-8 px-5 py-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            {t("common.loans.title")} <Badge className="bg-primary/10 text-primary border-none text-[10px]">PRE-APPROVED</Badge>
          </h2>
          <p className="mt-1 text-sm text-muted">{t("common.loans.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-muted/50 p-2 rounded-2xl border border-border/50">
          <div className="p-2 bg-accent/10 rounded-xl text-accent">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted tracking-widest">Collateral Status</p>
            <p className="text-sm font-bold">Securely Verified</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Apply Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-primary/20 shadow-xl shadow-primary/5 bg-gradient-to-br from-surface to-primary/[0.02]">
            <CardContent className="p-0">
              <div className="p-8 border-b border-border/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Zap className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Instant Loan Eligibility</h3>
                    <p className="text-sm text-muted">Select a storage receipt to calculate credit limit.</p>
                  </div>
                </div>

                {applicationStep === "idle" && (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {availableBookings.length === 0 ? (
                        <div className="p-8 text-center bg-surface-muted/30 rounded-2xl border border-dashed border-border">
                          <Package className="size-8 text-muted/40 mx-auto mb-3" />
                          <p className="text-sm font-bold text-muted">No stored crops available for collateral</p>
                          <p className="text-xs text-muted/60 mt-1">Book warehouse space to unlock microloans.</p>
                        </div>
                      ) : (
                        availableBookings.map(b => (
                          <div 
                            key={b._id}
                            onClick={() => setSelectedBooking(b._id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              selectedBooking === b._id 
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                : "border-border/60 hover:border-border hover:bg-surface-muted/20"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                <Package className="size-5" />
                              </div>
                              <div>
                                <p className="font-bold text-sm">{b.quantityTons} MT {b.cropName}</p>
                                <p className="text-xs text-muted">{b.warehouseId.name}</p>
                              </div>
                            </div>
                            <ChevronRight className={`size-5 text-muted transition-transform ${selectedBooking === b._id ? "rotate-90 text-primary" : ""}`} />
                          </div>
                        ))
                      )}
                    </div>
                    <Button 
                      className="w-full py-6 text-base shadow-xl shadow-primary/10" 
                      disabled={!selectedBooking}
                      onClick={handleCheckEligibility}
                    >
                      {t("common.loans.eligibility")} <ArrowRight className="ml-2 size-5" />
                    </Button>
                  </div>
                )}

                {applicationStep === "calculating" && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-pulse">
                    <Loader2 className="size-12 text-primary animate-spin" />
                    <div className="text-center">
                      <p className="text-xl font-black">SmartCredit Engine Assessment</p>
                      <p className="text-sm text-muted mt-1">Evaluating market value and risk profile...</p>
                    </div>
                  </div>
                )}

                {applicationStep === "approved" && currentOffer && (
                  <div className="py-6 space-y-8 animate-in zoom-in-95 duration-300">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center">
                      <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="size-8" />
                      </div>
                      <h4 className="text-2xl font-black text-foreground">Congratulations!</h4>
                      <p className="text-muted text-sm font-medium">You are eligible for instant credit.</p>
                      
                      <div className="mt-8 mb-4">
                        <p className="text-[11px] font-black uppercase text-muted tracking-[0.2em] mb-1">Approved Amount</p>
                        <p className="text-5xl font-black text-primary">₹{currentOffer.amount.toLocaleString()}</p>
                      </div>
                      <Badge intent="medium" className="bg-emerald-500/20 text-emerald-600 border-none px-4 py-1">Instant Payout Available</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-muted/40 rounded-2xl border border-border/50">
                        <p className="text-[10px] font-black uppercase text-muted mb-1 tracking-wider">Interest Rate</p>
                        <p className="text-lg font-bold">12% APY</p>
                      </div>
                      <div className="p-4 bg-surface-muted/40 rounded-2xl border border-border/50">
                        <p className="text-[10px] font-black uppercase text-muted mb-1 tracking-wider">Repayment Period</p>
                        <p className="text-lg font-bold">6 Months</p>
                      </div>
                    </div>

                    <Button className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/10" onClick={handleClaimLoan}>
                      {t("common.loans.claim_payout")} <Banknote className="ml-2 size-6" />
                    </Button>
                  </div>
                )}

                {applicationStep === "success" && currentOffer && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                      <div className="relative size-24 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
                        <Banknote className="size-12 animate-[bounce_1s_infinite]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-foreground">₹{currentOffer.amount.toLocaleString()}</p>
                      <p className="text-lg font-bold text-emerald-500 flex items-center justify-center gap-2 mt-1">
                        Credited Successfully <CheckCircle2 className="size-5" />
                      </p>
                      <p className="text-sm text-muted mt-4 max-w-xs mx-auto">Funds have been disbursed to your linked bank account. Transaction ID generated.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Utility Info Footer */}
              <div className="p-6 bg-surface-muted/30 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <TrendingUp className="size-5 text-muted mx-auto mb-1 opacity-50" />
                  <p className="text-[10px] font-bold text-muted uppercase">Market Driven</p>
                </div>
                <div className="text-center">
                  <ShieldCheck className="size-5 text-muted mx-auto mb-1 opacity-50" />
                  <p className="text-[10px] font-bold text-muted uppercase">Bank Secured</p>
                </div>
                <div className="text-center">
                  <Clock className="size-5 text-muted mx-auto mb-1 opacity-50" />
                  <p className="text-[10px] font-bold text-muted uppercase">6 Month Term</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Stats & History */}
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <TrendingUp className="size-5" />
                </div>
                <h3 className="font-bold text-lg">Financial Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Total Borrowed</span>
                  <span className="font-black">₹{loans.reduce((acc, curr) => acc + curr.eligibleAmount, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Total Collateral Value</span>
                  <span className="font-black text-accent">₹{(loans.reduce((acc, curr) => acc + curr.eligibleAmount, 0) / 0.7).toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">Credit Limit Utilized</span>
                    <span className="text-xs font-bold text-muted">45%</span>
                  </div>
                  <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full w-[45%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black flex items-center gap-2"><History className="size-4" /> History</h3>
              <Button variant="secondary" className="px-2 py-1 text-[10px] h-auto font-black uppercase">All activity</Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="size-6 animate-spin text-muted" /></div>
            ) : loans.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-xs text-muted font-medium">No previous loan activity.</p>
              </div>
            ) : (
              loans.map(loan => (
                <div key={loan._id} className="p-4 rounded-2xl border border-border/60 bg-surface hover:bg-surface-muted/20 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-wider">{loan.cropType} Backed</p>
                      <p className="text-lg font-black leading-none mt-1">₹{loan.eligibleAmount.toLocaleString()}</p>
                    </div>
                    <Badge intent={loan.loanStatus === "active" ? "high" : "low"}>{loan.loanStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1 text-muted font-medium">
                      <Calendar className="size-3" /> {new Date(loan.repaymentDate).toLocaleDateString()}
                    </div>
                    <div className="text-muted font-black truncate max-w-[80px]">#{loan.transactionId.split('-')[1]}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
