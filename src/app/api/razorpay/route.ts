import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Incoming body:', body);

    const amount = body.amount;

    if (!amount) {
      return new Response(JSON.stringify({ error: "Amount is required" }), { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,      // 👈 NO NEXT_PUBLIC_
      key_secret: process.env.RAZORPAY_KEY_SECRET!,  // 👈 Securely use secret
    });

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Order created:', order);

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error: any) {
    console.error('❌ Error creating Razorpay order:', error.message || error);
    return new Response(JSON.stringify({ error: "Failed to create Razorpay order" }), { status: 500 });
  }
}
