const { MongoClient, ObjectId } = require('mongodb');

async function testAPIResponse() {
  const client = new MongoClient('mongodb+srv://codelab042:codelab042@chidera.2ffbe.mongodb.net/secure-rise');
  
  try {
    await client.connect();
    const db = client.db('secure-rise');
    
    console.log('🧪 Testing API Response Logic...\n');
    
    // Simulate the API logic for user 1
    const userId = new ObjectId('69dda92e0bc12cb420b30aac');
    
    // Get user achievements from userachievements collection (fixed logic)
    const userAchievementsData = await db.collection('userachievements').findOne({ userId });
    
    const totalXP = userAchievementsData?.totalXP || 0;
    const achievementsUnlocked = userAchievementsData?.achievementsUnlocked || [];
    
    console.log(`User: securerise0@gmail.com`);
    console.log(`Total XP: ${totalXP}`);
    console.log(`Achievements unlocked count: ${achievementsUnlocked.length}`);
    console.log(`Achievements unlocked: ${JSON.stringify(achievementsUnlocked)}`);
    
    // Check specific achievements
    const kycUnlocked = achievementsUnlocked.includes('verify-kyc');
    const cryptoUnlocked = achievementsUnlocked.includes('first-crypto-address');
    
    console.log(`\n🏆 Achievement Status:`);
    console.log(`KYC Achievement (verify-kyc): ${kycUnlocked ? '✅ UNLOCKED' : '❌ LOCKED'}`);
    console.log(`Crypto Starter (first-crypto-address): ${cryptoUnlocked ? '✅ UNLOCKED' : '❌ LOCKED'}`);
    
    // Test with old logic (userxp collection) to show the difference
    console.log(`\n📊 Comparison with old logic (userxp collection):`);
    
    const userXP = await db.collection('userxp').findOne({ userId });
    const oldAchievementsUnlocked = userXP?.achievementsUnlocked || [];
    
    console.log(`Old logic achievements count: ${oldAchievementsUnlocked.length}`);
    console.log(`Old logic KYC unlocked: ${oldAchievementsUnlocked.includes('verify-kyc') ? '✅' : '❌'}`);
    console.log(`Old logic Crypto unlocked: ${oldAchievementsUnlocked.includes('first-crypto-address') ? '✅' : '❌'}`);
    
    console.log(`\n🔍 Difference:`);
    console.log(`New logic finds KYC: ${kycUnlocked}, Old logic finds KYC: ${oldAchievementsUnlocked.includes('verify-kyc')}`);
    console.log(`New logic finds Crypto: ${cryptoUnlocked}, Old logic finds Crypto: ${oldAchievementsUnlocked.includes('first-crypto-address')}`);
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await client.close();
  }
}

testAPIResponse();
