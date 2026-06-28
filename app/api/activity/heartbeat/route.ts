import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { UserActivity, UserStatus } from '@/lib/models/UserActivity';

// POST - Update heartbeat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, status } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const activityCollection = db.collection<UserActivity>('userActivity');

    const updateData: Partial<UserActivity> = {
      lastHeartbeat: new Date(),
      lastActivity: new Date(),
      updatedAt: new Date(),
    };

    if (status && ['online', 'offline', 'away'].includes(status)) {
      updateData.status = status as UserStatus;
    }

    // Find by sessionId only (allow anonymous users)
    const result = await activityCollection.updateOne(
      { sessionId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
