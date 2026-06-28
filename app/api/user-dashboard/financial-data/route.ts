import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAuthUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    // Use getAuthUser which supports both custom token and NextAuth session
    const authUser = await getAuthUser(request);

    if (!authUser?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database and fetch user
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ _id: new ObjectId(authUser.userId) }) as User;
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      financialData: {
        accountBalance: user.accountBalance,
        welcomeBonus: user.welcomeBonus,
        totalProfits: user.totalProfits,
        totalWithdrawal: user.totalWithdrawal,
        totalDeposit: user.totalDeposit,
        fullName: user.fullName || user.username,
        country: user.country,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error('Error fetching financial data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
