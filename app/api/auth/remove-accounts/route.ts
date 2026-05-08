import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    // Get auth token (same as existing system)
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No auth token found' },
        { status: 401 }
      );
    }

    // Verify JWT token and get current user
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const currentUserId = decoded.userId || decoded.id;

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get current user from database
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const usersCollection = db.collection('users');
    
    const currentUser = await usersCollection.findOne({ _id: new ObjectId(currentUserId) }) as User;
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Current user not found' },
        { status: 404 }
      );
    }

    // Remove all linked accounts (keep only current user)
    await usersCollection.updateOne(
      { _id: new ObjectId(currentUserId) },
      { 
        $set: { linkedAccounts: [] } as any
      }
    );

    return NextResponse.json({
      success: true,
      message: 'All linked accounts removed successfully',
    });

  } catch (error) {
    console.error('Error removing accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
