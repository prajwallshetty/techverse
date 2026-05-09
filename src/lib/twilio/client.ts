import twilio from 'twilio';

// Use a singleton pattern to prevent multiple instances during hot-reloads in dev
const globalForTwilio = global as unknown as { twilioClient: twilio.Twilio };

export const twilioClient =
  globalForTwilio.twilioClient ||
  twilio(
    process.env.TWILIO_ACCOUNT_SID || 'AC00000000000000000000000000000000',
    process.env.TWILIO_AUTH_TOKEN || 'dummy_token'
  );

if (process.env.NODE_ENV !== 'production') globalForTwilio.twilioClient = twilioClient;

// Helper to generate TwiML responses easily
export const VoiceResponse = twilio.twiml.VoiceResponse;
