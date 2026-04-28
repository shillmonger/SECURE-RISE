import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { client } = await connectToDatabase();
    const db = client.db();

    // Get user
    const user = await db.collection('users').findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get active trades/investments count
    const activeTrades = await db.collection('investments')
      .countDocuments({ 
        userId: user._id,
        status: 'active'
      });

    // Determine verification status based on user data
    let verificationStatus = 'Pending';
    if (user.isVerified) {
      verificationStatus = 'Verified';
    } else if (user.verificationSubmitted) {
      verificationStatus = 'Under Review';
    }

    return NextResponse.json({
      success: true,
      data: {
        verificationStatus,
        activeTrades
      }
    });

  } catch (error) {
    console.error('Error fetching account summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account summary' },
      { status: 500 }
    );
  }
}
