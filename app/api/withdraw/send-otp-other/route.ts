import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { generateOTP } from '@/lib/models/OtherWithdrawal';
import { sendWithdrawalOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, method, details } = await request.json();

    // Validation
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!method) missingFields.push('method');
    if (!details) missingFields.push('details');

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

    // Generate OTP (not storing to DB yet)
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Send OTP email only (not storing to DB)
    await sendWithdrawalOTP(user.email, user.username, otpCode, amount, method.toUpperCase());

    return NextResponse.json({
      message: 'OTP sent successfully',
      otpCode, // In production, you might want to encrypt this or use a different approach
      otpExpires: otpExpires.toISOString()
    });
  } catch (error) {
    console.error('Error sending other withdrawal OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
