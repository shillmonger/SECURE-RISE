import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { createChatMessage, createChatConversation, ChatConversation } from '@/lib/models/ChatConversation';

const authenticateUser = async (request: NextRequest) => {
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
  
  if (!user) {
    return { error: 'User not found', status: 404, user: null, db: null };
  }

  return { error: null, status: 200, user, db };
};

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error || !auth.db || !auth.user) {
      return NextResponse.json(
        { error: auth.error || 'Authentication failed' },
        { status: auth.status }
      );
    }

    const { text, priority, attachment } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    const { db, user } = auth;
    const conversationsCollection = db.collection('chatConversations');

    // Find or create conversation for this user
    let conversation: ChatConversation | null = await conversationsCollection.findOne({ userId: user._id.toString() }) as ChatConversation | null;

    if (!conversation) {
      const newConversation = createChatConversation(
        user._id.toString(),
        user.username || user.fullName || 'Unknown',
        user.email,
        user.avatarUrl
      );
      const result = await conversationsCollection.insertOne(newConversation as any);
      conversation = { ...newConversation, _id: result.insertedId.toString() };
    }

    // Create new message
    const newMessage = createChatMessage('user', text.trim(), attachment);

    // Update conversation with new message
    await conversationsCollection.updateOne(
      { userId: user._id.toString() },
      {
        $push: { messages: newMessage as any },
        $set: {
          lastMessage: text.trim(),
          lastMessageAt: newMessage.timestamp,
          lastMessageBy: 'user',
          status: 'open',
          unreadCount: (conversation?.unreadCount || 0) + 1,
          updatedAt: new Date(),
        },
      }
    );

    // Return success with optional auto-reply (can be enhanced with AI later)
    return NextResponse.json({
      success: true,
      message: newMessage,
      reply: null, // Can add auto-reply logic here
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
