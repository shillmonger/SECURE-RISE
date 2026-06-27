import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { creditWalletAfterDeposit } from '@/lib/wallet-helpers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Paystack Webhook Received ===');
    
    // Get Paystack signature from headers
    const signature = request.headers.get('x-paystack-signature');
    console.log('Signature present:', !!signature);
    
    if (!signature) {
      console.error('Missing Paystack signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();
    console.log('Raw body length:', rawBody.length);

    // Verify signature
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    console.log('Secret key configured:', !!secretKey);
    
    if (!secretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    const hmac = crypto.createHmac('sha512', secretKey);
    hmac.update(rawBody);
    const digest = hmac.digest('hex');

    console.log('Signature match:', digest === signature);

    if (digest !== signature) {
      console.error('Invalid Paystack signature');
      console.log('Expected digest:', digest);
      console.log('Received signature:', signature);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook event
    const event = JSON.parse(rawBody);
    console.log('Event type:', event.event);
    console.log('Event data:', JSON.stringify(event.data, null, 2));

    // Only process charge.success events
    if (event.event !== 'charge.success') {
      console.log('Ignoring non-charge.success event:', event.event);
      return NextResponse.json({ received: true });
    }

    const eventData = event.data;
    const reference = eventData.reference;

    console.log('Processing reference:', reference);

    if (!reference) {
      console.error('Missing reference in webhook data');
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const paystackCollection = db.collection('paystackTransactions');

    // Check if transaction already processed (prevent duplicate processing)
    const existingTransaction = await paystackCollection.findOne({ reference });

    console.log('Transaction found:', !!existingTransaction);
    console.log('Transaction status:', existingTransaction?.status);

    if (!existingTransaction) {
      console.error('Transaction not found:', reference);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (existingTransaction.status === 'processed') {
      console.log('Transaction already processed:', reference);
      return NextResponse.json({ received: true });
    }

    // Update transaction status to success
    await paystackCollection.updateOne(
      { reference },
      {
        $set: {
          status: 'success',
          paystackReference: eventData.reference,
          paystackTransactionId: eventData.id?.toString(),
          customerCode: eventData.customer?.customer_code,
          metadata: eventData.metadata,
          updatedAt: new Date(),
        },
      }
    );

    console.log('Transaction updated to success');

    // Credit user wallet using ONLY the stored USD amount
    // The NGN amount is only for payment processing, not for wallet crediting
    console.log('Crediting wallet with USD amount:', existingTransaction.usdAmount);
    
    await creditWalletAfterDeposit({
      db,
      userId: existingTransaction.userId,
      amount: existingTransaction.usdAmount, // Use USD amount, not NGN
      username: existingTransaction.username,
      userEmail: existingTransaction.userEmail,
      paymentMethod: existingTransaction.paymentMethod,
      transactionId: existingTransaction.transactionId,
    });

    console.log('Wallet credited successfully');

    // Mark transaction as processed
    await paystackCollection.updateOne(
      { reference },
      {
        $set: {
          status: 'processed',
          processedAt: new Date(),
        },
      }
    );

    console.log('Paystack payment processed successfully:', reference, 'USD amount credited:', existingTransaction.usdAmount);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
