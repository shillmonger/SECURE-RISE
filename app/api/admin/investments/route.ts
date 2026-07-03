import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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
    const investmentsCollection = db.collection('investments');

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

    // Get all investments with user info
    const investments = await investmentsCollection
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
            userId: 1,
            planId: 1,
            planName: 1,
            roiRate: 1,
            investmentAmount: 1,
            durationDays: 1,
            daysPassed: 1,
            profitEarned: 1,
            completionPercentage: 1,
            status: 1,
            profitHistory: 1,
            startDate: 1,
            endDate: 1,
            lastProfitDate: 1,
            updatedAt: 1,
            'userInfo.username': 1,
            'userInfo.email': 1,
            'userInfo.fullName': 1,
            'userInfo.profileImage': 1
          }
        }
      ])
      .toArray();

    return NextResponse.json({ investments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { investmentId } = await request.json();

    if (!investmentId) {
      return NextResponse.json({ error: 'Investment ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const investmentsCollection = db.collection('investments');

    // Check if user is admin
    const user = await usersCollection.findOne({ email: authUser.email });
    if (!user || !user.role?.includes('admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Delete investment
    const result = await investmentsCollection.deleteOne({ _id: new ObjectId(investmentId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
