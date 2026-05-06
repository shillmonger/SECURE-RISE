import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Fetch user's account balance
    const user = await db.collection('users').findOne(
      { email: authUser.email },
      { projection: { accountBalance: 1, username: 1, fullName: 1, email: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      balance: user.accountBalance || 0,
      user: {
        username: user.username,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account balance' },
      { status: 500 }
    );
  }
}
