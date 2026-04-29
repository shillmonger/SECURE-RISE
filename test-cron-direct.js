// Direct test of the cron job logic
const { connectToDatabase } = require('./lib/mongodb');

async function testCronLogic() {
  try {
    console.log('=== TESTING CRON LOGIC DIRECTLY ===');
    
    const db = await connectToDatabase();
    const now = new Date();
    
    console.log('Current time:', now.toISOString());
    
    // First, let's see all investments to debug
    const allInvestments = await db.collection('investments').find({}).toArray();
    console.log('Total investments in database:', allInvestments.length);
    
    // Get all active investments
    const activeInvestments = await db.collection('investments')
      .find({ 
        status: 'active',
        endDate: { $gt: now } // Only investments that haven't ended
      })
      .toArray();

    console.log('Found active investments:', activeInvestments.length);
    console.log('All investments query status: active, endDate >', now.toISOString());
    
    // Log details of all investments for debugging
    allInvestments.forEach(inv => {
      console.log('Investment:', {
        id: inv._id,
        status: inv.status,
        endDate: inv.endDate,
        endDateISO: new Date(inv.endDate).toISOString(),
        nowISO: now.toISOString(),
        endDateValid: new Date(inv.endDate) > now
      });
    });
    
    console.log('=== END TEST ===');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testCronLogic();
