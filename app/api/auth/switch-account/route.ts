import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required' },
        { status: 400 }
      );
    }

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

    // Find the account to switch to in linked accounts
    const linkedAccounts = currentUser.linkedAccounts || [];
    const targetAccount = linkedAccounts.find((acc: any) => acc.id === accountId);
    
    if (!targetAccount) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Get the target user's data from database
    const targetUser = await usersCollection.findOne({ _id: new ObjectId(accountId) }) as User;
    
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Create new JWT token for the switched account
    const newToken = jwt.sign(
      { 
        userId: targetUser._id?.toString() || '',
        email: targetUser.email,
        username: targetUser.username
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Account switched successfully',
      account: {
        id: targetUser._id?.toString() || '',
        email: targetUser.email,
        fullName: targetUser.fullName || targetUser.username,
        username: targetUser.username,
        profileImage: targetUser.profileImage,
      },
    });

    // Set new auth token for the switched account
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error switching account:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
