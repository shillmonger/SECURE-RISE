import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, resetCode } = await request.json();

    // Validation
    if (!email || !resetCode) {
      return NextResponse.json(
        { error: 'Email and reset code are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const usersCollection = db.collection('users');

    // Find user by email and reset token
    const user = await usersCollection.findOne({
      email,
      resetPasswordToken: resetCode,
      resetPasswordExpires: { $gt: new Date() } // Token not expired
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully'
    });

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
