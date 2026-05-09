import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { UserXP, createDefaultUserXP, DailyClaim } from '@/lib/models/UserXP';

// GET /api/user/xp - Fetch user XP data
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

    // Connect to database and fetch user XP
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const userXpCollection = db.collection('userxp');
    
    let userXP = await userXpCollection.findOne({ userId: new ObjectId(userId) }) as UserXP;
    
    // Create default XP record if not found
    if (!userXP) {
      const defaultXP = createDefaultUserXP(new ObjectId(userId));
      await userXpCollection.insertOne({
        ...defaultXP,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      userXP = { ...defaultXP, _id: new ObjectId(), createdAt: new Date(), updatedAt: new Date() };
    }

    return NextResponse.json({
      success: true,
      userXP: {
        id: userXP._id,
        userId: userXP.userId,
        totalXP: userXP.totalXP,
        achievementsUnlocked: userXP.achievementsUnlocked,
        dailyClaims: userXP.dailyClaims,
        currentStreak: userXP.currentStreak,
        longestStreak: userXP.longestStreak,
        updatedAt: userXP.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching user XP:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user/xp - Claim daily XP
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

    const { date } = await request.json();
    
    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const userXpCollection = db.collection('userxp');
    
    let userXP = await userXpCollection.findOne({ userId: new ObjectId(userId) }) as UserXP;
    
    // Create default XP record if not found
    if (!userXP) {
      const defaultXP = createDefaultUserXP(new ObjectId(userId));
      await userXpCollection.insertOne({
        ...defaultXP,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      userXP = { ...defaultXP, _id: new ObjectId(), createdAt: new Date(), updatedAt: new Date() };
    }

    // Check if already claimed for this date
    const dailyClaims = userXP.dailyClaims || [];
    const existingClaim = dailyClaims.find(claim => claim.date === date);
    if (existingClaim && existingClaim.claimed) {
      return NextResponse.json(
        { success: false, message: 'XP already claimed for this date' },
        { status: 400 }
      );
    }

    // Add new claim
    const dailyXP = 100;
    const newClaim: DailyClaim = {
      date,
      claimed: true,
      xp: dailyXP,
      claimedAt: new Date()
    };

    // Update daily claims
    const updatedClaims = existingClaim 
      ? dailyClaims.map(claim => claim.date === date ? newClaim : claim)
      : [...dailyClaims, newClaim];

    // Calculate streak
    const sortedClaims = updatedClaims
      .filter(claim => claim.claimed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentStreak = 0;
    let longestStreak = userXP.longestStreak;
    
    // Calculate current streak from the end
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = sortedClaims.length - 1; i >= 0; i--) {
      const claimDate = new Date(sortedClaims[i].date);
      claimDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    // Update user XP
    const updatedXP = {
      ...userXP,
      totalXP: userXP.totalXP + dailyXP,
      dailyClaims: updatedClaims,
      currentStreak,
      longestStreak,
      updatedAt: new Date()
    };

    await userXpCollection.updateOne(
      { _id: userXP._id },
      { $set: updatedXP }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully claimed ${dailyXP} XP!`,
      userXP: {
        id: updatedXP._id,
        userId: updatedXP.userId,
        totalXP: updatedXP.totalXP,
        achievementsUnlocked: updatedXP.achievementsUnlocked,
        dailyClaims: updatedXP.dailyClaims,
        currentStreak: updatedXP.currentStreak,
        longestStreak: updatedXP.longestStreak,
        updatedAt: updatedXP.updatedAt
      }
    });

  } catch (error) {
    console.error('Error claiming daily XP:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
