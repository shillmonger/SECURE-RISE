import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
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
        { error: auth.error || 'Authentication failed' },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { db } = auth;
    const conversationsCollection = db.collection('chatConversations');

    // Find conversation for this user
    const conversation = await conversationsCollection.findOne({ 
      userId: userId 
    });

    if (!conversation) {
      return NextResponse.json({
        success: true,
        messages: [],
      });
    }

    // Mark all user messages as read when admin fetches messages
    await conversationsCollection.updateOne(
      { userId: userId },
      {
        $set: {
          unreadCount: 0,
        },
      }
    );

    // Return messages in the format expected by the admin frontend
    const messages = conversation.messages.map((msg: any) => ({
      id: msg.id,
      sender: msg.sender,
      text: msg.text,
      createdAt: msg.timestamp,
      read: msg.read || false,
      status: msg.status,
    }));

    return NextResponse.json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
