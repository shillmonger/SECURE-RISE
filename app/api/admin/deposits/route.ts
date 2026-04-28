import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { sendDepositStatusEmail } from '@/lib/email';
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (auth.error || !auth.db) {
      return NextResponse.json(
        { error: auth.error || 'Database connection failed' },
        { status: auth.status }
      );
    }

    const { db } = auth;
    const depositsCollection = db.collection('deposits');
    const usersCollection = db.collection('users');

    // Build query
    const query: any = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Get deposits with user information
    const deposits = await depositsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich deposits with user information
    const enrichedDeposits = await Promise.all(
      deposits.map(async (deposit) => {
        const user = await usersCollection.findOne({ _id: deposit.userId });
        return {
          ...deposit,
          userId: user ? {
            _id: user._id,
            username: user.username,
            fullName: user.fullName || user.username,
            email: user.email,
          } : null,
          proofImageUrl: deposit.proofImage, // Map to match frontend expectation
        };
      })
    );

    return NextResponse.json({
      success: true,
      deposits: enrichedDeposits,
    });

  } catch (error) {
    console.error('Get deposits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { depositId, action, rejectionReason } = await request.json();

    if (!depositId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
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
    const depositsCollection = db.collection('deposits');
    const usersCollection = db.collection('users');

    // Get deposit details
    const deposit = await depositsCollection.findOne({ _id: new ObjectId(depositId) });
    if (!deposit) {
      return NextResponse.json(
        { error: 'Deposit not found' },
        { status: 404 }
      );
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json(
        { error: 'Deposit has already been processed' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await usersCollection.findOne({ _id: deposit.userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isApproved = action === 'approve';
    const now = new Date();

    // Update deposit status
    const updateData: any = {
      status: isApproved ? 'approved' : 'rejected',
      updatedAt: now,
    };

    if (isApproved) {
      updateData.approvedAt = now;
      updateData.approvedBy = auth.user._id; // Use actual admin ID from session
    } else {
      updateData.rejectedAt = now;
      updateData.rejectedBy = auth.user._id; // Use actual admin ID from session
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
    }

    await depositsCollection.updateOne(
      { _id: new ObjectId(depositId) },
      { $set: updateData }
    );

    // If approved, update user account balance and total deposit
    if (isApproved) {
      await usersCollection.updateOne(
        { _id: deposit.userId },
        { 
          $inc: { 
            accountBalance: deposit.amount,
            totalDeposit: deposit.amount
          },
          $set: { updatedAt: now }
        }
      );
    }

    // Send email notification to user
    await sendDepositStatusEmail(deposit.userEmail, {
      username: deposit.username,
      amount: deposit.amount,
      paymentMethod: deposit.paymentMethod,
      transactionId: deposit.transactionId,
      status: isApproved ? 'approved' : 'rejected',
      rejectionReason: isApproved ? undefined : rejectionReason,
    });

    return NextResponse.json({
      success: true,
      message: `Deposit ${isApproved ? 'approved' : 'rejected'} successfully`,
    });

  } catch (error) {
    console.error('Deposit action error:', error);
    return NextResponse.json(
      { error: 'Failed to process deposit' },
      { status: 500 }
    );
  }
}
