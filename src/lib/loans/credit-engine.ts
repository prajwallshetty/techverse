/**
 * Smart Credit Engine Utility
 * Logic for mock crop-backed lending.
 */

// Average Market Prices (INR per MT)
export const CROP_PRICES: Record<string, number> = {
  Sugarcane: 3200,
  Paddy: 22000,
  Wheat: 21000,
  Cotton: 60000,
  Maize: 19000,
};

export const CreditEngine = {
  /**
   * Calculates the current market value of the crop.
   */
  calculateCropValue(cropType: string, quantity: number): number {
    const price = CROP_PRICES[cropType] || 15000; // Default price if not found
    return price * quantity;
  },

  /**
   * Calculates eligible loan amount (70% of crop value).
   */
  estimateLoanAmount(cropValue: number): number {
    return Math.floor(cropValue * 0.70);
  },

  /**
   * Estimates repayment period (Standard 6 months for harvest cycle).
   */
  calculateRepaymentDate(startDate: Date = new Date()): Date {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 6);
    return date;
  },

  /**
   * Generates a realistic mock transaction ID.
   */
  generateTransactionId(): string {
    return `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
};
