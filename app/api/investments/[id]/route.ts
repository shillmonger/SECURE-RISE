import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Investment } from '@/lib/models/Investment';
import { User } from '@/lib/models/User';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: investmentId } = await params;

    if (!investmentId) {
      return NextResponse.json({ error: 'Investment ID is required' }, { status: 400 });
    }

    const { client } = await connectToDatabase();
    const db = client.db();

    // Get user
    const user = await db.collection<User>('users').findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the investment to verify ownership
    const investment = await db.collection<Investment>('investments').findOne({
      _id: new ObjectId(investmentId)
    });

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    // Verify the investment belongs to the user
    if (investment.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to delete this investment' }, { status: 403 });
    }

    // Delete the investment
    await db.collection<Investment>('investments').deleteOne({
      _id: new ObjectId(investmentId)
    });

    return NextResponse.json({
      success: true,
      message: 'Investment deleted successfully'
    });

  } catch (error) {
    console.error('Delete investment error:', error);
    return NextResponse.json({
      error: 'Failed to delete investment'
    }, { status: 500 });
  }
}
