import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { sendWithdrawalStatusEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const otherWithdrawalsCollection = db.collection('otherWithdrawals');

    // Check if user is admin
    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user || !user.role?.includes('admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get all other withdrawals with user info
    const withdrawals = await otherWithdrawalsCollection
      .aggregate([
        {
          $match: query
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $unwind: '$userInfo'
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $project: {
            _id: 1,
            withdrawalId: 1,
            userId: 1,
            username: 1,
            userEmail: 1,
            amount: 1,
            fee: 1,
            receiveAmount: 1,
            method: 1,
            details: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            approvedAt: 1,
            rejectionReason: 1,
            'userInfo.username': 1,
            'userInfo.email': 1,
            'userInfo.fullName': 1,
            'userInfo.profileImage': 1
          }
        }
      ])
      .toArray();

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error('Error fetching other withdrawals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { withdrawalId, action, rejectionReason } = await request.json();

    if (!withdrawalId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const otherWithdrawalsCollection = db.collection('otherWithdrawals');

    // Check if user is admin
    const adminUser = await usersCollection.findOne({ email: authUser.email });
    if (!adminUser || !adminUser.role?.includes('admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get withdrawal
    const withdrawal = await otherWithdrawalsCollection.findOne({ withdrawalId });
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 400 });
    }

    // Get user who made the withdrawal
    const user = await usersCollection.findOne({ _id: withdrawal.userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Deduct from user balance
      await usersCollection.updateOne(
        { _id: withdrawal.userId },
        {
          $inc: { 
            accountBalance: -withdrawal.amount,
            totalWithdrawal: withdrawal.amount
          },
          $set: { updatedAt: new Date() }
        }
      );

      // Update withdrawal status
      await otherWithdrawalsCollection.updateOne(
        { withdrawalId },
        {
          $set: {
            status: 'approved',
            approvedBy: adminUser._id,
            approvedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );

      // Send approval email
      await sendWithdrawalStatusEmail(user.email, {
        username: user.username,
        amount: withdrawal.amount,
        crypto: { name: withdrawal.method.toUpperCase(), symbol: withdrawal.method },
        destinationAddress: JSON.stringify(withdrawal.details),
        status: 'approved'
      });

    } else if (action === 'reject') {
      // Update withdrawal status
      const updateData: any = {
        status: 'rejected',
        updatedAt: new Date()
      };
      
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
      
      await otherWithdrawalsCollection.updateOne(
        { withdrawalId },
        { $set: updateData }
      );

      // Send rejection email
      await sendWithdrawalStatusEmail(user.email, {
        username: user.username,
        amount: withdrawal.amount,
        crypto: { name: withdrawal.method.toUpperCase(), symbol: withdrawal.method },
        destinationAddress: JSON.stringify(withdrawal.details),
        status: 'rejected',
        rejectionReason: rejectionReason || 'No reason provided'
      });
    }

    return NextResponse.json({
      message: `Withdrawal ${action}d successfully`,
      withdrawalId
    });
  } catch (error) {
    console.error('Error processing other withdrawal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
