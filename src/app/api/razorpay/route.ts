import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = body.amount;

    if (!amount) {
      return new Response(JSON.stringify({ error: "Amount is required" }), { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    return new Response(JSON.stringify({ error: "Order creation failed" }), { status: 500 });
  }
}
