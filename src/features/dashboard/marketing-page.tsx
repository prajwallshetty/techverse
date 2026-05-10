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
  LayoutDashboard,
  PhoneCall
} from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/antigravity/button";
import { useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/features/i18n/language-switcher";

const statsConfig = [
  { key: "farmers", icon: Users, color: "text-blue-500" },
  { key: "capacity", icon: WarehouseIcon, color: "text-emerald-500" },
  { key: "ivr", icon: PhoneCall, color: "text-amber-500" },
  { key: "states", icon: Globe, color: "text-indigo-500" },
];

const featuresConfig = [
  {
    key: "warehousing",
    icon: ShieldCheck,
    image: "/warehouse.png"
  },
  {
    key: "ivr",
    icon: PhoneCall,
    image: "/warehouse1.png"
  }
];

export function MarketingPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
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
            <div className="size-20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img 
                src="/krishihub.png" 
                alt="Krishi Hub Logo" 
                className="size-full object-contain"
              />
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {[
              { key: 'about',   label: t('marketing.nav.about'), href: '#about' },
              { key: 'how_to_use', label: 'How to Use', href: '#how-to-use' },
              { key: 'contact', label: t('marketing.nav.contact'), href: '#contact' }
            ].map((item) => (
              <Link 
                key={item.key} 
                href={item.href}
                className="text-xs font-black uppercase tracking-widest text-muted hover:text-primary transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <div className="h-4 w-px bg-black/5 mx-2 hidden sm:block" />
            <Link href="/signin" className="text-xs font-black uppercase tracking-widest text-muted hover:text-foreground transition-colors">
              {t('marketing.nav.sign_in')}
            </Link>
            <LinkButton href="/signup" className="rounded-2xl px-8 h-12 bg-primary text-white shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
              {t('marketing.nav.join_now')}
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
                  {t('marketing.hero.title_part1')} <br />
                  <span className="text-primary">{t('marketing.hero.title_part2')}</span> <br />
                  {t('marketing.hero.title_part3')}
                </h1>
                <p className="text-xl lg:text-2xl text-muted font-medium mt-8 max-w-xl leading-relaxed">
                  {t('marketing.hero.subtitle')}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <LinkButton href="/signup" className="h-16 px-10 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center gap-3">
                  {t('marketing.hero.cta_start')} <ArrowRight className="size-5" />
                </LinkButton>
              </motion.div>

              <div className="flex items-center gap-8 pt-8 border-t border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <span className="text-sm font-bold text-on-surface-variant">{t('marketing.hero.wdra')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">monitoring</span>
                  <span className="text-sm font-bold text-on-surface-variant">{t('marketing.hero.ai_insights')}</span>
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
              {statsConfig.map((stat, idx) => (
                <motion.div 
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center space-y-3"
                >
                  <p className="text-5xl font-black tracking-tighter text-foreground">
                    {stat.key === 'farmers' ? '1.2M+' : stat.key === 'capacity' ? '850K MT' : stat.key === 'ivr' ? '24/7' : '18+'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <stat.icon className={`size-4 ${stat.color}`} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{t(`marketing.stats.${stat.key}`)}</p>
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
                {t('marketing.features.title')} <br />
                <span className="text-primary italic">{t('marketing.features.title_italic')}</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {featuresConfig.map((feature, idx) => (
                <motion.div 
                  key={feature.key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  className="group relative h-[600px] rounded-[3.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-700"
                >
                  <img 
                    src={feature.image} 
                    alt={t(`marketing.features.${feature.key}.title`)}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-12 left-12 right-12 text-white">
                    <div className="size-16 rounded-[1.5rem] bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                      <feature.icon className="size-8" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tight mb-4">{t(`marketing.features.${feature.key}.title`)}</h3>
                    <p className="text-lg text-white/70 font-medium max-w-sm leading-relaxed mb-8">
                      {t(`marketing.features.${feature.key}.desc`)}
                    </p>
                    <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:gap-4 transition-all">
                      {t('marketing.features.learn_more')} <ArrowRight className="size-4" />
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
              <Badge label={t('marketing.experience.badge')} />
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                {t('marketing.experience.title').split(',').map((p, i) => <span key={i}>{p}{i === 0 ? ',' : ''} <br /></span>)}
              </h2>
              <div className="space-y-8">
                {[
                  { key: "monitoring", icon: LayoutDashboard },
                  { key: "mandi",      icon: Activity },
                  { key: "ivr",        icon: PhoneCall }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                      <item.icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tight">{t(`marketing.experience.${item.key}.title`)}</h4>
                      <p className="text-muted font-medium mt-1 leading-relaxed">{t(`marketing.experience.${item.key}.desc`)}</p>
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
              <div className="relative bg-surface rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden aspect-[4/3] group cursor-pointer">
                 <img 
                   src="/dashboard_mockup.png" 
                   alt="Platform Dashboard UI" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                 <div className="absolute bottom-0 left-0 right-0 p-8 text-white pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-xl font-black tracking-tight mb-1">Intelligent Dashboard</p>
                    <p className="text-sm font-medium text-white/80">Command center for all your agricultural operations</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── How to Use Section ────────────────────────────────────────── */}
        <section id="how-to-use" className="py-32 lg:py-48 bg-[#fafaf9] border-t border-black/5">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <Badge label="Platform Guide" />
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] mt-6">
                How It Works
              </h2>
              <p className="text-xl text-muted font-medium mt-6 leading-relaxed">
                A seamless ecosystem connecting every stakeholder in the agricultural supply chain.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {/* Farmer Flow */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl shadow-black/5 group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="size-16 rounded-[1.5rem] bg-blue-500/10 text-blue-600 flex items-center justify-center mb-8">
                  <Users className="size-8" />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-8">For Farmers</h3>
                <ul className="space-y-6">
                  {[
                    "Sign up and get AI price predictions for your crops.",
                    "Book trusted warehouse space online to prevent spoilage.",
                    "List stored crops on the marketplace with 1-click Auto-Sell.",
                    "Receive instant payments when traders buy your stock."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="size-6 shrink-0 rounded-full bg-blue-500 text-white font-black text-[10px] flex items-center justify-center mt-1">
                        {i + 1}
                      </div>
                      <p className="font-bold text-muted leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Warehouse Owner Flow */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl shadow-black/5 group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="size-16 rounded-[1.5rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8">
                  <WarehouseIcon className="size-8" />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-8">For Warehouses</h3>
                <ul className="space-y-6">
                  {[
                    "Register your facility and list available capacity (MT).",
                    "Get a verified Trust Score to attract more farmers.",
                    "Receive automated booking requests directly from farmers.",
                    "Monitor real-time space utilization and revenue on your dashboard."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="size-6 shrink-0 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center mt-1">
                        {i + 1}
                      </div>
                      <p className="font-bold text-muted leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Trader Flow */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl shadow-black/5 group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="size-16 rounded-[1.5rem] bg-amber-500/10 text-amber-600 flex items-center justify-center mb-8">
                  <TrendingUp className="size-8" />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-8">For Traders</h3>
                <ul className="space-y-6">
                  {[
                    "Browse live marketplace listings directly from verified warehouses.",
                    "View AI-backed quality metrics and historical price trends.",
                    "Place direct bids on crops, bypassing traditional middlemen.",
                    "Track your purchased inventory and trading history."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="size-6 shrink-0 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center mt-1">
                        {i + 1}
                      </div>
                      <p className="font-bold text-muted leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── About Section ────────────────────────────────────────────── */}
        <section id="about" className="py-32 bg-white border-t border-black/5">
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute -inset-20 bg-emerald-500/10 rounded-full blur-[100px]" />
              <div className="relative bg-surface rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden aspect-[4/4]">
                 <img src="/warehouse.png" alt="About AgriHold" className="w-full h-full object-cover grayscale-[0.2]" />
              </div>
            </motion.div>

            <div className="space-y-10">
              <Badge label="Our Mission" />
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">
                Empowering India's <br /><span className="text-primary">Agricultural Future</span>
              </h2>
              <div className="space-y-6 text-lg text-muted font-medium leading-relaxed">
                <p>
                  AgriHold is on a mission to completely eliminate the trust deficit in the post-harvest supply chain. For too long, farmers have been forced into distress sales due to a lack of secure storage and transparent pricing.
                </p>
                <p>
                  By digitizing warehouses, implementing AI-driven quality checks, and bringing traders directly to the warehouse floor via our online marketplace, we are ensuring that farmers get the true value for their hard work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact Section ───────────────────────────────────────────── */}
        <section id="contact" className="py-32 bg-[#fafaf9] border-t border-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
          
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <Badge label="Get in Touch" />
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mt-6">
                Let's Build Together
              </h2>
              <p className="text-xl text-muted font-medium mt-6">
                Have questions or want to partner with us? Our team is ready to help you digitize your agricultural operations.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto bg-white p-10 lg:p-16 rounded-[3rem] shadow-2xl shadow-black/5 border border-black/5 relative z-10"
            >
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted">Your Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-surface-muted border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted/50" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-surface-muted border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted/50" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">Subject</label>
                  <select className="w-full bg-surface-muted border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
                    <option>I am a Farmer looking for storage</option>
                    <option>I want to list my Warehouse</option>
                    <option>I am a Trader interested in the marketplace</option>
                    <option>Other inquiries</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">Message</label>
                  <textarea rows={5} placeholder="How can we help you?" className="w-full bg-surface-muted border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted/50 resize-none"></textarea>
                </div>

                <button type="button" onClick={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="w-full h-16 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform">
                  Send Message
                </button>
              </form>
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
                    {t('marketing.cta.title')}
                 </h2>
                 <p className="text-xl lg:text-2xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
                    {t('marketing.cta.subtitle')}
                 </p>
                 <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                    <LinkButton href="/signup" className="h-16 px-12 rounded-2xl bg-white text-primary font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/10 hover:scale-105 transition-transform">
                      {t('marketing.cta.register_farmer')}
                    </LinkButton>
                    <LinkButton href="/signin" className="h-16 px-12 rounded-2xl border-2 border-white/20 hover:bg-white/10 font-black text-sm uppercase tracking-widest transition-all">
                      {t('marketing.cta.sign_in')}
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
                <div className="size-16 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img 
                    src="/krishihub.png" 
                    alt="Krishi Hub Logo" 
                    className="size-full object-contain"
                  />
                </div>
              </Link>
              <p className="text-muted text-sm font-medium leading-relaxed">
                {t('marketing.footer.desc')}
              </p>
            </div>
            
            {[
              { key: "platform", links: ["Warehouses", "Financing", "Marketplace", "Logistics"] },
              { key: "company",  links: ["About", "Careers", "Press", "Security"] },
              { key: "support",  links: ["Help Center", "API Docs", "Contact", "Status"] }
            ].map(col => (
              <div key={col.key} className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{t(`marketing.footer.${col.key}`)}</h5>
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
              {t('marketing.footer.copyright')}
            </p>
            <div className="flex gap-8">
              {["privacy", "terms", "cookies"].map(l => (
                <Link key={l} href="#" className="text-xs font-black uppercase tracking-widest text-muted hover:text-foreground transition-colors">{t(`marketing.footer.${l}`)}</Link>
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
