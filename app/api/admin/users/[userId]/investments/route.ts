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

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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
    const investmentsCollection = db.collection('investments');

    // Get user's investments
    const investments = await investmentsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Format investments for frontend
    const formattedInvestments = investments.map(inv => ({
      id: inv._id?.toString() || '',
      userId: inv.userId?.toString() || '',
      planId: inv.planId,
      planName: inv.planName,
      roiRate: inv.roiRate,
      investmentAmount: inv.investmentAmount,
      durationDays: inv.durationDays,
      daysPassed: inv.daysPassed,
      profitEarned: inv.profitEarned,
      completionPercentage: inv.completionPercentage,
      status: inv.status,
      profitHistory: inv.profitHistory || [],
      startDate: inv.startDate,
      endDate: inv.endDate,
      lastProfitDate: inv.lastProfitDate,
      updatedAt: inv.updatedAt
    }));

    return NextResponse.json({
      success: true,
      investments: formattedInvestments
    });

  } catch (error) {
    console.error('Get user investments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user investments' },
      { status: 500 }
    );
  }
}
