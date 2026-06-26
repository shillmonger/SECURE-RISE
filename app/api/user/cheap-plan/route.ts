import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId, Collection, UpdateFilter } from 'mongodb';
import { Investment, createInvestment } from '@/lib/models/Investment';
import { sendCheapPlanActivationEmail } from '@/lib/email';

// Cheap plan configuration
const cheapPlan = {
  id: 999,
  name: "$20 Welcome Bonus Plan",
  min: 20,
  max: 20,
  roiPerDay: 70,
  duration: 14,
  icon: "Gift",
  color: "from-primary/20 to-primary/5",
  accent: "text-primary",
  border: "border-primary/30",
  badge: "Exclusive",
  perks: ["Daily ROI payouts", "VIP support", "Priority withdrawals", "Bonus rewards"],
};

export async function POST(request: NextRequest) {
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

    // Check all unlock requirements
    // 1. Completed Personal Info
    const hasCompletedProfile = !!(
      user.fullName &&
      user.phone &&
      user.country
    );

    // 2. Connected KYC
    const kycRecord = await db.collection('kyc').findOne({
      userId: userId,
      status: 'approved'
    });
    const hasKyc = !!kycRecord;

    // 3. Withdrawn Over $500
    const totalWithdrawn = user.totalWithdrawal || 0;
    const withdrawnOver500 = totalWithdrawn > 500;

    // 4. Connected Wallet
    const hasWallet = Array.isArray(user.cryptoAddresses) && user.cryptoAddresses.length > 0;

    // 5. Gifted a Member
    const giftRecord = await db.collection('gifts').findOne({
      senderId: userId,
      status: 'completed'
    });
    const hasGifted = !!giftRecord;

    // 6. Deposited over $3,000
    const regularDeposits = await db.collection('deposits')
      .aggregate([
        { $match: { userId: userId, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      .toArray();
    
    const regularDepositsTotal = regularDeposits[0]?.total || 0;

    const giftCardDeposits = await db.collection('giftcards')
      .aggregate([
        { $match: { userId: userId, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      .toArray();
    
    const giftCardDepositsTotal = giftCardDeposits[0]?.total || 0;

    const totalDeposited = regularDepositsTotal + giftCardDepositsTotal;
    const depositedOver3000 = totalDeposited > 3000;

    // Check if all requirements are met
    const allRequirementsMet = 
      hasCompletedProfile &&
      hasKyc &&
      withdrawnOver500 &&
      hasWallet &&
      hasGifted &&
      depositedOver3000;

    if (!allRequirementsMet) {
      return NextResponse.json({ 
        error: 'All unlock requirements must be completed before activating this plan',
        requirements: {
          hasCompletedProfile,
          hasKyc,
          withdrawnOver500,
          hasWallet,
          hasGifted,
          depositedOver3000,
        }
      }, { status: 400 });
    }

    // Check if user has enough welcomeBonus and totalProfits
    const welcomeBonus = user.welcomeBonus || 0;
    const totalProfits = user.totalProfits || 0;
    const cost = 20;

    if (welcomeBonus < cost && totalProfits < cost) {
      return NextResponse.json({ 
        error: 'Insufficient welcome bonus or total profits to activate this plan' 
      }, { status: 400 });
    }

    // Check if user already has this plan active
    const existingInvestment = await db.collection('investments').findOne({
      userId: userId,
      planId: cheapPlan.id,
      status: { $in: ['active', 'completed'] }
    });

    if (existingInvestment) {
      return NextResponse.json({ 
        error: 'You have already activated this plan' 
      }, { status: 400 });
    }

    // Create investment - use $10,000 as the actual investment capital for ROI calculations
    const investmentCapital = 10000;
    const investmentData = createInvestment(userId, cheapPlan, investmentCapital);
    const result = await db.collection('investments').insertOne(investmentData as Investment);

    // Debit from welcomeBonus first, then from totalProfits
    const debitFromWelcomeBonus = Math.min(welcomeBonus, cost);
    const debitFromProfits = cost - debitFromWelcomeBonus;

    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $inc: { 
          welcomeBonus: -debitFromWelcomeBonus,
          totalProfits: -debitFromProfits,
        },
        $set: { updatedAt: new Date() }
      }
    );

    // Process first ROI immediately
    await processDailyROI(result.insertedId.toString());

    // Send cheap plan activation email
    try {
      const dailyEarnings = investmentCapital * (cheapPlan.roiPerDay / 100);
      const totalProfit = dailyEarnings * cheapPlan.duration;
      const totalReturn = investmentCapital + totalProfit;
      
      await sendCheapPlanActivationEmail(user.email, {
        username: user.username,
        planName: cheapPlan.name,
        amount: cheapPlan.min,
        roiPerDay: cheapPlan.roiPerDay,
        duration: cheapPlan.duration,
        dailyEarnings: dailyEarnings,
        totalProfit: totalProfit,
        totalReturn: totalReturn,
        investmentId: result.insertedId.toString()
      });
    } catch (emailError) {
      console.error('Failed to send cheap plan activation email:', emailError);
      // Don't fail the investment creation if email fails
    }

    return NextResponse.json({ 
      success: true,
      investmentId: result.insertedId.toString(),
      message: 'Welcome bonus plan activated successfully'
    });

  } catch (error) {
    console.error('Cheap plan activation error:', error);
    return NextResponse.json({ 
      error: 'Failed to activate cheap plan' 
    }, { status: 500 });
  }
}

// Helper function to process daily ROI
async function processDailyROI(investmentId: string) {
  try {
    const { client } = await connectToDatabase();
    const db = client.db();
    const investmentsCollection = db.collection<Investment>('investments');
    
    const investment = await investmentsCollection.findOne({
      _id: new ObjectId(investmentId)
    });

    if (!investment || investment.status !== 'active') {
      return;
    }

    const now = new Date();
    const lastProfitDate = investment.lastProfitDate || investment.startDate;
    const daysSinceLastProfit = Math.floor((now.getTime() - lastProfitDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastProfit < 1) {
      return; // Already processed today
    }

    const dailyProfit = (investment.investmentAmount * investment.roiRate) / 100;
    const profitHistoryEntry = {
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rate: investment.roiRate,
      amount: dailyProfit,
      timestamp: now
    };

    // Update investment with profit
    await investmentsCollection.updateOne(
      { _id: new ObjectId(investmentId) },
      {
        $inc: { 
          profitEarned: dailyProfit,
          daysPassed: 1
        },
        $set: { 
          profitHistory: [...(investment.profitHistory || []), profitHistoryEntry],
          lastProfitDate: now,
          updatedAt: now,
          completionPercentage: Math.min(100, ((investment.daysPassed + 1) / investment.durationDays) * 100)
        }
      }
    );

    // Update user's total profits and account balance
    await db.collection('users').updateOne(
      { _id: investment.userId },
      { 
        $inc: { 
          totalProfits: dailyProfit,
          accountBalance: dailyProfit
        },
        $set: { updatedAt: now }
      }
    );

    // Check if investment should be marked as completed
    const updatedInvestment = await db.collection('investments').findOne({
      _id: new ObjectId(investmentId)
    });

    if (updatedInvestment && updatedInvestment.daysPassed >= updatedInvestment.durationDays) {
      await db.collection('investments').updateOne(
        { _id: new ObjectId(investmentId) },
        { 
          $set: { 
            status: 'completed',
            updatedAt: now
          }
        }
      );
    }

  } catch (error) {
    console.error('Error processing daily ROI:', error);
  }
}
