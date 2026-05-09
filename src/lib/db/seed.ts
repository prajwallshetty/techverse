import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { User } from "@/types/domain";

const uri = process.env.MONGODB_URI || "mongodb+srv://prajwal0shetty11_db_user:fyKpwjtzN1RS8tgn@techverse.n1aob5x.mongodb.net/?appName=techverse";
const dbName = process.env.MONGODB_DB || "techverse";

async function seed() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Clear existing users and otps for a clean start
    console.log("Clearing existing users and otps...");
    await db.collection("users").deleteMany({});
    await db.collection("otps").deleteMany({});

    // Create Indexes
    console.log("Creating indexes...");
    await db.collection("users").createIndex(
      { email: 1 },
      { unique: true, partialFilterExpression: { email: { $exists: true } } }
    );
    await db.collection("users").createIndex(
      { phone: 1 },
      { unique: true, partialFilterExpression: { phone: { $exists: true } } }
    );
    await db.collection("otps").createIndex({ phone: 1 }, { unique: true });
    await db.collection("otps").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    ); // TTL index for OTPs

    console.log("Hashing passwords...");
    const adminPassword = await bcrypt.hash("Admin@2026", 10);
    const warehousePassword = await bcrypt.hash("Warehouse@2026", 10);
    const traderPassword = await bcrypt.hash("Trader@2026", 10);

    const now = new Date();

    const users: User[] = [
      {
        name: "Akshay (Farmer)",
        phone: "9876543210",
        role: "farmer",
        isActive: true,
        farmDetails: {
          region: "Karnataka",
          acreage: 12,
          primaryCrop: "Sugarcane",
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Priya Warehousing",
        email: "warehouse@agrihold.ai",
        passwordHash: warehousePassword,
        role: "warehouse_owner",
        isActive: true,
        warehouseDetails: {
          location: "Hyderabad APMC",
          capacityTons: 2400,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Vikram Traders",
        email: "trader@agrihold.ai",
        passwordHash: traderPassword,
        role: "trader",
        isActive: true,
        traderDetails: {
          licenseNumber: "TRD-89102",
          tradingRegions: ["Maharashtra", "Karnataka"],
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "AgriHold Admin",
        email: "admin@agrihold.ai",
        passwordHash: adminPassword,
        role: "admin",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    console.log("Inserting users...");
    await db.collection("users").insertMany(users as unknown as any[]);
    console.log("Successfully seeded database with demo users.");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
