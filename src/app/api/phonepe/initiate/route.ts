// app/api/phonepe/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, userId } = body;

  const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;
  const CLIENT_ID = process.env.PHONEPE_CLIENT_ID!;
  const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;
  const BASE_URL = process.env.PHONEPE_BASE_URL!;
  const REDIRECT_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/callback`;

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: `TXN_${Date.now()}`,
    merchantUserId: userId,
    amount: amount * 100,
    redirectUrl: REDIRECT_URL,
    redirectMode: 'POST',
    mobileNumber: '9999999999',
    paymentInstrument: { type: 'PAY_PAGE' },
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const checksum = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(`${payloadBase64}/pg/v1/pay${CLIENT_SECRET}`)
    .digest('hex');

  const response = await fetch(`${BASE_URL}/pg/v1/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': `${checksum}###1`,
      'X-CLIENT-ID': CLIENT_ID,
    },
    body: JSON.stringify({ request: payloadBase64 }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
