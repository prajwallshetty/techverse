interface WarehouseCardProps {
  name: string;
  location: string;
  price: number;
  capacityUsage: number;
  imageUrl: string;
  tags: string[];
}

export function WarehouseCard({ name, location, price, capacityUsage, imageUrl, tags }: WarehouseCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden hover:shadow-xl transition-all active:scale-[0.98] duration-200 group">
      <div className="relative h-48 w-full">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-xs shadow-sm backdrop-blur-sm">
          Available Now
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-h2 text-xl text-primary">{name}</h3>
            <div className="flex items-center gap-1 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>{location}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-price-display text-lg text-tertiary font-bold">₹{price}</span>
            <span className="text-[10px] block text-on-surface-variant">/quintal/month</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
            <span>Capacity</span>
            <span className={capacityUsage > 80 ? 'text-error' : 'text-primary'}>
              {capacityUsage}% Full
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${capacityUsage > 80 ? 'bg-error' : 'bg-primary'}`}
              style={{ width: `${capacityUsage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full text-xs text-on-surface-variant border border-outline-variant/30">
              <span className="material-symbols-outlined text-[14px]">
                {tag === 'Cold Storage' ? 'ac_unit' : tag === 'WDRA Regd.' ? 'verified' : 'security'}
              </span>
              {tag}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 pt-2">
          <button className="flex-1 h-12 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-all shadow-md active:scale-95">
            Book Now
          </button>
          <button className="px-4 h-12 border border-primary text-primary rounded-xl font-bold hover:bg-surface-container-low transition-all active:scale-95">
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
