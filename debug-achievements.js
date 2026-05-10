const { MongoClient, ObjectId } = require('mongodb');

async function debugAchievements() {
  const client = new MongoClient('mongodb+srv://codelab042:codelab042@chidera.2ffbe.mongodb.net/secure-rise');
  
  try {
    await client.connect();
    const db = client.db('secure-rise');
    
    console.log('🔍 Debugging Achievement Issues...\n');
    
    // Test the two users mentioned
    const userId1 = new ObjectId('69dda92e0bc12cb420b30aac'); // securerise0@gmail.com
    const userId2 = new ObjectId('69ddcfb6d2dae6f8e28d2bd0'); // shillmonger0@gmail.com
    
    for (const [index, userId] of [userId1, userId2].entries()) {
      console.log(`\n👤 USER ${index + 1}: ${userId}`);
      
      // Get user data
      const user = await db.collection('users').findOne({ _id: userId });
      console.log(`Email: ${user?.email}`);
      console.log(`Crypto addresses count: ${user?.cryptoAddresses?.length || 0}`);
      
      // Check KYC status
      const kycSubmission = await db.collection('kyc').findOne({ 
        userId, 
        status: 'approved' 
      });
      console.log(`KYC approved: ${!!kycSubmission}`);
      if (kycSubmission) {
        console.log(`KYC status: ${kycSubmission.status}`);
        console.log(`KYC submission ID: ${kycSubmission.submissionId}`);
      }
      
      // Get current achievements
      const userAchievements = await db.collection('userachievements').findOne({ userId });
      const unlockedAchievements = userAchievements?.achievementsUnlocked || [];
      console.log(`Current unlocked achievements: ${unlockedAchievements.length}`);
      console.log(`Unlocked achievement IDs: ${JSON.stringify(unlockedAchievements)}`);
      
      // Test achievement conditions
      console.log('\n🏆 Testing Achievement Conditions:');
      
      // KYC Achievement
      const kycShouldUnlock = !!kycSubmission;
      const kycIsUnlocked = unlockedAchievements.includes('verify-kyc');
      console.log(`KYC Achievement - Should unlock: ${kycShouldUnlock}, Is unlocked: ${kycIsUnlocked}`);
      
      // Crypto Starter Achievement
      const cryptoCount = user?.cryptoAddresses?.length || 0;
      const cryptoShouldUnlock = cryptoCount >= 1;
      const cryptoIsUnlocked = unlockedAchievements.includes('first-crypto-address');
      console.log(`Crypto Starter - Should unlock: ${cryptoShouldUnlock}, Is unlocked: ${cryptoIsUnlocked}`);
      console.log(`Crypto addresses: ${JSON.stringify(user?.cryptoAddresses?.map(c => ({ symbol: c.crypto?.symbol, address: c.address })) || [])}`);
      
      // Check if achievements need to be unlocked
      if (kycShouldUnlock && !kycIsUnlocked) {
        console.log('❌ KYC achievement should be unlocked but is not!');
      } else if (kycShouldUnlock && kycIsUnlocked) {
        console.log('✅ KYC achievement is correctly unlocked');
      } else {
        console.log('ℹ️ KYC achievement should remain locked');
      }
      
      if (cryptoShouldUnlock && !cryptoIsUnlocked) {
        console.log('❌ Crypto Starter achievement should be unlocked but is not!');
      } else if (cryptoShouldUnlock && cryptoIsUnlocked) {
        console.log('✅ Crypto Starter achievement is correctly unlocked');
      } else {
        console.log('ℹ️ Crypto Starter achievement should remain locked');
      }
    }
    
    // Check the achievement definitions in the database
    console.log('\n📋 Checking Achievement Definitions...');
    
    // Simulate the getUserStats function
    console.log('\n🔧 Simulating getUserStats function...');
    
    const testUserId = userId1; // Use first user for detailed testing
    
    // Get deposits
    const deposits = await db.collection('deposits')
      .find({ userId: testUserId, status: 'approved' })
      .toArray();
    
    // Get user
    const testUser = await db.collection('users').findOne({ _id: testUserId });
    
    // Get KYC
    const testKyc = await db.collection('kyc')
      .findOne({ userId: testUserId, status: 'approved' });
    
    // Calculate stats like the function does
    const userStats = {
      totalDeposits: deposits.reduce((sum, d) => sum + d.amount, 0),
      totalWithdrawals: 0,
      totalInvestments: 0,
      totalGiftsSent: 0,
      totalGiftsReceived: 0,
      totalROI: 0,
      depositCount: deposits.length,
      withdrawalCount: 0,
      investmentCount: 0,
      giftSentCount: 0,
      giftReceivedCount: 0,
      welcomeBonusClaimed: testUser?.welcomeBonus > 0,
      cryptoAddressCount: testUser?.cryptoAddresses?.length || 0,
      kycApproved: !!testKyc
    };
    
    console.log('Calculated userStats:', userStats);
    
    // Test the achievement check functions
    console.log('\n🧪 Testing Achievement Check Functions:');
    
    const achievements = [
      {
        id: 'verify-kyc',
        checkFunction: (userData, userStats) => userStats.kycApproved
      },
      {
        id: 'first-crypto-address',
        checkFunction: (userData, userStats) => userStats.cryptoAddressCount >= 1
      }
    ];
    
    for (const achievement of achievements) {
      const shouldUnlock = achievement.checkFunction(testUser, userStats);
      console.log(`${achievement.id}: Should unlock = ${shouldUnlock}`);
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  } finally {
    await client.close();
  }
}

debugAchievements();
