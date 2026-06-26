import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
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

    // Get linked accounts from database
    const linkedAccounts = currentUser.linkedAccounts || [];

    // Fetch fresh data for each linked account from database
    const freshLinkedAccounts = await Promise.all(
      linkedAccounts.map(async (acc: any) => {
        try {
          const linkedUser = await usersCollection.findOne(
            { _id: new ObjectId(acc.id) }
          ) as User;
          
          if (linkedUser) {
            return {
              id: linkedUser._id?.toString() || acc.id,
              email: linkedUser.email,
              fullName: linkedUser.fullName || linkedUser.username,
              username: linkedUser.username,
              isActive: false, // Linked accounts are never active
              profileImage: linkedUser.profileImage,
              addedAt: acc.addedAt || linkedUser.createdAt?.toISOString() || new Date().toISOString(),
              isCurrentUser: false,
            };
          }
          
          // Fallback to cached data if user not found
          return {
            ...acc,
            isActive: false,
            isCurrentUser: false,
          };
        } catch (error) {
          console.error(`Error fetching linked account ${acc.id}:`, error);
          // Fallback to cached data on error
          return {
            ...acc,
            isActive: false,
            isCurrentUser: false,
          };
        }
      })
    );

    // Create accounts list with current user as active
    const accounts = [
      {
        id: currentUser._id?.toString() || '',
        email: currentUser.email,
        fullName: currentUser.fullName || currentUser.username,
        username: currentUser.username,
        isActive: true, // Current user is always active
        profileImage: currentUser.profileImage,
        addedAt: currentUser.createdAt?.toISOString() || new Date().toISOString(),
        isCurrentUser: true,
      },
      ...freshLinkedAccounts,
    ];

    return NextResponse.json({
      success: true,
      accounts,
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
