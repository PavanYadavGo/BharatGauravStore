import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount, transactionId, userId } = await req.json();

  const clientId = process.env.PHONEPE_CLIENT_ID!;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET!;

  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    // Step 1: Get Access Token
    const tokenRes = await fetch('https://api-preprod.phonepe.com/apis/hermes/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64Credentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    // Step 2: Create Payment
    const paymentResponse = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/v1/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        merchantId: clientId,
        transactionId,
        amount: amount * 100,
        merchantUserId: userId,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success`,
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/webhook`,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      }),
    });

    const paymentData = await paymentResponse.json();

    if (paymentData.success && paymentData.data?.redirectInfo?.url) {
      return NextResponse.json({ redirectUrl: paymentData.data.redirectInfo.url });
    } else {
      return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
    }
  } catch (err) {
    console.error('PhonePe Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
