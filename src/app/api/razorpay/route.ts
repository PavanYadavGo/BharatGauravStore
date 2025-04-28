// app/api/razorpay/route.ts

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Incoming body:', body);

    const { amount } = body;

    if (!amount) {
      console.error('Amount not provided');
      return new Response(JSON.stringify({ error: "Amount is required" }), { status: 400 });
    }

    // ✅ Dynamic import Razorpay only inside the function
    const Razorpay = (await import('razorpay')).default;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order);

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error: any) {
    console.error('❌ Error creating Razorpay order:', error);
    return new Response(JSON.stringify({ error: "Failed to create Razorpay order", details: error.message }), { status: 500 });
  }
}
