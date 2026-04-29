import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { Withdrawal, generateWithdrawalId, generateOTP } from '@/lib/models/Withdrawal';
import { sendWithdrawalOTP, sendWithdrawalNotificationToAdmins } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const withdrawalsCollection = db.collection('withdrawals');

    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's withdrawal history
    const withdrawals = await withdrawalsCollection
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      accountBalance: user.accountBalance,
      cryptoAddresses: user.cryptoAddresses || [],
      withdrawals: withdrawals.map(w => ({
        id: w.withdrawalId,
        amount: w.amount,
        method: w.crypto.symbol,
        status: w.status,
        date: w.createdAt.toLocaleDateString(),
        destinationAddress: w.destinationAddress
      }))
    });
  } catch (error) {
    console.error('Error fetching withdrawal data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, crypto, destinationAddress, otp } = await request.json();

    // Validation
    if (!amount || !crypto || !destinationAddress || !otp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is $100' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const withdrawalsCollection = db.collection('withdrawals');

    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has sufficient balance
    if (amount > user.accountBalance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Check if there's a pending withdrawal with OTP
    const pendingWithdrawal = await withdrawalsCollection.findOne({
      userId: user._id,
      status: 'pending',
      otpCode: otp,
      otpExpires: { $gt: new Date() }
    });

    if (!pendingWithdrawal) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Update withdrawal status to pending (awaiting admin approval)
    await withdrawalsCollection.updateOne(
      { _id: pendingWithdrawal._id },
      {
        $set: {
          status: 'pending',
          amount,
          crypto,
          destinationAddress,
          updatedAt: new Date(),
          otpCode: undefined, // Clear OTP after successful verification
          otpExpires: undefined
        }
      }
    );

    // Send notification to admins
    await sendWithdrawalNotificationToAdmins({
      withdrawalId: pendingWithdrawal.withdrawalId,
      username: user.username,
      userEmail: user.email,
      amount,
      crypto,
      destinationAddress
    });

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      withdrawalId: pendingWithdrawal.withdrawalId
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
