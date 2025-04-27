// src/app/api/razorpay/route.js

import Razorpay from 'razorpay';

export async function POST(req) {
  try {
    const body = await req.json();
    const amount = body.amount;

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return new Response(JSON.stringify({ error: error.message || "Order creation failed" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
