import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ACHIEVEMENTS, getUserStats } from '../route';


export async function POST(request: NextRequest) {
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
    
    // Get current user achievements
    const existingUserAchievements = await db.collection('userachievements')
      .findOne({ userId });
    
    const unlockedAchievementIds = new Set(
      existingUserAchievements?.achievementsUnlocked || []
    );
    
    // Get user stats
    const userStats = await getUserStats(userId);
    
    // Check for new achievements
    const newAchievements: any[] = [];
    
    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedAchievementIds.has(achievement.id)) {
        const isUnlocked = achievement.checkFunction(user, userStats);
        
        if (isUnlocked) {
          newAchievements.push({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            category: achievement.category,
            rarity: achievement.rarity,
            xp: achievement.xp,
            unlockedAt: new Date()
          });
          unlockedAchievementIds.add(achievement.id);
        }
      }
    }
    
    // Save new achievements if any
    if (newAchievements.length > 0) {
      // Calculate total XP for new achievements
      const totalNewXP = newAchievements.reduce((sum, achievement) => sum + achievement.xp, 0);
      
      // Update userachievements collection
      await db.collection('userachievements').updateOne(
        { userId },
        {
          $push: { achievementsUnlocked: { $each: newAchievements.map(a => a.id) } } as any,
          $inc: { totalXP: totalNewXP },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );
      
      return NextResponse.json({
        success: true,
        newAchievements,
        totalNewXP,
        message: `Unlocked ${newAchievements.length} new achievement(s)!`
      });
    }
    
    return NextResponse.json({
      success: true,
      newAchievements: [],
      totalNewXP: 0,
      message: 'No new achievements to unlock'
    });
    
  } catch (error) {
    console.error('Achievement check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
