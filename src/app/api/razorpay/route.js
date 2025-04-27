import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Incoming body:', body); // 👈 LOG HERE
    const amount = body.amount;

    if (!amount) {
      console.error('❌ Amount is missing');
      return new Response(JSON.stringify({ error: "Amount is required" }), { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log('Razorpay keys:', {
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET ? '*****' : '❌ MISSING',
    });

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Order created:', order);

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return new Response(JSON.stringify({ error: "Order creation failed" }), { status: 500 });
  }
}
