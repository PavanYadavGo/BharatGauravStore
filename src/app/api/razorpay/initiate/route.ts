import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay environment variables');
      return NextResponse.json(
        { success: false, error: 'Razorpay configuration missing' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { amount, userId } = body;

    // Validate request body
    if (!amount || !userId) {
      console.error('Missing required fields:', { amount, userId });
      return NextResponse.json(
        { success: false, error: 'Missing amount or user ID' },
        { status: 400 }
      );
    }

    // Validate amount
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(parsedAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Razorpay initiate error:', {
      message: error.message || 'Unknown error',
      code: error.code,
      status: error.status,
      details: error.description || error.reason,
    });
    return NextResponse.json(
      {
        success: false,
        error: `Failed to initiate Razorpay payment: ${error.message || 'Server error'}`,
      },
      { status: error.status || 500 }
    );
  }
}