import { NextRequest, NextResponse } from 'next/server';
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

    // Connect to database and fetch users
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const usersCollection = db.collection('users');
    
    // Fetch all active users, sort by accountBalance (descending)
    const users = await usersCollection
      .find({ isActive: true })
      .project({
        _id: 1,
        username: 1,
        email: 1,
        accountBalance: 1,
        totalDeposit: 1,
        totalWithdrawal: 1,
        profileImage: 1,
        fullName: 1
      })
      .sort({ accountBalance: -1 })
      .toArray() as User[];

    // Transform data for leaderboard
    const leaderboardData = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      email: user.email,
      balance: user.accountBalance,
      totalDeposit: user.totalDeposit,
      totalWithdrawal: user.totalWithdrawal,
      profileImage: user.profileImage || "https://github.com/shadcn.png",
      fullName: user.fullName || user.username
    }));

    // Get top 3 for podium
    const topThree = leaderboardData.slice(0, 3).map(user => ({
      rank: user.rank,
      username: user.username,
      avatar: user.profileImage,
      metric: user.balance,
      metricName: "Account Balance"
    }));

    return NextResponse.json({
      success: true,
      data: {
        topThree,
        leaderboard: leaderboardData
      }
    });

  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
