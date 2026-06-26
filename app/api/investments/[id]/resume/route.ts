import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Investment } from '@/lib/models/Investment';
import { User } from '@/lib/models/User';
import { sendInvestmentResumeEmail } from '@/lib/email';

export async function POST(
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

    // Get the investment
    const investment = await db.collection<Investment>('investments').findOne({
      _id: new ObjectId(investmentId)
    });

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    // Verify the investment belongs to the user
    if (investment.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to resume this investment' }, { status: 403 });
    }

    // Check if investment is active
    if (investment.status !== 'active') {
      return NextResponse.json({ error: 'Only active investments can be resumed' }, { status: 400 });
    }

    // Check if investment is already completed
    if (investment.daysPassed >= investment.durationDays) {
      return NextResponse.json({ error: 'Investment is already completed' }, { status: 400 });
    }

    // Calculate missing days
    const missingDays = investment.durationDays - investment.daysPassed;
    
    console.log('Resume investment - Investment ID:', investmentId);
    console.log('Resume investment - daysPassed:', investment.daysPassed);
    console.log('Resume investment - durationDays:', investment.durationDays);
    console.log('Resume investment - missingDays:', missingDays);
    
    if (missingDays <= 0) {
      return NextResponse.json({ error: 'No missing days to process' }, { status: 400 });
    }

    const now = new Date();
    const dailyProfit = (investment.investmentAmount * investment.roiRate) / 100;
    const totalMissingProfit = dailyProfit * missingDays;
    
    console.log('Resume investment - dailyProfit:', dailyProfit);
    console.log('Resume investment - totalMissingProfit:', totalMissingProfit);
    
    // Generate missing profit history entries
    const missingProfitHistory = [];
    const lastProfitDate = investment.lastProfitDate || investment.startDate;
    
    for (let i = 1; i <= missingDays; i++) {
      const profitDate = new Date(lastProfitDate);
      profitDate.setDate(profitDate.getDate() + i);
      
      missingProfitHistory.push({
        date: profitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        rate: investment.roiRate,
        amount: dailyProfit,
        timestamp: profitDate
      });
    }

    console.log('Resume investment - missingProfitHistory:', missingProfitHistory);

    // Update investment with missing profits
    const updateResult = await db.collection<Investment>('investments').updateOne(
      { _id: new ObjectId(investmentId) },
      {
        $inc: { 
          profitEarned: totalMissingProfit,
          daysPassed: missingDays
        },
        $push: { profitHistory: { $each: missingProfitHistory } },
        $set: { 
          lastProfitDate: now,
          updatedAt: now,
          completionPercentage: 100,
          status: 'completed'
        }
      }
    );

    console.log('Resume investment - updateResult:', updateResult);

    // Update user's total profits and account balance
    const userUpdateResult = await db.collection<User>('users').updateOne(
      { _id: investment.userId },
      { 
        $inc: { 
          totalProfits: totalMissingProfit,
          accountBalance: totalMissingProfit
        },
        $set: { updatedAt: now }
      }
    );

    console.log('Resume investment - userUpdateResult:', userUpdateResult);

    // Send email notification
    try {
      await sendInvestmentResumeEmail(user.email, {
        username: user.fullName || user.username,
        planName: investment.planName,
        amount: investment.investmentAmount,
        roiRate: investment.roiRate,
        durationDays: investment.durationDays,
        daysPassed: investment.daysPassed + missingDays,
        missingDays,
        profitEarned: investment.profitEarned + totalMissingProfit,
        missingProfit: totalMissingProfit,
        totalProfit: investment.profitEarned + totalMissingProfit,
        investmentId: investmentId,
        startDate: new Date(investment.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        endDate: new Date(investment.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    } catch (emailError) {
      console.error('Error sending investment resume email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Investment resumed successfully. Added ${missingDays} days of profit ($${totalMissingProfit.toFixed(2)})`,
      missingDays,
      totalMissingProfit
    });

  } catch (error) {
    console.error('Resume investment error:', error);
    return NextResponse.json({
      error: 'Failed to resume investment'
    }, { status: 500 });
  }
}
