import { sendSMS } from "./twilio";

export const NotificationService = {
  /**
   * Sends an SMS when a warehouse booking is confirmed.
   */
  async notifyBookingConfirmed(phone: string, warehouseName: string, quantity: number) {
    const message = `AgriHold AI: Your booking for ${quantity} MT at ${warehouseName} is CONFIRMED. Present your digital receipt at drop-off.`;
    await sendSMS(phone, message);
  },

  /**
   * Sends an SMS when a loan is disbursed.
   */
  async notifyLoanDisbursed(phone: string, amount: number) {
    const message = `AgriHold AI: Loan of ₹${amount.toLocaleString()} has been successfully disbursed to your account. Stay liquid!`;
    await sendSMS(phone, message);
  },

  /**
   * Sends an SMS when a new bid is placed on a farmer's crop.
   */
  async notifyNewBid(phone: string, cropType: string, amount: number) {
    const message = `AgriHold AI: New bid of ₹${amount.toLocaleString()}/MT placed on your ${cropType}. Check your marketplace dashboard!`;
    await sendSMS(phone, message);
  },

  /**
   * Sends an SMS when an auto-sell is executed.
   */
  async notifyAutoSellExecuted(phone: string, cropType: string, amount: number) {
    const message = `AgriHold AI: AUTO-SELL EXECUTED! Your ${cropType} has been sold for ₹${amount.toLocaleString()}/MT. Funds are processing.`;
    await sendSMS(phone, message);
  }
};
