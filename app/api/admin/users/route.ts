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

export async function GET(request: NextRequest) {
  try {
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

    // Get all users (excluding admins)
    const users = await usersCollection
      .find({ role: 'user' })
      .sort({ createdAt: -1 })
      .toArray();

    // Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.fullName || user.username,
      email: user.email,
      username: user.username,
      status: user.isActive ? 'Active' : 'Blocked',
      balance: `$${user.accountBalance.toFixed(2)}`,
      profit: `$${user.totalProfits.toFixed(2)}`,
      totalDeposit: user.totalDeposit,
      totalWithdrawal: user.totalWithdrawal,
      roles: user.role,
      createdAt: user.createdAt,
      profileImage: user.profileImage,
      phone: user.phone,
      country: user.country
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
