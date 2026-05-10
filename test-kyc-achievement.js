const { MongoClient, ObjectId } = require('mongodb');

async function testKYCAchievement() {
  const client = new MongoClient('mongodb+srv://codelab042:codelab042@chidera.2ffbe.mongodb.net/secure-rise');
  
  try {
    await client.connect();
    const db = client.db('secure-rise');
    
    console.log('Testing KYC Achievement...\n');
    
    // Test 1: Check if there are users with approved KYC
    const approvedKYC = await db.collection('kyc').find({ status: 'approved' }).toArray();
    console.log(`Found ${approvedKYC.length} users with approved KYC`);
    
    if (approvedKYC.length > 0) {
      const sampleKYC = approvedKYC[0];
      console.log('\nSample approved KYC:');
      console.log(`User ID: ${sampleKYC.userId}`);
      console.log(`Status: ${sampleKYC.status}`);
      console.log(`Email: ${sampleKYC.userEmail}`);
      
      // Test the getUserStats logic for this user
      const userId = new ObjectId(sampleKYC.userId);
      
      // Get user data
      const user = await db.collection('users').findOne({ _id: userId });
      console.log(`\nUser found: ${!!user}`);
      
      // Check KYC submission
      const kycSubmission = await db.collection('kyc').findOne({ userId, status: 'approved' });
      console.log(`KYC approved: ${!!kycSubmission}`);
      
      // Test the achievement condition
      const kycApproved = !!kycSubmission;
      console.log(`\nAchievement should unlock: ${kycApproved}`);
      
      // Check if achievement is already unlocked
      const userAchievements = await db.collection('userachievements').findOne({ userId });
      const hasKYCAchievement = userAchievements?.achievementsUnlocked?.includes('verify-kyc') || false;
      console.log(`KYC achievement already unlocked: ${hasKYCAchievement}`);
      
      if (kycApproved && !hasKYCAchievement) {
        console.log('\n✅ Achievement should be unlocked for this user!');
      } else if (kycApproved && hasKYCAchievement) {
        console.log('\n✅ Achievement is already unlocked for this user.');
      } else {
        console.log('\n❌ Achievement conditions not met.');
      }
    } else {
      console.log('No users with approved KYC found. Achievement will remain locked.');
    }
    
    // Test 2: Check all users and their KYC status
    console.log('\n\nAll users KYC status:');
    const allUsers = await db.collection('users').find({}).limit(5).toArray();
    
    for (const user of allUsers) {
      const kycStatus = await db.collection('kyc').findOne({ 
        userId: user._id, 
        status: 'approved' 
      });
      
      console.log(`User: ${user.email} - KYC Approved: ${!!kycStatus}`);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config();

testKYCAchievement();
