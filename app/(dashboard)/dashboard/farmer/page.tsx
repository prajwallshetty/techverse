import { auth } from "@/lib/auth";
import { PriceAdvisorCard } from "@/components/ui/price-advisor-card";
import { WarehouseCard } from "@/components/ui/warehouse-card";

export const metadata = {
  title: "Farmer Dashboard | Krishi Hub",
};

const DEMO_WAREHOUSES = [
  {
    name: "Karnal Central Storage",
    location: "Karnal, Haryana",
    price: 450,
    capacityUsage: 85,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    tags: ["Cold Storage", "WDRA Regd."]
  },
  {
    name: "Nizamabad Agri Hub",
    location: "Nizamabad, Telangana",
    price: 380,
    capacityUsage: 72,
    imageUrl: "https://images.unsplash.com/photo-1590633457589-9430c5e79927?auto=format&fit=crop&q=80&w=800",
    tags: ["Dry Grains", "24/7 Security"]
  }
];

export default async function FarmerDashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Farmer";

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl">
        <div className="relative z-10 space-y-4">
          <h2 className="font-h2 text-3xl font-bold">Good Morning, {firstName} 🌾</h2>
          <div className="flex flex-wrap gap-2">
            <button className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">
              Book Storage
            </button>
            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all">
              Check Prices
            </button>
            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all">
              Apply for Loan
            </button>
          </div>
        </div>
        
        {/* Decorative Image */}
        <div className="absolute -right-8 -bottom-8 opacity-20 w-48 h-48 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400" 
            alt="" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        {[
          { label: 'Stored Crops', value: '45 Quintals', icon: 'warehouse', color: 'primary' },
          { label: 'Active Loan', value: '₹45,000', icon: 'payments', color: 'tertiary' },
          { label: 'Market Profit', value: '+₹12,400', icon: 'trending_up', color: 'primary', highlight: true },
          { label: 'Active Bids', value: '3', icon: 'gavel', color: 'secondary' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-4 rounded-3xl border border-outline-variant flex flex-col gap-3 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}/10 group-hover:scale-110 transition-transform`}>
              <span className={`material-symbols-outlined text-${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className={`text-lg font-black ${stat.highlight ? 'text-primary' : ''}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* AI Price Recommendation */}
      <PriceAdvisorCard />

      {/* Nearby Warehouses */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-h2 text-xl text-on-surface">Nearby Warehouses</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1">
            View All
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        
        <div className="grid gap-6">
          {DEMO_WAREHOUSES.map((warehouse) => (
            <WarehouseCard key={warehouse.name} {...warehouse} />
          ))}
        </div>
      </section>

      {/* Contextual Help */}
      <div className="bg-surface-container-low p-6 rounded-3xl border-l-8 border-secondary flex gap-4 shadow-inner">
        <span className="material-symbols-outlined text-secondary">info</span>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          AI predictions are based on historical arrival data and current weather patterns in your region. <span className="font-bold text-secondary">Learn more.</span>
        </p>
      </div>
    </div>
  );
}
