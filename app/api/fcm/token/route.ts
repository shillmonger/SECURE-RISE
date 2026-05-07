import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only allow admins to check FCM tokens
    if (!user.role.includes('admin')) {
      return NextResponse.json(
        { error: 'Only admins can check FCM tokens' },
        { status: 403 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user has an FCM token
    const userRecord = await usersCollection.findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { fcmToken: 1, fcmTokenUpdatedAt: 1 } }
    );
    
    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      hasToken: !!userRecord.fcmToken,
      token: userRecord.fcmToken,
      updatedAt: userRecord.fcmTokenUpdatedAt
    });

  } catch (error) {
    console.error('Error checking FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to check FCM token' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fcmToken } = await request.json();

    if (!fcmToken) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      );
    }

    // Get current user
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only allow admins to register FCM tokens
    if (!user.role.includes('admin')) {
      return NextResponse.json(
        { error: 'Only admins can register FCM tokens' },
        { status: 403 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Update user's FCM token
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      { 
        $set: { 
          fcmToken,
          fcmTokenUpdatedAt: new Date()
        }
      },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`FCM token updated for admin user: ${user.userId}`);

    return NextResponse.json({
      success: true,
      message: 'FCM token registered successfully'
    });

  } catch (error) {
    console.error('Error registering FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to register FCM token' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get current user
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only allow admins to remove FCM tokens
    if (!user.role.includes('admin')) {
      return NextResponse.json(
        { error: 'Only admins can remove FCM tokens' },
        { status: 403 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Remove user's FCM token
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      { 
        $unset: { 
          fcmToken: '',
          fcmTokenUpdatedAt: ''
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`FCM token removed for admin user: ${user.userId}`);

    return NextResponse.json({
      success: true,
      message: 'FCM token removed successfully'
    });

  } catch (error) {
    console.error('Error removing FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to remove FCM token' },
      { status: 500 }
    );
  }
}
