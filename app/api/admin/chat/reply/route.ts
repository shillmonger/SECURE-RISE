import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { createChatMessage } from '@/lib/models/ChatConversation';

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

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth.error || !auth.db) {
      return NextResponse.json(
        { error: auth.error || 'Authentication failed' },
        { status: auth.status }
      );
    }

    const { userId, text, attachment } = await request.json();

    if (!userId || !text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'User ID and message text are required' },
        { status: 400 }
      );
    }

    const { db } = auth;
    const conversationsCollection = db.collection('chatConversations');

    // Find conversation for this user
    const conversation = await conversationsCollection.findOne({ userId });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Create new admin message
    const newMessage = createChatMessage('admin', text.trim(), attachment);

    // Update previous pending user messages to "replied" status
    await conversationsCollection.updateOne(
      { userId },
      {
        $set: {
          'messages.$[elem].status': 'replied',
        },
      },
      {
        arrayFilters: [{ 'elem.sender': 'user', 'elem.status': 'pending' }],
      }
    );

    // Update conversation with new admin message
    await conversationsCollection.updateOne(
      { userId },
      {
        $push: { messages: newMessage as any },
        $set: {
          lastMessage: text.trim(),
          lastMessageAt: newMessage.timestamp,
          lastMessageBy: 'admin',
          status: 'open',
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: newMessage,
    });

  } catch (error) {
    console.error('Send reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
