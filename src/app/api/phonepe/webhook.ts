// File: /pages/api/phonepe/webhook.ts
export default async function handler(req, res) {
    console.log('PhonePe Webhook Hit:', req.body);
    res.status(200).json({ status: 'received' });
  }
  