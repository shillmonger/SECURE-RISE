import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { UserActivity, ActivityEventInput, ActivityEvent } from '@/lib/models/UserActivity';

// POST - Log activity event
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ActivityEventInput & { sessionId: string } = await request.json();
    const { sessionId, action, category, page, metadata } = body;

    if (!sessionId || !action || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const activityCollection = db.collection<UserActivity>('userActivity');

    const newEvent: ActivityEvent = {
      time: new Date().toTimeString().split(' ')[0],
      action,
      category,
      page,
      metadata,
    };

    // Add event to activityEvents array, keeping only last 50 events
    const result = await activityCollection.updateOne(
      { sessionId, userId: authUser.userId },
      { 
        $set: { 
          lastActivity: new Date(),
          updatedAt: new Date(),
        },
        $push: { 
          activityEvents: { 
            $each: [newEvent],
            $slice: -50 // Keep only last 50 events
          } 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event logging error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
