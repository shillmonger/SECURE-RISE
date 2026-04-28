import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Investment, createInvestment } from '@/lib/models/Investment';
import { User } from '@/lib/models/User';

// Investment plans data
const investmentPlans = [
  {
    id: 1,
    name: "Starter Rise",
    min: 100,
    max: 199,
    roiPerDay: 20,
    duration: 7,
    icon: "Zap",
    color: "from-yellow-500/20 to-yellow-500/5",
    accent: "text-yellow-500",
    border: "border-yellow-500/30",
    badge: null,
    perks: ["Daily ROI payouts", "Email support", "Basic analytics"],
  },
  {
    id: 2,
    name: "Basic Growth",
    min: 200,
    max: 499,
    roiPerDay: 20,
    duration: 7,
    icon: "TrendingUp",
    color: "from-green-500/20 to-green-500/5",
    accent: "text-green-500",
    border: "border-green-500/30",
    badge: null,
    perks: ["Daily ROI payouts", "Priority support", "Growth dashboard"],
  },
  {
    id: 3,
    name: "Pro Trader",
    min: 500,
    max: 999,
    roiPerDay: 20,
    duration: 7,
    icon: "ShieldCheck",
    color: "from-blue-500/20 to-blue-500/5",
    accent: "text-blue-500",
    border: "border-blue-500/30",
    badge: "Popular",
    perks: ["Daily ROI payouts", "24/7 support", "Advanced analytics", "Fast withdrawals"],
  },
  {
    id: 4,
    name: "Advanced Wealth",
    min: 1000,
    max: 4999,
    roiPerDay: 20,
    duration: 7,
    icon: "Bot",
    color: "from-purple-500/20 to-purple-500/5",
    accent: "text-purple-500",
    border: "border-purple-500/30",
    badge: null,
    perks: ["Daily ROI payouts", "AI trading bot", "Dedicated manager", "Instant withdrawals"],
  },
  {
    id: 5,
    name: "Elite Investor",
    min: 5000,
    max: 9999,
    roiPerDay: 20,
    duration: 7,
    icon: "Users",
    color: "from-orange-500/20 to-orange-500/5",
    accent: "text-orange-500",
    border: "border-orange-500/30",
    badge: "Top Tier",
    perks: ["Daily ROI payouts", "Copy trading", "VIP support", "Bonus rewards", "Instant withdrawals"],
  },
  {
    id: 6,
    name: "Secure Partner",
    min: 10000,
    max: null,
    roiPerDay: 20,
    duration: 7,
    icon: "Building",
    color: "from-cyan-500/20 to-cyan-500/5",
    accent: "text-cyan-500",
    border: "border-cyan-500/30",
    badge: "Exclusive",
    perks: ["Daily ROI payouts", "Funded account access", "Personal broker", "Corporate benefits", "Priority everything"],
  },
];

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, amount } = await request.json();

    if (!planId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid investment data' }, { status: 400 });
    }

    const plan = investmentPlans.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid investment plan' }, { status: 400 });
    }

    if (amount < plan.min || (plan.max && amount > plan.max)) {
      return NextResponse.json({ 
        error: `Investment amount must be between $${plan.min} and $${plan.max || 'unlimited'}` 
      }, { status: 400 });
    }

    const { client } = await connectToDatabase();
    const db = client.db();

    // Get user
    const user = await db.collection<User>('users').findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.accountBalance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create investment
    const investmentData = createInvestment(user._id, plan, amount);
    const result = await db.collection<Investment>('investments').insertOne(investmentData as Investment);

    // Update user balance
    await db.collection<User>('users').updateOne(
      { _id: user._id },
      { 
        $inc: { accountBalance: -amount },
        $set: { updatedAt: new Date() }
      }
    );

    // Process first ROI immediately
    await processDailyROI(result.insertedId.toString());

    return NextResponse.json({ 
      success: true,
      investmentId: result.insertedId.toString(),
      message: 'Investment created successfully'
    });

  } catch (error) {
    console.error('Investment creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create investment' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { client } = await connectToDatabase();
    const db = client.db();

    // Get user
    const user = await db.collection<User>('users').findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's investments
    const investments = await db.collection<Investment>('investments')
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ investments });

  } catch (error) {
    console.error('Get investments error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch investments' 
    }, { status: 500 });
  }
}

// Helper function to process daily ROI
async function processDailyROI(investmentId: string) {
  try {
    const { client } = await connectToDatabase();
    const db = client.db();
    
    const investment = await db.collection<Investment>('investments').findOne({
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
    await db.collection<Investment>('investments').updateOne(
      { _id: new ObjectId(investmentId) },
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

    // Check if investment should be marked as completed
    const updatedInvestment = await db.collection<Investment>('investments').findOne({
      _id: new ObjectId(investmentId)
    });

    if (updatedInvestment && updatedInvestment.daysPassed >= updatedInvestment.durationDays) {
      await db.collection<Investment>('investments').updateOne(
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
