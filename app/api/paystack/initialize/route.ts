import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { createPaystackTransaction } from '@/lib/models/PaystackTransaction';
import { ObjectId } from 'mongodb';

const MIN_DEPOSIT_USD = 10;
const MAX_DEPOSIT_USD = 10000;

// Fallback exchange rate if API fails
const FALLBACK_EXCHANGE_RATE = 1600;

async function fetchFromFrankfurter(): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=NGN', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Frankfurter API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates || !data.rates.NGN) {
      throw new Error('Invalid exchange rate data structure');
    }

    return data.rates.NGN;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchFromExchangerateAPI(): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ExchangeRate-API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates || !data.rates.NGN) {
      throw new Error('Invalid exchange rate data structure');
    }

    return data.rates.NGN;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

const fetchExchangeRate = async (): Promise<number> => {
  // Try Frankfurter API first
  try {
    const rate = await fetchFromFrankfurter();
    console.log('Fetched rate from Frankfurter:', rate);
    return rate;
  } catch (error) {
    console.error('Frankfurter API failed, trying backup:', error);
    
    // Try backup API
    try {
      const rate = await fetchFromExchangerateAPI();
      console.log('Fetched rate from ExchangeRate-API:', rate);
      return rate;
    } catch (backupError) {
      console.error('Backup API also failed, using fallback:', backupError);
      
      // Use fallback rate
      console.log('Using fallback exchange rate:', FALLBACK_EXCHANGE_RATE);
      return FALLBACK_EXCHANGE_RATE;
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usdAmount, userId, username, userEmail } = body;

    // Validate required fields
    if (!usdAmount || !userId || !username || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate USD amount
    const numUsdAmount = parseFloat(usdAmount);
    if (isNaN(numUsdAmount) || numUsdAmount < MIN_DEPOSIT_USD) {
      return NextResponse.json(
        { error: `Amount must be at least $${MIN_DEPOSIT_USD.toLocaleString()}` },
        { status: 400 }
      );
    }

    if (numUsdAmount > MAX_DEPOSIT_USD) {
      return NextResponse.json(
        { error: `Amount cannot exceed $${MAX_DEPOSIT_USD.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Fetch live exchange rate from Frankfurter API
    let exchangeRate: number;
    try {
      exchangeRate = await fetchExchangeRate();
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      return NextResponse.json(
        { error: 'Failed to fetch exchange rate. Please try again.' },
        { status: 500 }
      );
    }

    // Calculate NGN amount
    const ngnAmount = numUsdAmount * exchangeRate;

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

    // Call Paystack Initialize Transaction API with NGN amount in kobo
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        amount: Math.round(ngnAmount * 100), // Convert NGN to kobo (multiply by 100)
        reference,
        metadata: {
          userId,
          username,
          usdAmount: numUsdAmount,
          exchangeRate,
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
      usdAmount: numUsdAmount,
      ngnAmount,
      exchangeRate,
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
      exchangeRate,
      ngnAmount,
      usdAmount: numUsdAmount,
    });

  } catch (error) {
    console.error('Paystack initialize error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
