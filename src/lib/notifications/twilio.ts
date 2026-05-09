import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER || "+1234567890";

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendSMS = async (to: string, body: string) => {
  console.log(`[SMS to ${to}]: ${body}`);

  if (!client) {
    console.warn("Twilio client not initialized. Check your environment variables.");
    return;
  }

  try {
    await client.messages.create({
      body,
      from: fromPhone,
      to,
    });
  } catch (error) {
    console.error("Failed to send SMS via Twilio:", error);
  }
};
