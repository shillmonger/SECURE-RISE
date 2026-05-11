import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const { client } = await connectToDatabase();
    const db = client.db();

    // Fetch 5 random users who have profile images
    const users = await db.collection<User>('users')
      .aggregate([
        { $match: { 
          isActive: true,
          profileImage: { $exists: true, $ne: null, $nin: [''] }
        }},
        { $sample: { size: 5 } },
        { $project: {
          _id: 1,
          username: 1,
          profileImage: 1,
          fullName: 1
        }}
      ])
      .toArray();

    // If we don't have enough users with profile images, get some without
    if (users.length < 5) {
      const additionalUsers = await db.collection<User>('users')
        .aggregate([
          { $match: { 
            isActive: true,
            $or: [
              { profileImage: { $exists: false } },
              { profileImage: null },
              { profileImage: '' }
            ]
          }},
          { $sample: { size: 5 - users.length } },
          { $project: {
            _id: 1,
            username: 1,
            profileImage: 1,
            fullName: 1
          }}
        ])
        .toArray();

      users.push(...additionalUsers);
    }

    // Use fallback image for users without profile images
    const usersWithAvatars = users.map((user) => ({
      ...user,
      profileImage: user.profileImage || "https://github.com/shadcn.png"
    }));

    return NextResponse.json({ 
      users: usersWithAvatars,
      success: true 
    });

  } catch (error) {
    console.error('Get random users error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch random users' 
    }, { status: 500 });
  }
}
