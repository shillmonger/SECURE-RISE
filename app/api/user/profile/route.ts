import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { client } = await connectToDatabase();
    const db = client.db();

    // Get user
    const user = await db.collection<User>('users').findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data without sensitive information
    const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;

    return NextResponse.json({ 
      user: safeUser,
      success: true 
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user profile' 
    }, { status: 500 });
  }
}
