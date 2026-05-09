import { ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, Users, Warehouse, Search, MapPin, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/antigravity/button";

const stats = [
  { label: "Farmers Empowered", value: "1.2M+", icon: Users },
  { label: "Verified Warehouses", value: "500+", icon: Warehouse },
  { label: "Value Unlocked", value: "₹4,500Cr", icon: TrendingUp },
];

const steps = [
  {
    title: "Deposit Your Crop",
    desc: "Store your harvest in our network of verified warehouses with 24/7 monitoring and insurance coverage.",
    icon: Warehouse,
    color: "bg-primary/10 text-primary",
  },

  {
    title: "Sell at Peak Price",
    desc: "Our AI Advisor monitors mandi arrivals and predicts price peaks, helping you sell directly to verified buyers.",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
];

export function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/10">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary rounded-xl p-1.5 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">agriculture</span>
            </div>
            <span className="text-2xl font-black text-primary tracking-tighter uppercase">Krishi Hub</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            {["How it Works", "Warehouses", "Price Advisor", "About Us"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[15px] font-bold text-on-surface-variant hover:text-primary transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/signin" className="hidden sm:block text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
              Log In
            </Link>
            <LinkButton href="/signup" className="rounded-full px-8 py-6 h-auto text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
              Get Started
            </LinkButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-40">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10 space-y-10 max-w-2xl">
              <div className="inline-flex items-center gap-3 bg-white border border-outline-variant px-5 py-2.5 rounded-full shadow-sm">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center overflow-hidden">
                      <img src={`https://placehold.co/40x40?text=${i}`} alt="" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-on-surface-variant tracking-wide">Trusted by 1.2M+ Farmers</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black text-on-surface leading-[1.05] tracking-tight">
                Store Your Crop, <br />
                <span className="text-primary italic">Unlock Prosperity.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-on-surface-variant leading-relaxed font-medium max-w-xl">
                India&apos;s premier digital storage platform. Empowering farmers with secure warehousing, instant credit, and AI-driven market intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <LinkButton href="/signup" className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 group">
                  Find a Warehouse
                  <ArrowRight className="ml-2 size-6 transition-transform duration-300 group-hover:translate-x-1" />
                </LinkButton>
                <LinkButton href="/signin" variant="secondary" className="h-16 px-10 text-lg rounded-full border-2 border-outline-variant bg-transparent hover:bg-surface-container-low">
                  Check Market Prices
                </LinkButton>
              </div>

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
            
            {/* Visual Section */}
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-[40px] blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="relative rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(30,123,75,0.2)] border border-white/40 aspect-[4/5] lg:aspect-square">
                <img 
                  src="https://placehold.co/800x800?text=Lush+Farm+Sunset" 
                  alt="Krishi Hub Empowerment" 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating UI Elements */}
                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white animate-in slide-in-from-bottom-8 duration-1000">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                        <TrendingUp className="size-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Market Price</p>
                        <p className="text-2xl font-black text-on-surface">Wheat (Grade A)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">₹2,450</p>
                      <p className="text-sm font-bold text-primary flex items-center justify-end gap-1">
                        <TrendingUp className="size-3" /> +4.2%
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_8px_rgba(30,123,75,0.4)]" />
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                    <span>Low: ₹2,100</span>
                    <span className="text-primary">Best time to sell: In 8 days</span>
                    <span>Peak: ₹2,680</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-surface-container-lowest py-20 border-y border-outline-variant/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/5 w-16 h-16 rounded-[24px] flex items-center justify-center text-primary">
                    <stat.icon className="size-8 stroke-[1.5px]" />
                  </div>
                  <div>
                    <p className="text-5xl font-black text-on-surface tracking-tight">{stat.value}</p>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-2">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 lg:py-48 relative">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center space-y-6 mb-24">
              <h2 className="text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight">
                Maximize Your Income <br />
                In <span className="text-primary italic">Three Simple Steps</span>
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto font-medium">
                We&apos;ve simplified the entire post-harvest process. No more distress selling. No more middle-men. Just technology that works for you.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-10">
              {steps.map((step, idx) => (
                <div key={step.title} className="bg-white p-12 rounded-[48px] border border-outline-variant hover:border-primary/30 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  
                  <div className={`${step.color} w-20 h-20 rounded-[28px] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <step.icon className="size-10 stroke-[1.5px]" />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-primary/40">0{idx + 1}</span>
                      <h3 className="text-2xl font-black text-on-surface">{step.title}</h3>
                    </div>
                    <p className="text-lg text-on-surface-variant leading-relaxed font-medium">
                      {step.desc}
                    </p>
                    <div className="pt-4">
                      <button className="flex items-center gap-2 text-sm font-black text-primary group/link">
                        Learn More 
                        <ChevronRight className="size-4 transition-transform group-hover/link:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-surface-container-low py-32 rounded-[64px] mx-6 lg:mx-12 mb-32 overflow-hidden relative">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <h2 className="text-5xl font-black text-on-surface tracking-tight leading-tight">
                  Smarter Decisions with <br />
                  <span className="text-secondary">Data-Driven Insights</span>
                </h2>
                
                <div className="space-y-8">
                  {[
                    { title: "AI Price Advisor", desc: "Real-time mandi arrival tracking and predictive analytics.", icon: "insights" },
                    { title: "Nationwide Warehouse Network", desc: "Access 500+ verified and insured storage hubs.", icon: "grid_view" },

                  ].map(f => (
                    <div key={f.title} className="flex gap-6 items-start group">
                      <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:shadow-md transition-all text-primary">
                        <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-on-surface">{f.title}</h4>
                        <p className="text-on-surface-variant font-medium leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <LinkButton href="/signup" className="h-16 px-10 rounded-full">
                  Explore Features
                </LinkButton>
              </div>

              <div className="relative">
                <div className="absolute -inset-10 bg-white/20 rounded-[48px] blur-3xl" />
                <img 
                  src="https://placehold.co/700x800?text=Dashboard+Preview" 
                  alt="Dashboard Preview" 
                  className="relative rounded-[48px] shadow-2xl border border-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-primary text-white text-center relative overflow-hidden rounded-[48px] mx-6 lg:mx-12 mb-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10 space-y-10">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
              Ready to Secure Your <br /> Agricultural Future?
            </h2>
            <p className="text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto font-medium">
              Join 1.2M+ farmers who are already getting better value for their crops with Krishi Hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <LinkButton href="/signup" className="bg-white text-primary hover:bg-white/90 h-16 px-12 text-xl rounded-full shadow-2xl shadow-black/20">
                Register as Farmer
              </LinkButton>
              <LinkButton href="/signin" className="bg-transparent border-2 border-white text-white hover:bg-white/10 h-16 px-12 text-xl rounded-full">
                Register as Trader
              </LinkButton>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-20 border-t border-outline-variant/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
                <span className="text-2xl font-black text-primary tracking-tighter uppercase">Krishi Hub</span>
              </div>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                Empowering Bharat&apos;s farmers with secure storage, instant credit, and data-driven prosperity.
              </p>
            </div>
            
            {[
              { title: "Product", links: ["Warehouses", "AI Advisor", "Marketplace"] },
              { title: "Company", links: ["About Us", "Contact", "Careers", "Impact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] }
            ].map(col => (
              <div key={col.title} className="space-y-6">
                <h5 className="font-black text-on-surface uppercase tracking-widest text-xs">{col.title}</h5>
                <ul className="space-y-4">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-20 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-on-surface-variant text-sm font-medium">
              © 2026 Krishi Hub. All rights reserved. 
            </p>
            <div className="flex gap-8">
              {/* Social icons placeholders */}
              {["Facebook", "Twitter", "LinkedIn", "YouTube"].map(s => (
                <Link key={s} href="#" className="text-on-surface-variant hover:text-primary text-sm font-bold">{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
