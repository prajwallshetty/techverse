"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  Flame,
  Award,
  ChevronRight,
  Loader2,
  Building2,
  CheckCircle2,
  Users,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/antigravity/card";
import { Badge } from "@/components/antigravity/badge";
import { Button } from "@/components/antigravity/button";

function getTierConfig(tier?: string) {
  switch (tier) {
    case "Platinum": return { color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" };
    case "Gold":     return { color: "text-amber-500",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  };
    case "Silver":   return { color: "text-slate-400",  bg: "bg-slate-400/10",  border: "border-slate-400/20"  };
    default:         return { color: "text-orange-600", bg: "bg-orange-500/10", border: "border-orange-500/20" };
  }
}

export function WarehouseTrustCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetch("/api/warehouse/trust-score")
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="border-border/40 bg-surface rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-10 flex flex-col items-center justify-center min-h-[200px] gap-4">
          <Loader2 className="size-8 animate-spin text-primary opacity-40" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted animate-pulse">
            Computing Trust Profile...
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────────
  if (!data || !data.score) return (
    <Card className="border-border/40 bg-surface rounded-[2.5rem] overflow-hidden">
      <CardContent className="p-10 flex flex-col items-center justify-center min-h-[200px] gap-4">
        <AlertTriangle className="size-8 text-amber-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">
          Unable to load Trust Profile.<br/>
          {data?.error || "Please check your connection."}
        </p>
      </CardContent>
    </Card>
  );
  
  const tier = getTierConfig(data.score?.tier);

  return (
    <Card className="border-border/40 bg-surface rounded-[3rem] overflow-hidden shadow-xl shadow-black/5 group">
      <CardContent className="p-0">
        <div className="px-8 pt-8 pb-4 lg:px-10 lg:pt-10 relative">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted mb-6">
            KrishiVault · Facility Trust Score
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Score gauge + identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative size-28 lg:size-32 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-border/20" />
                  <motion.circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 264" }}
                    animate={{ strokeDasharray: `${(data.score.total / 100) * 264} 264` }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-foreground tracking-tighter leading-none">
                    {data.score.total}
                  </span>
                  <span className="text-[8px] font-black text-muted uppercase tracking-widest mt-1">/100</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    intent="low"
                    className={`rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border ${tier.bg} ${tier.color} ${tier.border}`}
                  >
                    <ShieldCheck className="size-3 mr-1.5 shrink-0" />
                    {data.score.tier} Facility
                  </Badge>
                  {data.streak?.current_streak_days > 0 && (
                    <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-xl border border-orange-500/10">
                      <Flame className="size-3 fill-orange-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {data.streak.current_streak_days}d Active
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight leading-tight">
                  Facility <span className="text-primary">Trust Profile</span>
                </h3>
                <p className="text-xs text-muted font-medium max-w-xs leading-relaxed">
                  {data.plain_english_summary}
                </p>
              </div>
            </div>

            {/* Farmer verdict + quick stats */}
            <div className="flex flex-col gap-3 lg:items-end">
              <div className={`p-4 rounded-[1.5rem] border ${tier.border} ${tier.bg} max-w-[260px]`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className={`size-3.5 ${tier.color}`} />
                  <p className={`text-[9px] font-black uppercase tracking-widest ${tier.color}`}>Farmer Verdict</p>
                </div>
                <p className="text-xs font-bold text-foreground leading-relaxed">
                  {data.owner_card?.farmer_recommendation || "Evaluation in progress."}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-surface-muted/30 p-4 rounded-[1.5rem] border border-border/40 text-center min-w-[80px]">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Commission</p>
                  <p className="text-lg font-black text-foreground">
                    {data.owner_card?.commission_rate_percent ?? "—"}
                    <span className="text-xs text-muted ml-0.5">%</span>
                  </p>
                </div>
                <div className="bg-surface-muted/30 p-4 rounded-[1.5rem] border border-border/40 text-center min-w-[80px]">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Badges</p>
                  <p className="text-lg font-black text-foreground">{data.owner_card?.badges?.length ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom action row */}
          <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(data.owner_card?.badges || []).slice(0, 4).map((badge: string) => (
                <div
                  key={badge}
                  title={badge}
                  className="size-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:scale-110 transition-transform cursor-help"
                >
                  <Award className="size-4" />
                </div>
              ))}
              {(data.owner_card?.badges || []).length > 4 && (
                <span className="text-[10px] font-black text-muted ml-1">
                  +{data.owner_card.badges.length - 4}
                </span>
              )}
            </div>
            <Button
              variant="secondary"
              className="rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest border-border/60 hover:bg-white hover:shadow-lg transition-all"
              onClick={() => setShowDetails(v => !v)}
            >
              Full Analysis
              <ChevronRight className={`size-3 ml-2 transition-transform ${showDetails ? "rotate-90" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden bg-surface-muted/10 border-t border-border/40"
            >
              <div className="p-8 lg:p-10 space-y-10">
                {/* Pillar breakdown */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-6">
                    Score Breakdown — 5 Pillars
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(data.score?.pillars || {}).map(([key, pillar]: [string, any]) => {
                      const pct = (pillar.score / pillar.max) * 100;
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted capitalize">
                              {key.replaceAll("_", " ")}
                            </p>
                            <p className="text-xs font-black text-foreground">{pillar.score}/{pillar.max}</p>
                          </div>
                          <div className="h-2 w-full bg-border/20 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.9, delay: 0.1 }}
                              className={`h-full rounded-full ${
                                pct >= 75 ? "bg-emerald-500" :
                                pct >= 50 ? "bg-primary" :
                                "bg-amber-500"
                              }`}
                            />
                          </div>
                          <p className="text-[10px] text-muted/70 font-medium italic leading-relaxed">
                            {pillar.breakdown}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips + Milestone */}
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Improvement tips */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="size-5 text-emerald-500" />
                      <h4 className="text-sm font-black uppercase tracking-[0.15em]">How to Improve</h4>
                    </div>
                    <div className="space-y-2.5">
                      {(data.improvement_tips || []).map((tip: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-[10px] shrink-0">
                              +{tip.points_gain}
                            </div>
                            <p className="text-xs font-black text-foreground">{tip.action}</p>
                          </div>
                          <Badge
                            intent={tip.difficulty === "easy" ? "high" : tip.difficulty === "medium" ? "medium" : "low"}
                            className="text-[8px] uppercase shrink-0 ml-2"
                          >
                            {tip.difficulty}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Streak milestone */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Flame className="size-5 text-orange-500" />
                      <h4 className="text-sm font-black uppercase tracking-[0.15em]">Next Milestone</h4>
                    </div>
                    {data.streak?.next_milestone && (
                      <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-black text-primary uppercase tracking-widest">
                                {data.streak.next_milestone.reward}
                              </p>
                              <p className="text-2xl font-black text-foreground mt-1">
                                {data.streak.next_milestone.days_remaining} Days Left
                              </p>
                            </div>
                            <div className="size-12 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                              <Building2 className="size-6 text-primary" />
                            </div>
                          </div>
                          <div className="h-2.5 w-full bg-white rounded-full overflow-hidden border border-primary/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(100, (data.streak.current_streak_days / data.streak.next_milestone.days) * 100)}%`
                              }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                          <p className="text-[10px] font-black text-muted uppercase tracking-widest text-center">
                            Day {data.streak.current_streak_days} of {data.streak.next_milestone.days}
                          </p>
                        </div>
                        <div className="absolute -bottom-8 -right-8 size-32 bg-primary/5 rounded-full blur-3xl" />
                      </div>
                    )}

                    {/* Features unlocked */}
                    {(data.owner_card?.features_unlocked || []).length > 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">Features Unlocked</p>
                        {data.owner_card.features_unlocked.map((f: string) => (
                          <div key={f} className="flex items-center gap-2 text-xs font-bold text-foreground">
                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> {f}
                          </div>
                        ))}
                      </div>
                    )}
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
