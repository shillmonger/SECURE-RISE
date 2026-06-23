import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { XPRedemption } from '@/lib/models/XPRedemption';
import { sendXPRedemptionEmail } from '@/lib/email';

const CONVERSION_RATE = 0.02; // 100 XP = $2

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No auth token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { xpType, xpAmount } = body;

    if (!xpType || !['daily', 'achievement'].includes(xpType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid XP type' },
        { status: 400 }
      );
    }

    if (!xpAmount || xpAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid XP amount' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const userObjectId = new ObjectId(userId);

    // Fetch user data
    const user = await db.collection('users').findOne({ _id: userObjectId });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check XP balance based on type
    let currentXPBalance = 0;
    let xpCollectionName = '';

    if (xpType === 'daily') {
      const userXP = await db.collection('userxp').findOne({ userId: userObjectId });
      currentXPBalance = userXP?.totalXP || 0;
      xpCollectionName = 'userxp';
    } else {
      const userAchievements = await db.collection('userachievements').findOne({ userId: userObjectId });
      currentXPBalance = userAchievements?.totalXP || 0;
      xpCollectionName = 'userachievements';
    }

    if (currentXPBalance < xpAmount) {
      return NextResponse.json(
        { success: false, message: `Insufficient ${xpType} XP balance` },
        { status: 400 }
      );
    }

    // Calculate USDT amount
    const usdtAmount = xpAmount * CONVERSION_RATE;

    // Generate transaction ID
    const transactionId = `XPR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Start transaction - debit XP, credit USDT, create redemption record
    const session = client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Debit XP from the appropriate collection
        await db.collection(xpCollectionName).updateOne(
          { userId: userObjectId },
          { $inc: { totalXP: -xpAmount }, $set: { updatedAt: new Date() } }
        );

        // Credit USDT to user account balance
        await db.collection('users').updateOne(
          { _id: userObjectId },
          { $inc: { accountBalance: usdtAmount }, $set: { updatedAt: new Date() } }
        );

        // Create redemption history record
        const redemptionRecord: Omit<XPRedemption, '_id'> = {
          userId: userObjectId,
          xpType: xpType as 'daily' | 'achievement',
          xpAmount,
          usdtAmount,
          conversionRate: CONVERSION_RATE,
          transactionId,
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection('xpredemptions').insertOne(redemptionRecord);
      });

      // Send email notification
      try {
        await sendXPRedemptionEmail(user.email, user.username, {
          xpType,
          xpAmount,
          usdtAmount,
          transactionId,
        });
      } catch (emailError) {
        console.error('Failed to send redemption email:', emailError);
        // Don't fail the transaction if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'XP redemption successful',
        data: {
          transactionId,
          xpAmount,
          usdtAmount,
          conversionRate: CONVERSION_RATE,
        }
      });

    } catch (transactionError) {
      console.error('Transaction error:', transactionError);
      return NextResponse.json(
        { success: false, message: 'Transaction failed' },
        { status: 500 }
      );
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error('Error processing XP redemption:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
