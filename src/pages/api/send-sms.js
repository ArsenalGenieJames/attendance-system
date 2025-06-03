import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ message: 'Phone number and message are required' });
    }

    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phone
    });

    res.status(200).json({ success: true, messageId: result.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS', error: error.message });
  }
} 