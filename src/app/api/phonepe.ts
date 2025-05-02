import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount, userId, name, email, contact } = req.body;

      const merchantId = process.env.PHONEPE_MERCHANT_ID;
      const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // For callback URL

      if (!merchantId || !clientSecret || !baseUrl) {
        return res.status(500).json({ error: 'PhonePe credentials or base URL not configured.' });
      }

      const transactionId = `TXN_${Date.now()}_${userId.substring(0, 8)}`; // Generate a unique transaction ID
      const callbackUrl = `${baseUrl}/api/phonepe/callback`; // Define your callback URL

      const payload = {
        merchantId: merchantId,
        merchantTransactionId: transactionId,
        amount: amount * 100, // Amount in paise
        callbackUrl: callbackUrl,
        mobileNumber: contact,
        deviceOs: 'WEB',
        email: email,
        name: name,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };

      const stringifiedPayload = JSON.stringify(payload);
      const payloadBase64 = Buffer.from(stringifiedPayload).toString('base64');
      const saltKey = clientSecret.substring(0, 32); // PhonePe requires the first 32 characters of the secret
      const stringToHash = `${payloadBase64}/pg/v1/pay${saltKey}`;
      const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
      const checksum = `${sha256Hash}###1`; // Assuming salt index is 1

      const apiUrl = 'https://api.phonepe.com/apis/hermes/pg/v1/pay'; // PhonePe payment initiation API URL

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        body: JSON.stringify({ request: payloadBase64 }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        return res.status(200).json({ redirectUrl: responseData.data.instrumentResponse.redirectInfo.url });
      } else {
        console.error('PhonePe payment initiation failed:', responseData);
        return res.status(400).json({ error: 'PhonePe payment initiation failed.', details: responseData });
      }
    } catch (error: any) {
      console.error('Error initiating PhonePe payment:', error);
      return res.status(500).json({ error: 'Failed to initiate PhonePe payment.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}