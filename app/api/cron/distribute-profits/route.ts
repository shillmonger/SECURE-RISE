import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Investment } from '@/lib/models/Investment';
import { User } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

// This endpoint should be called by Vercel Cron Jobs every 24 hours
export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job call (you can add authentication here)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const now = new Date();

    // Get all active investments
    const activeInvestments = await db.collection<Investment>('investments')
      .find({ 
        status: 'active',
        endDate: { $gt: now } // Only investments that haven't ended
      })
      .toArray();

    let totalDistributed = 0;
    let investmentsProcessed = 0;

    for (const investment of activeInvestments) {
      try {
        // Check if profit was already distributed today
        const lastProfitDate = investment.lastProfitDate || investment.startDate;
        const daysSinceLastProfit = Math.floor((now.getTime() - lastProfitDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceLastProfit < 1) {
          continue; // Skip if already processed today
        }

        const dailyProfit = (investment.investmentAmount * investment.roiRate) / 100;
        
        // Create profit history entry
        const profitHistoryEntry = {
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          rate: investment.roiRate,
          amount: dailyProfit,
          timestamp: now
        };

        // Update investment
        await db.collection<Investment>('investments').updateOne(
          { _id: investment._id },
          {
            $inc: { 
              profitEarned: dailyProfit,
              daysPassed: 1
            },
            $push: { profitHistory: profitHistoryEntry },
            $set: { 
              lastProfitDate: now,
              updatedAt: now,
              completionPercentage: Math.min(100, ((investment.daysPassed + 1) / investment.durationDays) * 100)
            }
          }
        );

        // Update user's total profits
        await db.collection<User>('users').updateOne(
          { _id: investment.userId },
          { 
            $inc: { totalProfits: dailyProfit },
            $set: { updatedAt: now }
          }
        );

        totalDistributed += dailyProfit;
        investmentsProcessed++;

        // Check if investment should be marked as completed or expired
        const updatedDaysPassed = investment.daysPassed + 1;
        if (updatedDaysPassed >= investment.durationDays) {
          await db.collection<Investment>('investments').updateOne(
            { _id: investment._id },
            { 
              $set: { 
                status: 'completed',
                updatedAt: now
              }
            }
          );
        }

      } catch (error) {
        console.error(`Error processing investment ${investment._id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profit distribution completed',
      data: {
        investmentsProcessed,
        totalDistributed,
        timestamp: now
      }
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Failed to distribute profits' 
    }, { status: 500 });
  }
}

// Also support POST method for testing
export async function POST(request: NextRequest) {
  return GET(request);
}
