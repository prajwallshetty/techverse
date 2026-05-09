export function PriceAdvisorCard() {
  return (
    <section className="bg-primary-container text-on-primary-container p-6 rounded-3xl shadow-lg border border-primary/20 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[140px]">
          smart_toy
        </span>
      </div>
      
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-on-primary-container text-primary p-2 rounded-xl">
          <span className="material-symbols-outlined">smart_toy</span>
        </div>
        <div>
          <h2 className="font-h2 text-h2 text-white">Best Time to Sell: In 8–12 Days</h2>
          <p className="font-body-md text-on-primary-container/90 mt-1">
            Price expected to rise to <span className="font-bold text-white">₹2,680</span> per quintal based on mandi arrival trends.
          </p>
        </div>
      </div>
      
      <button className="w-full h-12 bg-amber-custom text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-4 hover:brightness-110">
        <span className="material-symbols-outlined">notifications_active</span>
        Set SMS Alert for Peak Price
      </button>
    </section>
  );
}
