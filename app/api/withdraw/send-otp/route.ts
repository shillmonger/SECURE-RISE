import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { Withdrawal, generateWithdrawalId, generateOTP } from '@/lib/models/Withdrawal';
import { sendWithdrawalOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, crypto, destinationAddress } = await request.json();

    // Validation
    if (!amount || !crypto || !destinationAddress) {
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

    // Generate OTP and withdrawal record
    const otpCode = generateOTP();
    const withdrawalId = generateWithdrawalId();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create withdrawal record with OTP
    const withdrawalData: Withdrawal = {
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      amount,
      crypto,
      destinationAddress,
      status: 'pending',
      otpCode,
      otpExpires,
      withdrawalId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await withdrawalsCollection.insertOne(withdrawalData);

    // Send OTP email
    await sendWithdrawalOTP(user.email, user.username, otpCode, amount, crypto.name);

    return NextResponse.json({
      message: 'OTP sent successfully',
      withdrawalId
    });
  } catch (error) {
    console.error('Error sending withdrawal OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
