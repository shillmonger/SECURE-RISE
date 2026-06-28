import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { connectToDatabase } from '@/lib/mongodb';
import { createDefaultUser } from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: 'Credential is required' },
        { status: 400 }
      );
    }

    // Verify the Google credential token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: 'Invalid credential' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: payload.email });

    let userId: string;

    if (!existingUser) {
      // New user - create account with welcome bonus (same logic as Google signIn callback)
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      const username = payload.name?.split(' ')[0] || payload.email?.split('@')[0] || 'user';

      const userData = createDefaultUser({
        username,
        email: payload.email!,
        password: hashedPassword
      });

      // Add Google profile image if available
      if (payload.picture) {
        userData.profileImage = payload.picture;
      }

      const result = await usersCollection.insertOne({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Send welcome email
      try {
        const { sendWelcomeEmail } = await import('@/lib/email');
        await sendWelcomeEmail(payload.email!, username);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      userId = result.insertedId.toString();
    } else {
      // Existing user - use their ID
      userId = existingUser._id.toString();
    }

    // Create JWT token for session
    const token = jwt.sign(
      {
        userId,
        email: payload.email,
        role: existingUser?.role || ['user']
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    // Create response with token
    const response = NextResponse.json({
      success: true,
      redirect: '/user-dashboard/dashboard',
      user: {
        id: userId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    // Store last login method
    response.cookies.set('lastLoginMethod', 'google', {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Google One Tap error:', error);
    return NextResponse.json(
      { error: 'Failed to verify credential' },
      { status: 500 }
    );
  }
}
