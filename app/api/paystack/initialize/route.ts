import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { createPaystackTransaction } from '@/lib/models/PaystackTransaction';
import { ObjectId } from 'mongodb';

const MIN_DEPOSIT = 500;
const MAX_DEPOSIT = 5000000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, userId, username, userEmail } = body;

    // Validate required fields
    if (!amount || !userId || !username || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < MIN_DEPOSIT) {
      return NextResponse.json(
        { error: `Amount must be at least ₦${MIN_DEPOSIT.toLocaleString()}` },
        { status: 400 }
      );
    }

    if (numAmount > MAX_DEPOSIT) {
      return NextResponse.json(
        { error: `Amount cannot exceed ₦${MAX_DEPOSIT.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Get Paystack secret key
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Generate unique reference
    const reference = `SECURE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Call Paystack Initialize Transaction API
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        amount: numAmount * 100, // Paystack expects amount in kobo (multiply by 100)
        reference,
        metadata: {
          userId,
          username,
          custom_fields: [
            {
              display_name: 'Username',
              variable_name: 'username',
              value: username,
            },
          ],
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/user-dashboard/bank-transfer`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return NextResponse.json(
        { error: paystackData.message || 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    // Connect to database and save transaction
    const db = await connectToDatabase();
    const paystackCollection = db.collection('paystackTransactions');

    const transactionData = createPaystackTransaction({
      userId: new ObjectId(userId),
      username,
      userEmail,
      amount: numAmount,
      reference,
      authorizationUrl: paystackData.data.authorization_url,
    });

    const result = await paystackCollection.insertOne({
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference,
      transactionId: result.insertedId.toString(),
    });

  } catch (error) {
    console.error('Paystack initialize error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
