import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    try {
        console.log('Received request to initiate Razorpay payment');

        // Validate environment variables
        console.log('Checking environment variables...');
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('Missing Razorpay environment variables', {
                keyIdExists: !!process.env.RAZORPAY_KEY_ID,
                keySecretExists: !!process.env.RAZORPAY_KEY_SECRET,
            });
            return NextResponse.json(
                { success: false, error: 'Razorpay configuration missing' },
                { status: 500 }
            );
        }
        console.log('Environment variables validated successfully');

        let razorpay;
        try {
            console.log('Initializing Razorpay instance...');
            razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
            console.log('Razorpay instance initialized successfully');
        } catch (error: any) {
            console.error('Razorpay initialization error:', {
                message: error.message || 'Failed to initialize Razorpay',
                code: error.code,
            });
            return NextResponse.json(
                { success: false, error: 'Invalid Razorpay configuration' },
                { status: 500 }
            );
        }

        // Test Razorpay credentials by fetching orders (compatible with all SDK versions)
        console.log('Testing Razorpay credentials by fetching orders...');
        try {
            const orders = await razorpay.orders.all({ count: 1 });
            console.log('Razorpay credentials test successful:', orders);
        } catch (error: any) {
            console.error('Razorpay credentials test failed:', {
                message: error.message || 'Failed to fetch orders',
                code: error.code,
                status: error.status,
                description: error.description,
                reason: error.reason,
            });
            return NextResponse.json(
                { success: false, error: 'Razorpay credentials test failed: Invalid or inactive API keys' },
                { status: 500 }
            );
        }

        console.log('Parsing request body...');
        const body = await req.json();
        const { amount, userId } = body;
        console.log('Request body parsed:', { amount, userId });

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
        console.log('Amount validated:', parsedAmount);

        console.log('Creating Razorpay order with params:', {
            amount: Math.round(parsedAmount * 100),
            currency: 'INR',
            receipt: `order_${userId}_${Date.now()}`,
        });
        let order;
        try {
            order = await razorpay.orders.create({
                amount: Math.round(parsedAmount * 100), // Convert to paise
                currency: 'INR',
                receipt: `order_${userId}_${Date.now()}`,
            });
            console.log('Razorpay order created successfully:', order);
            return NextResponse.json({ success: true, order });

        } catch (error: any) {
            console.error('Detailed Razorpay order creation error:', {
                message: error.message || 'Failed to create order',
                code: error.code,
                status: error.status,
                description: error.description,
                reason: error.reason,
                source: error.source,
                step: error.step,
                metadata: error.metadata,
            });

            // Attempt minimal order creation for debugging
            try {
                const minimalOrder = await razorpay.orders.create({
                    amount: Math.round(parsedAmount * 100),
                    currency: 'INR',
                });
                console.log('Minimal Razorpay order created:', minimalOrder);
                return NextResponse.json({ success: true, order: minimalOrder });

            } catch (minimalError: any) {
                console.error('Minimal Razorpay order creation failed:', minimalError);
                console.error('Minimal Razorpay error details:', {
                    message: minimalError.message,
                    code: minimalError.code,
                    status: minimalError.status,
                    description: minimalError.description,
                    reason: minimalError.reason
                });
                // *IMPORTANT*:  Include the minimal error details in the response.
                return NextResponse.json(
                    {
                        success: false,
                        error: `Failed to initiate Razorpay payment: ${error.message || 'Server error'}.  Minimal Order Creation Also Failed.`,
                        minimalError: {  // Include the minimalError object
                            message: minimalError.message,
                            code: minimalError.code,
                            status: minimalError.status,
                            description: minimalError.description,
                            reason: minimalError.reason
                        }
                    },
                    { status: error.status || 500 }  // Use the original error's status if available
                );
            }
        }


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

