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

    const { db } = auth;
    const conversationsCollection = db.collection('chatConversations');

    // Fetch all conversations, sorted by last message time
    const conversations = await conversationsCollection
      .find({})
      .sort({ lastMessageAt: -1 })
      .toArray();

    // Transform to the format expected by the admin frontend
    const formattedConversations = conversations.map((conv: any) => ({
      userId: conv.userId,
      userName: conv.userName,
      userEmail: conv.userEmail,
      avatarUrl: conv.avatarUrl,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt,
      unreadCount: conv.unreadCount,
      online: conv.online || false,
    }));

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
    });

  } catch (error) {
    console.error('Fetch conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
