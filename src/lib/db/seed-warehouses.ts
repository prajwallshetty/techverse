import dbConnect from "@/lib/db/mongoose";
import { Warehouse } from "@/models/Warehouse";
import { StorageSlot } from "@/models/StorageSlot";
import { User } from "@/models/User";

export default async function seedWarehouses() {
  await dbConnect();

  const owner = await User.findOne({ role: "warehouse_owner" });
  if (!owner || !owner._id) return console.log("No owner found to seed warehouses.");

  const warehouses: any[] = [
    {
      ownerId: owner._id,
      name: "North Hub Storage",
      location: "Bagalkot, KA",
      capacityTons: 5000,
      pricePerTonPerWeek: 450,
      images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"],
      zones: [
        { id: "Z1", name: "Cold Zone A", type: "cold", rows: 4, cols: 8 },
        { id: "Z2", name: "Dry Zone B", type: "dry", rows: 6, cols: 10 }
      ]
    },
    {
      ownerId: owner._id,
      name: "Coastal Grain Silos",
      location: "Mangaluru, KA",
      capacityTons: 8000,
      pricePerTonPerWeek: 600,
      images: ["https://images.unsplash.com/photo-1590633717551-649033320c74?auto=format&fit=crop&q=80&w=800"],
      zones: [
        { id: "Z1", name: "Main Silo", type: "grain", rows: 8, cols: 12 }
      ]
    }
  ];

  for (const w of warehouses) {
    const existing = await Warehouse.findOne({ name: w.name });
    if (existing) continue;

    const created = await Warehouse.create(w);
    
    // Seed Slots for the first warehouse
    for (const zone of w.zones) {
      const slots = [];
      for (let r = 0; r < zone.rows; r++) {
        for (let c = 0; c < zone.cols; c++) {
          slots.push({
            warehouseId: created._id,
            slotNumber: `${zone.id}-${r}-${c}`,
            zone: zone.type === "cold" ? "A" : zone.type === "dry" ? "B" : "C",
            capacityKg: 1000,
            status: Math.random() > 0.8 ? "occupied" : "available",
            priceMultiplier: zone.type === "cold" ? 1.5 : 1.0
          });
        }
      }
      await StorageSlot.insertMany(slots);
    }
    console.log(`Seeded ${w.name} with slots.`);
  }
}
