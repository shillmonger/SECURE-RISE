import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

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

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error || !auth.db || !auth.user) {
      return NextResponse.json(
        { error: auth.error || 'Authentication failed' },
        { status: auth.status }
      );
    }

    const { db, user } = auth;
    const conversationsCollection = db.collection('chatConversations');

    // Find conversation for this user
    const conversation = await conversationsCollection.findOne({ 
      userId: user._id.toString() 
    });

    if (!conversation) {
      return NextResponse.json({
        success: true,
        messages: [],
      });
    }

    // Mark all admin messages as read when user fetches messages
    await conversationsCollection.updateOne(
      { userId: user._id.toString() },
      {
        $set: {
          'messages.$[elem].read': true,
        },
      },
      {
        arrayFilters: [{ 'elem.sender': 'admin', 'elem.read': false }],
      }
    );

    // Return messages in the format expected by the frontend
    const messages = conversation.messages.map((msg: any) => ({
      id: msg.id,
      sender: msg.sender,
      text: msg.text,
      createdAt: msg.timestamp,
      read: msg.read || false,
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
