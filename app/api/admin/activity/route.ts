import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { UserActivity, UserStatus } from '@/lib/models/UserActivity';
import { User } from '@/lib/models/User';
import { formatSessionDuration, formatRelativeTime } from '@/lib/activity-tracker';

// GET - Fetch all live user activity data
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!authUser.role.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const db = await connectToDatabase();
    const activityCollection = db.collection<UserActivity>('userActivity');
    const usersCollection = db.collection<User>('users');

    // Build query
    const query: any = {};
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter as UserStatus;
    }

    // Fetch activity sessions
    const activities = await activityCollection
      .find(query)
      .sort({ lastActivity: -1 })
      .limit(100)
      .toArray();

    // Get user IDs
    const userIds = activities.map(a => a.userId);
    const users = await usersCollection
      .find({ _id: { $in: userIds.map(id => new ObjectId(id)) } })
      .toArray();

    // Create user map
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    // Combine activity with user data
    const liveUsers = activities.map(activity => {
      const user = userMap.get(activity.userId);
      
      return {
        id: activity.sessionId,
        fullName: user?.fullName || user?.username || 'Unknown',
        username: user?.username || 'unknown',
        email: user?.email || '',
        role: user?.role?.includes('admin') ? 'admin' : user?.role?.includes('vip') ? 'vip' : 'user',
        status: activity.status,
        currentPage: activity.currentPage,
        currentUrl: activity.currentUrl,
        lastActivity: formatRelativeTime(activity.lastActivity),
        device: activity.device,
        browser: activity.browser,
        os: activity.operatingSystem,
        sessionDuration: formatSessionDuration(activity.loginTime),
        country: activity.country || 'Unknown',
        city: activity.city || 'Unknown',
        ipAddress: activity.ipAddress || 'Unknown',
        loginTime: activity.loginTime.toTimeString().split(' ')[0],
        avatar: user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`,
        timeOnPage: `${activity.timeOnPage}s`,
        activityFeed: activity.activityEvents.slice(-10).reverse(), // Last 10 events
        pageVisitsToday: activity.pagesVisited.length,
        scrollProgress: activity.scrollMilestone,
        pagesVisited: activity.pagesVisited,
        vpnDetected: false, // Could be implemented later
        newDevice: false, // Could be implemented later
      };
    });

    // Sort by status: online first, then away, then offline
    const statusOrder = { online: 0, away: 1, offline: 2 };
    liveUsers.sort((a, b) => {
      const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
      return statusA - statusB;
    });

    return NextResponse.json({ users: liveUsers });
  } catch (error) {
    console.error('Admin activity API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
