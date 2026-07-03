import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const otherWithdrawalsCollection = db.collection('otherWithdrawals');

    // Get user from auth
    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's other withdrawals using their actual _id
    const withdrawals = await otherWithdrawalsCollection
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, withdrawals });
  } catch (error) {
    console.error('Error fetching other withdrawals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
