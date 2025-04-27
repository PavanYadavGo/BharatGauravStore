import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Incoming body:', body);

    const amount = body.amount;

    if (!amount) {
      console.error('Amount not provided');
      return new Response(JSON.stringify({ error: "Amount is required" }), { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: "rzp_live_OKaRaDsj2qgqx5",
      key_secret: "ixDQQB8jcFjyXju7uAMF6vDX",
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    console.log('Creating order with options:', options);

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order);

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error: any) {
    console.error('❌ Error creating Razorpay order:', error);
    console.error('❌ Full error:', JSON.stringify(error));

    return new Response(JSON.stringify({ error: "Failed to create Razorpay order", details: error }), { status: 500 });
  }
}
