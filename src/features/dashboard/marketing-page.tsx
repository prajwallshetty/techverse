"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Warehouse as WarehouseIcon, 
  ChevronRight,
  Shield,
  Zap,
  Globe,
  Coins,
  ArrowUpRight,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/antigravity/button";
import { useRef } from "react";

const stats = [
  { label: "Active Farmers", value: "1.2M+", icon: Users, color: "text-blue-500" },
  { label: "Storage Capacity", value: "850K MT", icon: WarehouseIcon, color: "text-emerald-500" },
  { label: "Credit Disbursed", value: "₹4,200Cr", icon: Coins, color: "text-amber-500" },
  { label: "States Covered", value: "18+", icon: Globe, color: "text-indigo-500" },
];

const features = [
  {
    title: "Secure Warehousing",
    desc: "WDRA-registered facilities with 24/7 digital surveillance and comprehensive insurance coverage.",
    icon: ShieldCheck,
    image: "/warehouse.png"
  },
  {
    title: "Instant Credit",
    desc: "Unlock liquidity without selling your crops. Get instant loans against your electronic Negotiable Warehouse Receipts (eNWR).",
    icon: Zap,
    image: "/warehouse1.png"
  }
];

export function MarketingPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-[#1c1917] selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/[0.03]">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-primary">Krishi Hub</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {["Network", "Pricing", "About", "Contact"].map((item) => (
              <Link 
                key={item} 
                href="#"
                className="text-xs font-black uppercase tracking-widest text-muted hover:text-primary transition-all"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-xs font-black uppercase tracking-widest text-muted hover:text-foreground transition-colors mr-2">
              Sign In
            </Link>
            <LinkButton href="/signup" className="rounded-2xl px-8 h-12 bg-primary text-white shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
              Join Now
            </LinkButton>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <section ref={targetRef} className="relative min-h-screen flex items-center pt-20">
          <motion.div 
            style={{ opacity, scale }}
            className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-7 space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-6xl lg:text-[6.5rem] font-extrabold leading-[0.95] tracking-tight mt-6">
                  Harvesting <br />
                  <span className="text-primary">Prosperity</span> <br />
                  Digitally.
                </h1>
                <p className="text-xl lg:text-2xl text-muted font-medium mt-8 max-w-xl leading-relaxed">
                  The most advanced agricultural asset management platform. Secure storage, instant liquidity, and data-driven insights for the modern farmer.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <LinkButton href="/signup" className="h-16 px-10 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center gap-3">
                  Start Your Journey <ArrowRight className="size-5" />
                </LinkButton>
                <LinkButton href="/signin" variant="secondary" className="h-16 px-10 rounded-2xl border-2 border-black/5 font-black text-sm uppercase tracking-widest">
                  View Live Prices
                </LinkButton>
              </motion.div>

              <div className="flex items-center gap-8 pt-8 border-t border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <span className="text-sm font-bold text-on-surface-variant">WDRA Regd.</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">monitoring</span>
                  <span className="text-sm font-bold text-on-surface-variant">AI Insights</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(30,123,75,0.25)] border-8 border-white bg-white"
              >
                <img 
                  src="/farmer.png" 
                  alt="Modern Farmer" 
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Floating Insight Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-2xl border border-white/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600">
                        <TrendingUp className="size-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Price Prediction</p>
                        <p className="text-lg font-bold">Wheat (Grade A+)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-600">↑ ₹2,480</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative backgrounds */}
              <div className="absolute -top-20 -right-20 size-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
              <div className="absolute -bottom-20 -left-20 size-[500px] bg-amber-500/10 rounded-full blur-[100px] -z-10" />
            </div>
          </motion.div>
        </section>

        {/* ── Stats Section ─────────────────────────────────────────────── */}
        <section className="py-24 bg-white border-y border-black/5">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center space-y-3"
                >
                  <p className="text-5xl font-black tracking-tighter text-foreground">{stat.value}</p>
                  <div className="flex items-center justify-center gap-2">
                    <stat.icon className={`size-4 ${stat.color}`} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Showcase ─────────────────────────────────────────── */}
        <section className="py-32 lg:py-48 bg-[#fafaf9]">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-24">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
                Infrastructure designed for <br />
                <span className="text-primary italic">Absolute Confidence.</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {features.map((feature, idx) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  className="group relative h-[600px] rounded-[3.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-700"
                >
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-12 left-12 right-12 text-white">
                    <div className="size-16 rounded-[1.5rem] bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                      <feature.icon className="size-8" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tight mb-4">{feature.title}</h3>
                    <p className="text-lg text-white/70 font-medium max-w-sm leading-relaxed mb-8">
                      {feature.desc}
                    </p>
                    <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:gap-4 transition-all">
                      Learn More <ArrowRight className="size-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Experience Section ────────────────────────────────────────── */}
        <section className="py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 order-2 lg:order-1">
              <Badge label="Full Control" />
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                Your Farm, <br /> In Your Pocket.
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Real-time Monitoring", desc: "Watch your stock levels and quality parameters from anywhere.", icon: LayoutDashboard },
                  { title: "Mandi Price Feed", desc: "Live rates from 2,500+ mandis across India at your fingertips.", icon: Activity },
                  { title: "Financial Hub", desc: "Apply for loans, view balance, and withdraw funds instantly.", icon: Coins }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                      <item.icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tight">{item.title}</h4>
                      <p className="text-muted font-medium mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute -inset-20 bg-primary/5 rounded-full blur-[120px]" />
              <div className="relative bg-surface rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden aspect-[4/3]">
                 <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                    <LayoutDashboard className="size-20 text-primary/20 animate-pulse" />
                 </div>
                 {/* This would be a screenshot of the app dashboard */}
                 <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/90 to-transparent">
                    <p className="text-xs font-black uppercase tracking-widest text-muted text-center">Dashboard Experience Mockup</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="py-40 relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="bg-primary rounded-[4rem] p-12 lg:p-32 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <WarehouseIcon className="size-64" />
               </div>
               
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="relative z-10 space-y-10"
               >
                 <h2 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
                    Join the Digital <br /> Agriculture Revolution.
                 </h2>
                 <p className="text-xl lg:text-2xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
                    Stop gambling with your harvest. Get the security and liquidity you deserve with Krishi Hub.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                    <LinkButton href="/signup" className="h-16 px-12 rounded-2xl bg-white text-primary font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/10 hover:scale-105 transition-transform">
                      Register as Farmer
                    </LinkButton>
                    <LinkButton href="/signin" className="h-16 px-12 rounded-2xl border-2 border-white/20 hover:bg-white/10 font-black text-sm uppercase tracking-widest transition-all">
                      Sign In to Account
                    </LinkButton>
                 </div>
               </motion.div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-white py-24 border-t border-black/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="bg-primary size-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-white text-lg">agriculture</span>
                </div>
                <span className="text-lg font-black tracking-tighter uppercase text-primary">Krishi Hub</span>
              </Link>
              <p className="text-muted text-sm font-medium leading-relaxed">
                Empowering Bharat&apos;s agricultural ecosystem with secure technology and financial inclusion.
              </p>
            </div>
            
            {[
              { title: "Platform", links: ["Warehouses", "Financing", "Marketplace", "Logistics"] },
              { title: "Company", links: ["About", "Careers", "Press", "Security"] },
              { title: "Support", links: ["Help Center", "API Docs", "Contact", "Status"] }
            ].map(col => (
              <div key={col.title} className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{col.title}</h5>
                <ul className="space-y-4">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link href="#" className="text-sm font-bold text-muted hover:text-primary transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted text-xs font-bold uppercase tracking-widest">
              © 2026 Krishi Hub. All rights reserved.
            </p>
            <div className="flex gap-8">
              {["Privacy", "Terms", "Cookies"].map(l => (
                <Link key={l} href="#" className="text-xs font-black uppercase tracking-widest text-muted hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
      <div className="size-1.5 rounded-full bg-primary animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</span>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
