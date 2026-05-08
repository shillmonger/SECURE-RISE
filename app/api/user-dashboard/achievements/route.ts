import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Achievement, UserAchievement, UserXP, UserStats } from '@/lib/models/Achievement';

// Achievement definitions with checking logic
export const ACHIEVEMENTS: Achievement[] = [
  // Welcome achievements
  {
    id: 'welcome-bonus',
    title: 'Welcome Bonus',
    description: 'Claimed your welcome bonus on first login',
    category: 'welcome',
    rarity: 'common',
    xp: 50,
    checkFunction: (userData: any, userStats: UserStats) => userData.welcomeBonus > 0
  },
  
  // Deposit achievements
  {
    id: 'first-deposit',
    title: 'First Deposit',
    description: 'Made your very first deposit',
    category: 'deposits',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData: any, userStats: UserStats) => userStats.depositCount >= 1
  },
  {
    id: '3-deposits',
    title: 'On a Roll',
    description: 'Completed up to 3 deposits',
    category: 'deposits',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData: any, userStats: UserStats) => userStats.depositCount >= 3
  },
  {
    id: 'deposit-100',
    title: 'Century Mark',
    description: 'Deposited up to $100 in total',
    category: 'deposits',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalDeposits >= 100
  },
  {
    id: 'deposit-500',
    title: 'High Roller',
    description: 'Deposited up to $500 in total',
    category: 'deposits',
    rarity: 'rare',
    xp: 350,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalDeposits >= 500
  },
  {
    id: 'deposit-1000',
    title: 'Grand Depositor',
    description: 'Deposited up to $1,000 in total',
    category: 'deposits',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalDeposits >= 1000
  },
  {
    id: 'deposit-5000',
    title: 'Whale Status',
    description: 'Deposited up to $5,000 in total',
    category: 'deposits',
    rarity: 'legendary',
    xp: 1000,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalDeposits >= 5000
  },
  
  // Investment achievements
  {
    id: 'first-investment',
    title: 'First Investment',
    description: 'Placed your very first investment',
    category: 'investments',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData: any, userStats: UserStats) => userStats.investmentCount >= 1
  },
  {
    id: '3-investments',
    title: 'Portfolio Builder',
    description: 'Completed up to 3 investments',
    category: 'investments',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData: any, userStats: UserStats) => userStats.investmentCount >= 3
  },
  {
    id: 'invest-100',
    title: 'Seed Capital',
    description: 'Invested up to $100 in total',
    category: 'investments',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalInvestments >= 100
  },
  {
    id: 'invest-500',
    title: 'Growth Investor',
    description: 'Invested up to $500 in total',
    category: 'investments',
    rarity: 'rare',
    xp: 350,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalInvestments >= 500
  },
  {
    id: 'invest-1000',
    title: 'Power Investor',
    description: 'Invested up to $1,000 in total',
    category: 'investments',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalInvestments >= 1000
  },
  {
    id: 'invest-5000',
    title: 'Market Titan',
    description: 'Invested up to $5,000 in total',
    category: 'investments',
    rarity: 'legendary',
    xp: 1000,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalInvestments >= 5000
  },
  
  // Withdrawal achievements
  {
    id: 'first-withdrawal',
    title: 'First Cash Out',
    description: 'Completed your first withdrawal',
    category: 'withdrawals',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData: any, userStats: UserStats) => userStats.withdrawalCount >= 1
  },
  {
    id: '3-withdrawals',
    title: 'Frequent Withdrawer',
    description: 'Completed up to 3 withdrawals',
    category: 'withdrawals',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData: any, userStats: UserStats) => userStats.withdrawalCount >= 3
  },
  {
    id: 'withdraw-300',
    title: 'Pocket Money',
    description: 'Withdrew up to $300 in total',
    category: 'withdrawals',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalWithdrawals >= 300
  },
  {
    id: 'withdraw-500',
    title: 'Half Thousand',
    description: 'Withdrew up to $500 in total',
    category: 'withdrawals',
    rarity: 'rare',
    xp: 350,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalWithdrawals >= 500
  },
  {
    id: 'withdraw-1000',
    title: 'Grand Exit',
    description: 'Withdrew up to $1,000 in total',
    category: 'withdrawals',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalWithdrawals >= 1000
  },
  {
    id: 'withdraw-5000',
    title: 'Big Liquidator',
    description: 'Withdrew up to $5,000 in total',
    category: 'withdrawals',
    rarity: 'legendary',
    xp: 1000,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalWithdrawals >= 5000
  },
  
  // Gift achievements
  {
    id: 'first-gift-received',
    title: 'First Gift',
    description: 'Received your first gift',
    category: 'gifts',
    rarity: 'common',
    xp: 75,
    checkFunction: (userData: any, userStats: UserStats) => userStats.giftReceivedCount >= 1
  },
  {
    id: '3-gifts-received',
    title: 'Gift Collector',
    description: 'Received up to 3 gifts',
    category: 'gifts',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData: any, userStats: UserStats) => userStats.giftReceivedCount >= 3
  },
  {
    id: 'first-gift-sent',
    title: 'Generous Soul',
    description: 'Sent your first gift to someone',
    category: 'gifts',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData: any, userStats: UserStats) => userStats.giftSentCount >= 1
  },
  {
    id: '3-gifts-sent',
    title: 'Gift Giver',
    description: 'Sent up to 3 gifts',
    category: 'gifts',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData: any, userStats: UserStats) => userStats.giftSentCount >= 3
  },
  {
    id: 'gift-sent-50',
    title: 'Thoughtful',
    description: 'Sent a gift worth $50',
    category: 'gifts',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalGiftsSent >= 50
  },
  {
    id: 'gift-sent-100',
    title: 'Big Heart',
    description: 'Sent a gift worth $100',
    category: 'gifts',
    rarity: 'rare',
    xp: 300,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalGiftsSent >= 100
  },
  {
    id: 'gift-sent-300',
    title: 'Benefactor',
    description: 'Sent a gift worth $300',
    category: 'gifts',
    rarity: 'rare',
    xp: 400,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalGiftsSent >= 300
  },
  {
    id: 'gift-sent-500',
    title: 'Patron',
    description: 'Sent a gift worth $500',
    category: 'gifts',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalGiftsSent >= 500
  },
  {
    id: 'gift-sent-1000',
    title: 'Grand Patron',
    description: 'Sent a gift worth $1,000',
    category: 'gifts',
    rarity: 'epic',
    xp: 750,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalGiftsSent >= 1000
  },
  {
    id: 'gift-sent-5000',
    title: 'Legendary Giver',
    description: 'Sent a gift worth $5,000',
    category: 'gifts',
    rarity: 'legendary',
    xp: 1500,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalGiftsSent >= 5000
  },
  
  // ROI achievements
  {
    id: 'first-roi',
    title: 'First ROI',
    description: 'Earned your first profit from investment',
    category: 'roi',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalROI > 0
  },
  {
    id: 'roi-50',
    title: 'Profit Starter',
    description: 'Made $50 from ROI',
    category: 'roi',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalROI >= 50
  },
  {
    id: 'roi-200',
    title: 'Profit Builder',
    description: 'Made $200 from ROI',
    category: 'roi',
    rarity: 'rare',
    xp: 250,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalROI >= 200
  },
  {
    id: 'roi-700',
    title: 'Profit Master',
    description: 'Made $700 from ROI',
    category: 'roi',
    rarity: 'rare',
    xp: 400,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalROI >= 700
  },
  {
    id: 'roi-1000',
    title: 'Profit Expert',
    description: 'Made $1,000 from ROI',
    category: 'roi',
    rarity: 'epic',
    xp: 600,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalROI >= 1000
  },
  {
    id: 'roi-5000',
    title: 'Profit Legend',
    description: 'Made $5,000 from ROI',
    category: 'roi',
    rarity: 'legendary',
    xp: 1200,
    checkFunction: (userData: any, userStats: UserStats) => userStats.totalROI >= 5000
  },
];

export async function getUserStats(userId: ObjectId): Promise<UserStats> {
  const db = await connectToDatabase();
  
  // Get user data
  const user = await db.collection('users').findOne({ _id: userId });
  
  // Get deposit stats
  const deposits = await db.collection('deposits')
    .find({ userId, status: 'approved' })
    .toArray();
  
  // Get withdrawal stats
  const withdrawals = await db.collection('withdrawals')
    .find({ userId, status: 'approved' })
    .toArray();
  
  // Get investment stats
  const investments = await db.collection('investments')
    .find({ userId, status: { $in: ['approved', 'completed', 'active'] } })
    .toArray();
  
  // Get gift stats
  const giftsSent = await db.collection('gifts')
    .find({ senderId: userId, status: 'completed' })
    .toArray();
  
  const giftsReceived = await db.collection('gifts')
    .find({ receiverId: userId, status: 'completed' })
    .toArray();
  
  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);
  
  // Calculate total ROI by summing all profitHistory amounts from all investments
  const totalROI = investments.reduce((sum, investment) => {
    if (investment.profitHistory && Array.isArray(investment.profitHistory)) {
      const investmentROI = investment.profitHistory.reduce((roiSum, profit) => roiSum + (profit.amount || 0), 0);
      return sum + investmentROI;
    }
    return sum + (investment.profitEarned || 0); // Fallback to profitEarned if no profitHistory
  }, 0);
  
  const totalGiftsSent = giftsSent.reduce((sum, g) => sum + g.amount, 0);
  const totalGiftsReceived = giftsReceived.reduce((sum, g) => sum + g.amount, 0);
  
  return {
    totalDeposits,
    totalWithdrawals,
    totalInvestments,
    totalGiftsSent,
    totalGiftsReceived,
    totalROI,
    depositCount: deposits.length,
    withdrawalCount: withdrawals.length,
    investmentCount: investments.length,
    giftSentCount: giftsSent.length,
    giftReceivedCount: giftsReceived.length,
    welcomeBonusClaimed: user?.welcomeBonus > 0
  };
}

async function checkAndUnlockAchievements(userId: ObjectId): Promise<UserAchievement[]> {
  const db = await connectToDatabase();
  
  // Get current user achievements from userachievements collection
  const existingUserAchievements = await db.collection('userachievements')
    .findOne({ userId });
  
  const unlockedAchievementIds = new Set(
    existingUserAchievements?.achievementsUnlocked || []
  );
  
  // Get user stats
  const user = await db.collection('users').findOne({ _id: userId });
  const userStats = await getUserStats(userId);
  
  console.log('User Stats for Achievement Check:', {
    userId: userId.toString(),
    totalROI: userStats.totalROI,
    investmentCount: userStats.investmentCount,
    totalInvestments: userStats.totalInvestments,
    unlockedAchievementIds: Array.from(unlockedAchievementIds)
  });
  
  // Check for new achievements
  const newAchievements: string[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedAchievementIds.has(achievement.id)) {
      const isUnlocked = achievement.checkFunction(user, userStats);
      
      console.log(`Checking achievement ${achievement.id}:`, {
        title: achievement.title,
        category: achievement.category,
        isUnlocked,
        alreadyUnlocked: unlockedAchievementIds.has(achievement.id)
      });
      
      if (isUnlocked) {
        newAchievements.push(achievement.id);
        unlockedAchievementIds.add(achievement.id);
        console.log(`🎉 NEW ACHIEVEMENT UNLOCKED: ${achievement.title}`);
      }
    }
  }
  
  // Save new achievements
  if (newAchievements.length > 0) {
    // Calculate total XP for new achievements
    const totalNewXP = newAchievements.reduce((sum, achievementId) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      return sum + (achievement?.xp || 0);
    }, 0);
    
    // Update userachievements collection
    await db.collection('userachievements').updateOne(
      { userId },
      {
        $push: { achievementsUnlocked: { $each: newAchievements } } as any,
        $inc: { totalXP: totalNewXP },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
  }
  
  // Return formatted achievements for frontend
  const formattedAchievements = ACHIEVEMENTS.map(achievement => ({
    userId,
    achievementId: achievement.id,
    title: achievement.title,
    description: achievement.description,
    category: achievement.category,
    rarity: achievement.rarity,
    xp: achievement.xp,
    unlocked: unlockedAchievementIds.has(achievement.id),
    unlockedAt: undefined, // Could add timestamp tracking if needed
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  
  return formattedAchievements;
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user by email to get ObjectId
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: authUser.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = user._id;
    
    // Check and unlock any new achievements
    const userAchievements = await checkAndUnlockAchievements(userId);
    
    // Get user XP from userachievements collection
    const userXP = await db.collection('userachievements').findOne({ userId });
    
    const totalXP = userXP?.totalXP || 0;
    const achievementsUnlocked = userXP?.achievementsUnlocked || [];
    
    console.log('Final API Response:', {
      achievementsCount: userAchievements.length,
      totalXP,
      achievementsUnlocked,
      sampleAchievements: userAchievements.slice(0, 3)
    });
    
    return NextResponse.json({
      achievements: userAchievements,
      totalXP,
      achievementsUnlocked
    });
    
  } catch (error) {
    console.error('Achievements API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
