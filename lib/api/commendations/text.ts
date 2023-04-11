import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_SECRET;

const client = twilio(
  apiKey, apiSecret, { accountSid }
);

export const sendBzText = async (
  recipientNumber: string, senderName: string, message: string
) => {
  let messageSplit = message.split(" ");
  await client.messages.create({
    body: "You received a BZ Commendation!\n\n" + 
            messageSplit.slice(0, 30).join(" ") + (messageSplit.length > 30 ? "..." : "") + "\n\n--" + 
            senderName + "\n" + "(bz-cedarville.com)",
    from: process.env.TWILIO_NUMBER,
    to: recipientNumber
  });
};