import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const db = await connectToDatabase();
    
    // Test basic query
    const userCount = await db.collection('users').countDocuments();
    const depositCount = await db.collection('deposits').countDocuments();
    const withdrawalCount = await db.collection('withdrawals').countDocuments();
    const investmentCount = await db.collection('investments').countDocuments();
    const giftCount = await db.collection('gifts').countDocuments();
    
    // Check if collections exist
    const userAchievementCount = await db.collection('userachievements').countDocuments();
    const userXPCount = await db.collection('userxp').countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        users: userCount,
        deposits: depositCount,
        withdrawals: withdrawalCount,
        investments: investmentCount,
        gifts: giftCount,
        userAchievements: userAchievementCount,
        userXP: userXPCount
      }
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Database connection failed' 
      },
      { status: 500 }
    );
  }
}
