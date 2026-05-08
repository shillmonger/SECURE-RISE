// Simple test script to verify ROI achievement logic
// Based on your investment data: profitEarned: 140

const mockUserStats = {
  totalDeposits: 1100,
  totalWithdrawals: 300,
  totalInvestments: 100,
  totalGiftsSent: 100,
  totalGiftsReceived: 0,
  totalROI: 140, // From your investment data
  depositCount: 1,
  withdrawalCount: 1,
  investmentCount: 1,
  giftSentCount: 1,
  giftReceivedCount: 0,
  welcomeBonusClaimed: true
};

// ROI achievement check functions
const roiAchievements = [
  {
    id: 'first-roi',
    title: 'First ROI',
    description: 'Earned your first profit from investment',
    category: 'roi',
    rarity: 'common',
    xp: 100,
    checkFunction: (userData, userStats) => userStats.totalROI > 0
  },
  {
    id: 'roi-50',
    title: 'Profit Starter',
    description: 'Made $50 from ROI',
    category: 'roi',
    rarity: 'common',
    xp: 150,
    checkFunction: (userData, userStats) => userStats.totalROI >= 50
  },
  {
    id: 'roi-200',
    title: 'Profit Builder',
    description: 'Made $200 from ROI',
    category: 'roi',
    rarity: 'rare',
    xp: 250,
    checkFunction: (userData, userStats) => userStats.totalROI >= 200
  },
  {
    id: 'roi-700',
    title: 'Profit Master',
    description: 'Made $700 from ROI',
    category: 'roi',
    rarity: 'rare',
    xp: 400,
    checkFunction: (userData, userStats) => userStats.totalROI >= 700
  },
  {
    id: 'roi-1000',
    title: 'Profit Expert',
    description: 'Made $1,000 from ROI',
    category: 'roi',
    rarity: 'epic',
    xp: 600,
    checkFunction: (userData, userStats) => userStats.totalROI >= 1000
  },
  {
    id: 'roi-5000',
    title: 'Profit Legend',
    description: 'Made $5,000 from ROI',
    category: 'roi',
    rarity: 'legendary',
    xp: 1200,
    checkFunction: (userData, userStats) => userStats.totalROI >= 5000
  }
];

console.log('🧪 Testing ROI Achievements with your data (totalROI: 140)');
console.log('='.repeat(60));

roiAchievements.forEach(achievement => {
  const isUnlocked = achievement.checkFunction(null, mockUserStats);
  console.log(`${isUnlocked ? '✅' : '❌'} ${achievement.title} (${achievement.xp} XP) - ${achievement.description}`);
});

console.log('\n📊 Expected Results:');
console.log('✅ First ROI (100 XP) - You earned $140 profit');
console.log('✅ Profit Starter (150 XP) - $140 >= $50');
console.log('❌ Profit Builder (250 XP) - $140 < $200');
console.log('❌ Profit Master (400 XP) - $140 < $700');
console.log('❌ Profit Expert (600 XP) - $140 < $1000');
console.log('❌ Profit Legend (1200 XP) - $140 < $5000');

console.log('\n💰 Total XP from ROI achievements: 250 XP');
console.log('🎯 You should unlock 2 out of 6 ROI achievements with your current data!');
