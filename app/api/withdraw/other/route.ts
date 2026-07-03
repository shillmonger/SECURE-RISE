import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { OtherWithdrawal, generateOtherWithdrawalId, generateOTP } from '@/lib/models/OtherWithdrawal';
import { sendWithdrawalNotificationToAdmins } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, fee, receiveAmount, method, details, otp, otpExpires } = await request.json();

    // Validation
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!method) missingFields.push('method');
    if (!details) missingFields.push('details');
    if (!otp) missingFields.push('otp');

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is $100' }, { status: 400 });
    }

    if (amount > 10000) {
      return NextResponse.json({ error: 'Maximum withdrawal amount is $10,000' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const otherWithdrawalsCollection = db.collection('otherWithdrawals');
    const depositsCollection = db.collection('deposits');

    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has at least one deposit
    const userDeposits = await depositsCollection.findOne({ userId: user._id });
    if (!userDeposits) {
      return NextResponse.json({ error: 'You must have at least one deposit on the platform to make a withdrawal' }, { status: 400 });
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
    const withdrawalId = generateOtherWithdrawalId();

    // Create withdrawal record
    const withdrawalData: OtherWithdrawal = {
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      amount,
      fee,
      receiveAmount,
      method,
      details,
      status: 'pending',
      withdrawalId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await otherWithdrawalsCollection.insertOne(withdrawalData);

    // Send notification to admins
    await sendWithdrawalNotificationToAdmins({
      withdrawalId,
      username: user.username,
      userEmail: user.email,
      amount,
      crypto: { name: method.toUpperCase(), symbol: method, icon: '' },
      destinationAddress: JSON.stringify(details)
    });

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      withdrawalId
    });
  } catch (error) {
    console.error('Error creating other withdrawal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
