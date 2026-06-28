import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { CreateActivitySession, UpdateActivitySession, UserActivity } from '@/lib/models/UserActivity';

// POST - Create or update user session
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateActivitySession = await request.json();
    const { sessionId, currentPage, currentRoute, currentUrl, device, browser, operatingSystem, country, city, ipAddress } = body;

    if (!sessionId || !currentPage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const activityCollection = db.collection<UserActivity>('userActivity');

    // Check if session already exists
    const existingSession = await activityCollection.findOne({ sessionId });

    if (existingSession) {
      // Update existing session
      const updateData: Partial<UserActivity> = {
        currentPage,
        currentRoute,
        currentUrl,
        lastActivity: new Date(),
        updatedAt: new Date(),
      };

      // Add page to visited pages if not already there
      if (!existingSession.pagesVisited.includes(currentPage)) {
        updateData.pagesVisited = [...existingSession.pagesVisited, currentPage];
      }

      await activityCollection.updateOne(
        { sessionId },
        { $set: updateData }
      );

      return NextResponse.json({ success: true, session: existingSession });
    }

    // Create new session
    const newSession: Omit<UserActivity, '_id'> = {
      userId: authUser.userId,
      sessionId,
      currentPage,
      currentRoute,
      currentUrl,
      status: 'online',
      device,
      browser,
      operatingSystem,
      country,
      city,
      ipAddress,
      loginTime: new Date(),
      lastHeartbeat: new Date(),
      lastActivity: new Date(),
      timeOnPage: 0,
      scrollMilestone: 0,
      activityEvents: [],
      pagesVisited: [currentPage],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await activityCollection.insertOne(newSession);

    return NextResponse.json({ 
      success: true, 
      session: { ...newSession, _id: result.insertedId } 
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update session data
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: UpdateActivitySession & { sessionId: string };
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
      }
      body = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { sessionId, ...updateData } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const activityCollection = db.collection<UserActivity>('userActivity');

    const existingSession = await activityCollection.findOne({ 
      sessionId, 
      userId: authUser.userId 
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const updatePayload: Partial<UserActivity> = {
      ...updateData,
      lastActivity: new Date(),
      updatedAt: new Date(),
    };

    // Add page to visited pages if provided
    if (updateData.currentPage && !existingSession.pagesVisited.includes(updateData.currentPage)) {
      updatePayload.pagesVisited = [...existingSession.pagesVisited, updateData.currentPage];
    }

    await activityCollection.updateOne(
      { sessionId, userId: authUser.userId },
      { $set: updatePayload }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
