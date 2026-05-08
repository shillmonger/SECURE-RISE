import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get auth token (same as existing system)
    const currentToken = request.cookies.get('auth-token')?.value;

    if (!currentToken) {
      return NextResponse.json(
        { success: false, error: 'No auth token found' },
        { status: 401 }
      );
    }

    // Verify JWT token and get current user
    let decoded;
    try {
      decoded = jwt.verify(currentToken, process.env.NEXTAUTH_SECRET!) as any;
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

    // Here you would typically:
    // 1. Validate the credentials against your database
    // 2. Store the account in the user's account list
    // 3. Return success response

    // Validate the credentials against the database
    const client = await clientPromise;
    const db = client.db('secure-rise');
    const usersCollection = db.collection('users');
    
    // Find user by email
    const userToAdd = await usersCollection.findOne({ email }) as User;
    
    if (!userToAdd) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if the account is active
    if (!userToAdd.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Verify password using bcrypt (same as login route)
    const isPasswordValid = await bcrypt.compare(password, userToAdd.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account already exists for current user
    const currentUsersCollection = db.collection('users');
    const currentUser = await currentUsersCollection.findOne({ _id: new ObjectId(currentUserId) }) as User;
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Current user not found' },
        { status: 404 }
      );
    }

    // Check if this account is already added
    const existingAccounts = currentUser.linkedAccounts || [];
    const accountExists = existingAccounts.some((acc: any) => acc.email === email);
    
    if (accountExists) {
      return NextResponse.json(
        { success: false, error: 'Account already added' },
        { status: 409 }
      );
    }

    // Add the account to current user's linked accounts
    const newAccount = {
      id: userToAdd._id?.toString() || '',
      email: userToAdd.email,
      fullName: userToAdd.fullName || userToAdd.username,
      username: userToAdd.username,
      profileImage: userToAdd.profileImage,
      isActive: false, // Not the active account
      addedAt: new Date().toISOString(),
    };

    await currentUsersCollection.updateOne(
      { _id: new ObjectId(currentUserId) },
      { 
        $push: { linkedAccounts: newAccount } as any
      }
    );

    // Create JWT token for the newly added account (login the user)
    const token = jwt.sign(
      { 
        userId: userToAdd._id?.toString() || '',
        email: userToAdd.email,
        role: userToAdd.role
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    // Create response with token
    const response = NextResponse.json({
      success: true,
      message: 'Account added successfully',
      account: newAccount,
      token,
      user: {
        _id: userToAdd._id,
        email: userToAdd.email,
        username: userToAdd.username,
        fullName: userToAdd.fullName,
        role: userToAdd.role,
        profileImage: userToAdd.profileImage,
        isActive: userToAdd.isActive
      }
    });

    // Set HTTP-only cookie for the newly logged in account
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error adding account:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
