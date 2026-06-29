import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AlertSettings, createDefaultAlertSettings } from '@/lib/models/AlertSettings';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const authenticateAdmin = async (request: NextRequest) => {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { error: 'No auth token found', status: 401, user: null, db: null };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
  } catch (error) {
    return { error: 'Invalid token', status: 401, user: null, db: null };
  }

  if (!decoded.userId) {
    return { error: 'Invalid token', status: 401, user: null, db: null };
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
  
  if (!user || !user.role.includes('admin')) {
    return { error: 'Access denied', status: 403, user: null, db: null };
  }

  return { error: null, status: 200, user, db };
};

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth.error || !auth.db) {
      return NextResponse.json(
        { error: auth.error || 'Database connection failed' },
        { status: auth.status }
      );
    }

    const { db } = auth;
    const alertSettingsCollection = db.collection('alertsettings');

    // Get the single alert settings document (there should only be one)
    let settings = await alertSettingsCollection.findOne({});

    // If no settings exist, create default ones
    if (!settings) {
      const defaultSettings = {
        ...createDefaultAlertSettings(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await alertSettingsCollection.insertOne(defaultSettings);
      settings = { ...defaultSettings, _id: result.insertedId };
    }

    return NextResponse.json({
      success: true,
      settings,
    });

  } catch (error) {
    console.error('Get alert settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth.error || !auth.db) {
      return NextResponse.json(
        { error: auth.error || 'Database connection failed' },
        { status: auth.status }
      );
    }

    const { db } = auth;
    const alertSettingsCollection = db.collection('alertsettings');

    const body = await request.json();
    const {
      muted,
      volume,
      globalSound,
      pollingInterval,
      desktopNotifs,
      events,
    } = body;

    // Validate required fields
    if (typeof muted !== 'boolean' ||
        typeof volume !== 'number' ||
        typeof globalSound !== 'string' ||
        typeof pollingInterval !== 'number' ||
        typeof desktopNotifs !== 'boolean' ||
        !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const updateData = {
      muted,
      volume,
      globalSound,
      pollingInterval,
      desktopNotifs,
      events,
      updatedAt: new Date(),
    };

    // Update or insert the settings
    const result = await alertSettingsCollection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Alert settings updated successfully',
    });

  } catch (error) {
    console.error('Update alert settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update alert settings' },
      { status: 500 }
    );
  }
}
