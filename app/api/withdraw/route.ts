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

    const { amount, crypto, destinationAddress, otp, otpExpires } = await request.json();

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
    const depositsCollection = db.collection('deposits');

    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has at least one approved deposit
    const userDeposits = await depositsCollection.findOne({ userId: user._id, status: 'approved' });
    if (!userDeposits) {
      return NextResponse.json({ error: 'You must have at least one approved deposit on the platform to make a withdrawal' }, { status: 400 });
    }

    // Check if user has sufficient balance
    if (amount > user.accountBalance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Verify OTP hasn't expired
    if (otpExpires && new Date(otpExpires) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    // Generate withdrawal ID
    const withdrawalId = generateWithdrawalId();

    // Create withdrawal record
    const withdrawalData: Withdrawal = {
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      amount,
      crypto,
      destinationAddress,
      status: 'pending',
      withdrawalId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await withdrawalsCollection.insertOne(withdrawalData);

    // Send notification to admins
    await sendWithdrawalNotificationToAdmins({
      withdrawalId,
      username: user.username,
      userEmail: user.email,
      amount,
      crypto,
      destinationAddress
    });

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      withdrawalId
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
