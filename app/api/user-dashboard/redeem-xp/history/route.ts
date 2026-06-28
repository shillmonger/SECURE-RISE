import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAuthUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

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

    // Connect to database
    const client = await clientPromise;
    const db = client.db('secure-rise');

    // Fetch redemption history
    const redemptions = await db.collection('xpredemptions')
      .find({ userId: new ObjectId(authUser.userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      redemptions,
    });

  } catch (error) {
    console.error('Error fetching redemption history:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
