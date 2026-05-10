import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const authenticateAdmin = async (request: NextRequest) => {
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { error: 'No auth token found', status: 401, user: null, db: null };
  }

  // Verify JWT token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
  } catch (error) {
    return { error: 'Invalid token', status: 401, user: null, db: null };
  }

  if (!decoded.userId) {
    return { error: 'Invalid token', status: 401, user: null, db: null };
  }

  // Connect to database and check if user is admin
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
  
  if (!user || !user.role.includes('admin')) {
    return { error: 'Access denied', status: 403, user: null, db: null };
  }

  return { error: null, status: 200, user, db };
};

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { roles } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!roles || !Array.isArray(roles)) {
      return NextResponse.json(
        { error: 'Roles must be an array' },
        { status: 400 }
      );
    }

    // Validate roles
    const validRoles = ['user', 'admin'];
    const invalidRoles = roles.filter(role => !validRoles.includes(role));
    if (invalidRoles.length > 0) {
      return NextResponse.json(
        { error: `Invalid roles: ${invalidRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (auth.error || !auth.db) {
      return NextResponse.json(
        { error: auth.error || 'Database connection failed' },
        { status: auth.status }
      );
    }

    const { db } = auth;
    const usersCollection = db.collection('users');

    // Check if target user exists
    const targetUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from removing their own admin role
    if (auth.user._id.toString() === userId && !roles.includes('admin')) {
      return NextResponse.json(
        { error: 'You cannot remove your own admin role' },
        { status: 400 }
      );
    }

    // Update user roles
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role: roles,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User roles updated successfully',
      roles: roles
    });

  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
