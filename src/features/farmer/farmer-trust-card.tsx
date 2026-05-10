"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Award, 
  ChevronRight, 
  Info,
  Flame,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";

export function FarmerTrustCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetch("/api/farmer/trust-score")
      .then(res => res.json())
      .then(d => {
        if (!d.error) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Card className="border-border/40 bg-surface rounded-[2.5rem] overflow-hidden">
      <CardContent className="p-10 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Loader2 className="size-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted animate-pulse">Syncing Trust Metrics...</p>
      </CardContent>
    </Card>
  );

  if (!data) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum": return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
      case "Gold": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Silver": return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      default: return "text-orange-700 bg-orange-700/10 border-orange-700/20";
    }
  };

  return (
    <Card className="border-border/40 bg-surface rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5 group">
      <CardContent className="p-0">
        {/* Main Card View */}
        <div className="p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {/* Radial Score Gauge */}
              <div className="relative size-24 lg:size-32">
                <svg className="size-full -rotate-90">
                  <circle
                    cx="50%" cy="50%" r="45%"
                    className="fill-none stroke-border/20 stroke-[8px]"
                  />
                  <motion.circle
                    cx="50%" cy="50%" r="45%"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${(data.score.total / 100) * 283} 283` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="fill-none stroke-primary stroke-[8px] stroke-round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter">{data.score.total}</span>
                  <span className="text-[8px] font-black text-muted uppercase tracking-widest">Trust</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge intent="low" className={`rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border ${getTierColor(data.score.tier)}`}>
                    {data.score.tier} Tier
                  </Badge>
                  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-xl border border-orange-500/10">
                    <Flame className="size-3 fill-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{data.streak.current_streak_days} Day Streak</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight max-w-[200px] leading-tight">
                  KrishiVault <span className="text-primary">Farmer ID</span>
                </h3>
                <p className="text-xs text-muted font-medium max-w-xs">{data.plain_english_summary}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-surface-muted/30 p-5 rounded-[2rem] border border-border/40 flex-1 min-w-[160px]">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Loan Limit</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black text-muted">₹</span>
                  <span className="text-2xl font-black text-foreground">{(data.farmer_card.loan_limit / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <div className="bg-surface-muted/30 p-5 rounded-[2rem] border border-border/40 flex-1 min-w-[160px]">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Int. Rate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary">{data.farmer_card.interest_rate_percent}</span>
                  <span className="text-xs font-black text-primary">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-10 pt-8 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {data.farmer_card.badges.slice(0, 3).map((badge: string) => (
                <div key={badge} className="size-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform cursor-help" title={badge}>
                  <Award className="size-4" />
                </div>
              ))}
              {data.farmer_card.badges.length > 3 && (
                <span className="text-[10px] font-black text-muted ml-1">+{data.farmer_card.badges.length - 3} More</span>
              )}
            </div>
            <Button 
              variant="secondary" 
              className="rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest border-border/60 hover:bg-white hover:shadow-xl group/btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              Analyze Profile <ChevronRight className={`size-3 ml-2 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Detailed View */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-surface-muted/20 border-t border-border/40"
            >
              <div className="p-8 lg:p-10 space-y-10">
                {/* Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(data.score.pillars).map(([key, pillar]: [string, any]) => (
                    <div key={key} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted">{key.replace('_', ' ')}</p>
                        <p className="text-xs font-black text-foreground">{pillar.score}/{pillar.max}</p>
                      </div>
                      <div className="h-1.5 w-full bg-border/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(pillar.score / pillar.max) * 100}%` }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                      <p className="text-[10px] text-muted/60 font-medium leading-relaxed italic">{pillar.breakdown}</p>
                    </div>
                  ))}
                </div>

                {/* Tips & Rewards */}
                <div className="grid lg:grid-cols-2 gap-10 pt-4">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="size-5 text-indigo-500" />
                      <h4 className="text-sm font-black uppercase tracking-[0.15em]">Quick KYC Actions</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant="secondary" className="rounded-xl h-auto py-3 text-[9px] font-black uppercase tracking-widest border-border/40 hover:border-primary/40">Link Bank Account</Button>
                       <Button variant="secondary" className="rounded-xl h-auto py-3 text-[9px] font-black uppercase tracking-widest border-border/40 hover:border-primary/40">Verify Aadhaar</Button>
                       <Button variant="secondary" className="rounded-xl h-auto py-3 text-[9px] font-black uppercase tracking-widest border-border/40 hover:border-primary/40">Connect UPI</Button>
                       <Button variant="secondary" className="rounded-xl h-auto py-3 text-[9px] font-black uppercase tracking-widest border-border/40 hover:border-primary/40">PM-Kisan Sync</Button>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <TrendingUp className="size-5 text-emerald-500" />
                      <h4 className="text-sm font-black uppercase tracking-[0.15em]">Improvement Path</h4>
                    </div>
                    <div className="space-y-3">
                      {data.improvement_tips.map((tip: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-[10px]">
                              +{tip.points_gain}
                            </div>
                            <p className="text-xs font-black text-foreground">{tip.action}</p>
                          </div>
                          <Badge intent={tip.difficulty === 'easy' ? 'high' : 'medium'} className="text-[8px] uppercase">{tip.difficulty}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Zap className="size-5 text-orange-500" />
                      <h4 className="text-sm font-black uppercase tracking-[0.15em]">Next Milestone</h4>
                    </div>
                    <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                      <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-xs font-black text-primary uppercase tracking-widest">{data.streak.next_milestone.reward}</p>
                            <p className="text-2xl font-black text-foreground">{data.streak.next_milestone.days_remaining} Days Left</p>
                          </div>
                          <div className="size-14 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                            <Award className="size-8 text-primary" />
                          </div>
                        </div>
                        <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-primary/10">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.streak.current_streak_days / data.streak.next_milestone.days) * 100}%` }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest text-center">Progress to Day {data.streak.next_milestone.days}</p>
                      </div>
                      <div className="absolute -bottom-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
