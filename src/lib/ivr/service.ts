import dbConnect from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { Warehouse } from "@/models/Warehouse";
import { Booking } from "@/models/Booking";
import { Loan } from "@/models/Loan";
import { Bid } from "@/models/Bid";
import { CreditEngine } from "@/lib/loans/credit-engine";

export const IVRService = {
  /**
   * Identifies the user based on their phone number (Caller ID).
   */
  async identifyUser(phone: string) {
    await dbConnect();
    // In real Exotel, phone might be prefixed with +91 or 0
    const normalizedPhone = phone.replace("+91", "").slice(-10);
    return User.findOne({ phone: { $regex: normalizedPhone }, role: "farmer" });
  },

  /**
   * Fetches the nearest warehouse availability.
   */
  async getNearbyWarehouse() {
    await dbConnect();
    const warehouse = await Warehouse.findOne().sort({ capacityTons: -1 }); // Mocking "nearest"
    if (!warehouse) return "No warehouses found nearby.";
    return `Nearest warehouse is ${warehouse.name} in ${warehouse.location}, with ${warehouse.capacityTons} metric tons available.`;
  },

  /**
   * Fetches current crop prices.
   */
  getLatestPrices() {
    const crops = ["Paddy", "Wheat", "Maize"];
    const prices = crops.map(c => `${c} is ${CreditEngine.calculateCropValue(c, 1)} rupees per ton`).join(". ");
    return `Current market prices: ${prices}`;
  },

  /**
   * Calculates loan eligibility for a registered farmer.
   */
  async getLoanEligibility(userId: string) {
    await dbConnect();
    const activeBooking = await Booking.findOne({ farmerId: userId, status: "confirmed" });
    if (!activeBooking) return "You do not have any verified storage receipts to use as collateral.";
    
    const value = CreditEngine.calculateCropValue(activeBooking.cropName, activeBooking.quantityTons);
    const amount = CreditEngine.estimateLoanAmount(value);
    return `Based on your stored ${activeBooking.cropName}, you are eligible for an instant credit of ${amount.toLocaleString()} rupees.`;
  },

  /**
   * Checks the highest bid for a farmer's crop.
   */
  async getMarketplaceStatus(userId: string) {
    await dbConnect();
    const booking = await Booking.findOne({ farmerId: userId }).sort({ createdAt: -1 });
    if (!booking) return "You have no active listings in the marketplace.";
    
    const highestBid = await Bid.findOne({ bookingId: booking._id }).sort({ amount: -1 });
    if (!highestBid) return `Your ${booking.cropName} is listed, but no bids have been placed yet.`;
    
    return `The current highest bid for your ${booking.cropName} is ${highestBid.amount.toLocaleString()} rupees per ton.`;
  }
};
