import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { client } = await connectToDatabase();
    const db = client.db();

    // Get user
    const user = await db.collection('users').findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    // Check 1: Completed Personal Info
    const hasCompletedProfile = !!(
      user.fullName &&
      user.phone &&
      user.country
    );

    // Check 2: Connected KYC (status must be "approved")
    const kycRecord = await db.collection('kyc').findOne({
      userId: userId,
      status: 'approved'
    });
    const hasKyc = !!kycRecord;

    // Check 3: Withdrawn Over $500
    const totalWithdrawn = user.totalWithdrawal || 0;
    const withdrawnOver500 = totalWithdrawn > 500;

    // Check 4: Connected Wallet (has cryptoAddresses)
    const hasWallet = Array.isArray(user.cryptoAddresses) && user.cryptoAddresses.length > 0;

    // Check 5: Gifted a Member
    const giftRecord = await db.collection('gifts').findOne({
      senderId: userId,
      status: 'completed'
    });
    const hasGifted = !!giftRecord;

    // Check 6: Deposited over $3,000 (from regular deposits OR gift cards)
    // Check regular deposits
    const regularDeposits = await db.collection('deposits')
      .aggregate([
        { $match: { userId: userId, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      .toArray();
    
    const regularDepositsTotal = regularDeposits[0]?.total || 0;

    // Check gift card deposits
    const giftCardDeposits = await db.collection('giftcards')
      .aggregate([
        { $match: { userId: userId, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      .toArray();
    
    const giftCardDepositsTotal = giftCardDeposits[0]?.total || 0;

    const totalDeposited = regularDepositsTotal + giftCardDepositsTotal;
    const depositedOver3000 = totalDeposited > 3000;

    return NextResponse.json({
      success: true,
      stats: {
        hasCompletedProfile,
        hasKyc,
        totalWithdrawn,
        withdrawnOver500,
        hasWallet,
        hasGifted,
        totalDeposited,
        depositedOver3000,
      }
    });

  } catch (error) {
    console.error('Get unlock stats error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch unlock stats' 
    }, { status: 500 });
  }
}
