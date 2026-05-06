import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        success: true, 
        users: [] 
      });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Search users by username, email, or full name
    // Exclude the current user from results
    const searchRegex = new RegExp(query.trim(), 'i');
    const users = await db.collection('users')
      .find({
        $and: [
          { email: { $ne: authUser.email } }, // Exclude current user
          {
            $or: [
              { username: searchRegex },
              { email: searchRegex },
              { fullName: searchRegex }
            ]
          }
        ]
      })
      .project({
        _id: 1,
        username: 1,
        email: 1,
        fullName: 1,
        profileImage: 1
      })
      .limit(10)
      .toArray();

    // Format users with default profile image if needed
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.fullName || user.username,
      username: user.username,
      email: user.email,
      avatar: user.profileImage || 'https://github.com/shadcn.png'
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
