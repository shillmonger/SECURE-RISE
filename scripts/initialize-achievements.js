const { MongoClient } = require('mongodb');

// Achievement definitions (same as in API)
const ACHIEVEMENTS = [
  // Welcome achievements
  {
    id: 'welcome-bonus',
    title: 'Welcome Bonus',
    description: 'Claimed your welcome bonus on first login',
    category: 'welcome',
    rarity: 'common',
    xp: 50,
    checkFunction: (userData, userStats) => userData.welcomeBonus > 0
  },
  
  // Deposit achievements
  {
    id: 'first-deposit',
    title: 'First Deposit',
    description: 'Made your very first deposit',
    category: 'deposits',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData, userStats) => userStats.depositCount >= 1
  },
  {
    id: '3-deposits',
    title: 'On a Roll',
    description: 'Completed up to 3 deposits',
    category: 'deposits',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData, userStats) => userStats.depositCount >= 3
  },
  {
    id: 'deposit-100',
    title: 'Century Mark',
    description: 'Deposited up to $100 in total',
    category: 'deposits',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData, userStats) => userStats.totalDeposits >= 100
  },
  {
    id: 'deposit-500',
    title: 'High Roller',
    description: 'Deposited up to $500 in total',
    category: 'deposits',
    rarity: 'rare',
    xp: 350,
    checkFunction: (userData, userStats) => userStats.totalDeposits >= 500
  },
  {
    id: 'deposit-1000',
    title: 'Grand Depositor',
    description: 'Deposited up to $1,000 in total',
    category: 'deposits',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData, userStats) => userStats.totalDeposits >= 1000
  },
  {
    id: 'deposit-5000',
    title: 'Whale Status',
    description: 'Deposited up to $5,000 in total',
    category: 'deposits',
    rarity: 'legendary',
    xp: 1000,
    checkFunction: (userData, userStats) => userStats.totalDeposits >= 5000
  },
  
  // Investment achievements
  {
    id: 'first-investment',
    title: 'First Investment',
    description: 'Placed your very first investment',
    category: 'investments',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData, userStats) => userStats.investmentCount >= 1
  },
  {
    id: '3-investments',
    title: 'Portfolio Builder',
    description: 'Completed up to 3 investments',
    category: 'investments',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData, userStats) => userStats.investmentCount >= 3
  },
  {
    id: 'invest-100',
    title: 'Seed Capital',
    description: 'Invested up to $100 in total',
    category: 'investments',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData, userStats) => userStats.totalInvestments >= 100
  },
  {
    id: 'invest-500',
    title: 'Growth Investor',
    description: 'Invested up to $500 in total',
    category: 'investments',
    rarity: 'rare',
    xp: 350,
    checkFunction: (userData, userStats) => userStats.totalInvestments >= 500
  },
  {
    id: 'invest-1000',
    title: 'Power Investor',
    description: 'Invested up to $1,000 in total',
    category: 'investments',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData, userStats) => userStats.totalInvestments >= 1000
  },
  {
    id: 'invest-5000',
    title: 'Market Titan',
    description: 'Invested up to $5,000 in total',
    category: 'investments',
    rarity: 'legendary',
    xp: 1000,
    checkFunction: (userData, userStats) => userStats.totalInvestments >= 5000
  },
  
  // Withdrawal achievements
  {
    id: 'first-withdrawal',
    title: 'First Cash Out',
    description: 'Completed your first withdrawal',
    category: 'withdrawals',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData, userStats) => userStats.withdrawalCount >= 1
  },
  {
    id: '3-withdrawals',
    title: 'Frequent Withdrawer',
    description: 'Completed up to 3 withdrawals',
    category: 'withdrawals',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData, userStats) => userStats.withdrawalCount >= 3
  },
  {
    id: 'withdraw-300',
    title: 'Pocket Money',
    description: 'Withdrew up to $300 in total',
    category: 'withdrawals',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData, userStats) => userStats.totalWithdrawals >= 300
  },
  {
    id: 'withdraw-500',
    title: 'Half Thousand',
    description: 'Withdrew up to $500 in total',
    category: 'withdrawals',
    rarity: 'rare',
    xp: 350,
    checkFunction: (userData, userStats) => userStats.totalWithdrawals >= 500
  },
  {
    id: 'withdraw-1000',
    title: 'Grand Exit',
    description: 'Withdrew up to $1,000 in total',
    category: 'withdrawals',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData, userStats) => userStats.totalWithdrawals >= 1000
  },
  {
    id: 'withdraw-5000',
    title: 'Big Liquidator',
    description: 'Withdrew up to $5,000 in total',
    category: 'withdrawals',
    rarity: 'legendary',
    xp: 1000,
    checkFunction: (userData, userStats) => userStats.totalWithdrawals >= 5000
  },
  
  // Gift achievements
  {
    id: 'first-gift-received',
    title: 'First Gift',
    description: 'Received your first gift',
    category: 'gifts',
    rarity: 'common',
    xp: 75,
    checkFunction: (userData, userStats) => userStats.giftReceivedCount >= 1
  },
  {
    id: '3-gifts-received',
    title: 'Gift Collector',
    description: 'Received up to 3 gifts',
    category: 'gifts',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData, userStats) => userStats.giftReceivedCount >= 3
  },
  {
    id: 'first-gift-sent',
    title: 'Generous Soul',
    description: 'Sent your first gift to someone',
    category: 'gifts',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData, userStats) => userStats.giftSentCount >= 1
  },
  {
    id: '3-gifts-sent',
    title: 'Gift Giver',
    description: 'Sent up to 3 gifts',
    category: 'gifts',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData, userStats) => userStats.giftSentCount >= 3
  },
  {
    id: 'gift-sent-50',
    title: 'Thoughtful',
    description: 'Sent a gift worth $50',
    category: 'gifts',
    rarity: 'rare',
    xp: 200,
    checkFunction: (userData, userStats) => userStats.totalGiftsSent >= 50
  },
  {
    id: 'gift-sent-100',
    title: 'Big Heart',
    description: 'Sent a gift worth $100',
    category: 'gifts',
    rarity: 'rare',
    xp: 300,
    checkFunction: (userData, userStats) => userStats.totalGiftsSent >= 100
  },
  {
    id: 'gift-sent-300',
    title: 'Benefactor',
    description: 'Sent a gift worth $300',
    category: 'gifts',
    rarity: 'rare',
    xp: 400,
    checkFunction: (userData, userStats) => userStats.totalGiftsSent >= 300
  },
  {
    id: 'gift-sent-500',
    title: 'Patron',
    description: 'Sent a gift worth $500',
    category: 'gifts',
    rarity: 'epic',
    xp: 500,
    checkFunction: (userData, userStats) => userStats.totalGiftsSent >= 500
  },
  {
    id: 'gift-sent-1000',
    title: 'Grand Patron',
    description: 'Sent a gift worth $1,000',
    category: 'gifts',
    rarity: 'epic',
    xp: 750,
    checkFunction: (userData, userStats) => userStats.totalGiftsSent >= 1000
  },
  {
    id: 'gift-sent-5000',
    title: 'Legendary Giver',
    description: 'Sent a gift worth $5,000',
    category: 'gifts',
    rarity: 'legendary',
    xp: 1500,
    checkFunction: (userData, userStats) => userStats.totalGiftsSent >= 5000
  },
];

async function getUserStats(db, userId) {
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
    .find({ userId, status: 'approved' })
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
  const totalGiftsSent = giftsSent.reduce((sum, g) => sum + g.amount, 0);
  const totalGiftsReceived = giftsReceived.reduce((sum, g) => sum + g.amount, 0);
  
  return {
    totalDeposits,
    totalWithdrawals,
    totalInvestments,
    totalGiftsSent,
    totalGiftsReceived,
    depositCount: deposits.length,
    withdrawalCount: withdrawals.length,
    investmentCount: investments.length,
    giftSentCount: giftsSent.length,
    giftReceivedCount: giftsReceived.length,
    welcomeBonusClaimed: user?.welcomeBonus > 0
  };
}

async function checkAndUnlockAchievements(db, userId) {
  // Get current user achievements
  const existingAchievements = await db.collection('userachievements')
    .find({ userId })
    .toArray();
  
  const unlockedAchievementIds = new Set(
    existingAchievements.map(a => a.achievementId)
  );
  
  // Get user stats
  const user = await db.collection('users').findOne({ _id: userId });
  const userStats = await getUserStats(db, userId);
  
  console.log(`Checking achievements for user ${user?.username}:`, userStats);
  
  // Check for new achievements
  const newAchievements = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedAchievementIds.has(achievement.id)) {
      const isUnlocked = achievement.checkFunction(user, userStats);
      
      if (isUnlocked) {
        const newAchievement = {
          userId,
          achievementId: achievement.id,
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          rarity: achievement.rarity,
          xp: achievement.xp,
          unlocked: true,
          unlockedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        newAchievements.push(newAchievement);
        console.log(`✅ Unlocked: ${achievement.title} (${achievement.xp} XP)`);
      }
    }
  }
  
  // Save new achievements
  if (newAchievements.length > 0) {
    await db.collection('userachievements').insertMany(newAchievements);
    
    // Update user XP
    const totalNewXP = newAchievements.reduce((sum, a) => sum + a.xp, 0);
    
    await db.collection('userxp').updateOne(
      { userId },
      {
        $inc: { totalXP: totalNewXP },
        $push: { achievementsUnlocked: { $each: newAchievements.map(a => a.achievementId) } },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
    
    console.log(`🎉 Added ${newAchievements.length} achievements and ${totalNewXP} XP`);
  } else {
    console.log(`No new achievements for ${user?.username}`);
  }
  
  return newAchievements;
}

async function initializeAchievements() {
  const uri = 'mongodb+srv://codelab042:codelab042@chidera.2ffbe.mongodb.net/secure-rise';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    
    // Get all users
    const users = await db.collection('users').find({ isActive: true }).toArray();
    console.log(`📊 Found ${users.length} active users`);
    
    // Process each user
    for (const user of users) {
      console.log(`\n👤 Processing user: ${user.username} (${user.email})`);
      await checkAndUnlockAchievements(db, user._id);
    }
    
    console.log('\n✅ Achievement initialization complete!');
    
    // Show summary
    const totalAchievements = await db.collection('userachievements').countDocuments();
    const totalXP = await db.collection('userxp').aggregate([
      { $group: { _id: null, total: { $sum: '$totalXP' } } }
    ]).toArray();
    
    console.log(`📈 Summary: ${totalAchievements} total achievements unlocked`);
    console.log(`💰 Total XP awarded: ${totalXP[0]?.total || 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
initializeAchievements();
