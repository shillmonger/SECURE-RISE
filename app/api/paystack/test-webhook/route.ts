import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { creditWalletAfterDeposit } from '@/lib/wallet-helpers';

/**
 * TEST ENDPOINT - Manually trigger wallet crediting for a pending Paystack transaction
 * This is for testing purposes only. In production, the webhook will handle this automatically.
 * 
 * Usage: POST /api/paystack/test-webhook
 * Body: { reference: "SECURE-..." }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const paystackCollection = db.collection('paystackTransactions');

    // Find the transaction
    const transaction = await paystackCollection.findOne({ reference });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status === 'processed') {
      return NextResponse.json({
        success: true,
        message: 'Transaction already processed',
        transaction,
      });
    }

    // Update status to success
    await paystackCollection.updateOne(
      { reference },
      {
        $set: {
          status: 'success',
          updatedAt: new Date(),
        },
      }
    );

    // Credit user wallet
    await creditWalletAfterDeposit({
      db,
      userId: transaction.userId,
      amount: transaction.usdAmount,
      username: transaction.username,
      userEmail: transaction.userEmail,
      paymentMethod: transaction.paymentMethod,
      transactionId: transaction.transactionId,
    });

    // Mark as processed
    await paystackCollection.updateOne(
      { reference },
      {
        $set: {
          status: 'processed',
          processedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Wallet credited successfully',
      usdAmount: transaction.usdAmount,
      transactionId: transaction.transactionId,
    });

  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process test webhook' },
      { status: 500 }
    );
  }
}
