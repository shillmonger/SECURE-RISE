import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
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

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');
    
    // Fetch user data for account balance
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) }) as User;
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user XP data (daily streak XP)
    const userXP = await db.collection('userxp').findOne({ userId: new ObjectId(userId) });
    const dailyXP = userXP?.totalXP || 0;

    // Fetch user achievements XP
    const userAchievements = await db.collection('userachievements').findOne({ userId: new ObjectId(userId) });
    const achievementXP = userAchievements?.totalXP || 0;

    return NextResponse.json({
      success: true,
      data: {
        accountBalance: user.accountBalance,
        dailyXP: dailyXP,
        achievementXP: achievementXP,
        conversionRate: 0.02, // 100 XP = $2
      }
    });

  } catch (error) {
    console.error('Error fetching XP balance data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
