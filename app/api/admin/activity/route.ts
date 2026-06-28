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
    
    if (!authUser.role || !authUser.role.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const db = await connectToDatabase();
    const activityCollection = db.collection<UserActivity>('userActivity');
    const usersCollection = db.collection<User>('users');

    // Fetch ALL users (no limit)
    const allUsers = await usersCollection.find({}).toArray();

    // Get all user IDs
    const userIds = allUsers.map(u => u._id.toString());

    // Fetch all activity sessions for these users AND anonymous users
    const activities = await activityCollection
      .find({ $or: [{ userId: { $in: userIds } }, { userId: 'anonymous' }] })
      .sort({ lastActivity: -1 })
      .toArray();

    // Group activities by userId to get the latest session per user
    const activityMap = new Map<string, UserActivity>();
    activities.forEach(activity => {
      const existing = activityMap.get(activity.userId);
      if (!existing || activity.lastActivity > existing.lastActivity) {
        activityMap.set(activity.userId, activity);
      }
    });

    // Group ALL activity events by userId (from all sessions)
    const allActivityEventsMap = new Map<string, any[]>();
    activities.forEach(activity => {
      const events = allActivityEventsMap.get(activity.userId) || [];
      // Add session info to each event
      const eventsWithSession = activity.activityEvents.map((ev: any) => ({
        ...ev,
        sessionId: activity.sessionId,
        sessionTime: activity.loginTime.toISOString(),
      }));
      allActivityEventsMap.set(activity.userId, [...events, ...eventsWithSession]);
    });

    // Combine users with their latest activity
    const liveUsers = allUsers.map(user => {
      const activity = activityMap.get(user._id.toString());
      const allEvents = allActivityEventsMap.get(user._id.toString()) || [];
      
      // Sort all events by time (newest first)
      allEvents.sort((a, b) => b.time.localeCompare(a.time));
      
      // Calculate status based on last activity time
      let calculatedStatus: UserStatus = 'offline';
      if (activity) {
        const now = new Date();
        const lastActivityTime = new Date(activity.lastActivity);
        const diffMinutes = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60);
        
        if (diffMinutes <= 10) {
          calculatedStatus = 'online';
        } else if (diffMinutes > 10 && diffMinutes <= 30) {
          calculatedStatus = 'away';
        } else {
          calculatedStatus = 'offline';
        }
      }
      
      // If user has no activity, show as offline with default values
      if (!activity) {
        return {
          id: user._id.toString(),
          fullName: user.fullName || user.username || 'Unknown',
          username: user.username || 'unknown',
          email: user.email || '',
          role: user.role?.includes('admin') ? 'admin' : user.role?.includes('vip') ? 'vip' : 'user',
          status: 'offline' as UserStatus,
          currentPage: 'N/A',
          currentUrl: '',
          lastActivity: 'Never',
          device: 'Unknown',
          browser: 'Unknown',
          os: 'Unknown',
          sessionDuration: '0m',
          country: 'Unknown',
          city: 'Unknown',
          ipAddress: 'Unknown',
          loginTime: 'N/A',
          avatar: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'default'}`,
          timeOnPage: '0s',
          activityFeed: [],
          pageVisitsToday: 0,
          scrollProgress: 0,
          pagesVisited: [],
          vpnDetected: false,
          newDevice: false,
        };
      }

      // Apply status filter if needed
      if (statusFilter && statusFilter !== 'all' && calculatedStatus !== statusFilter) {
        return null;
      }
      
      return {
        id: user._id.toString(),
        fullName: user.fullName || user.username || 'Unknown',
        username: user.username || 'unknown',
        email: user.email || '',
        role: user.role?.includes('admin') ? 'admin' : user.role?.includes('vip') ? 'vip' : 'user',
        status: calculatedStatus,
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
        avatar: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'default'}`,
        timeOnPage: `${activity.timeOnPage}s`,
        activityFeed: allEvents, // ALL events from ALL sessions, newest first
        pageVisitsToday: activity.pagesVisited.length,
        scrollProgress: activity.scrollMilestone,
        pagesVisited: activity.pagesVisited,
        vpnDetected: false,
        newDevice: false,
      };
    }).filter((user): user is NonNullable<typeof user> => user !== null);

    // Add anonymous users (those with userId = 'anonymous')
    const anonymousActivities = activities.filter(a => a.userId === 'anonymous');
    const anonymousUsers = anonymousActivities.map(activity => {
      const allEvents = allActivityEventsMap.get('anonymous') || [];
      
      // Sort all events by time (newest first)
      allEvents.sort((a, b) => b.time.localeCompare(a.time));
      
      // Calculate status based on last activity time
      const now = new Date();
      const lastActivityTime = new Date(activity.lastActivity);
      const diffMinutes = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60);
      
      let calculatedStatus: UserStatus = 'offline';
      if (diffMinutes <= 10) {
        calculatedStatus = 'online';
      } else if (diffMinutes > 10 && diffMinutes <= 30) {
        calculatedStatus = 'away';
      } else {
        calculatedStatus = 'offline';
      }

      return {
        id: `anon_${activity.sessionId}`,
        fullName: 'Anonymous User',
        username: 'anonymous',
        email: '',
        role: 'guest',
        status: calculatedStatus,
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
        avatar: 'https://i.postimg.cc/KvQVp747/anonimous.webp',
        timeOnPage: `${activity.timeOnPage}s`,
        activityFeed: allEvents,
        pageVisitsToday: activity.pagesVisited.length,
        scrollProgress: activity.scrollMilestone,
        pagesVisited: activity.pagesVisited,
        vpnDetected: false,
        newDevice: false,
      };
    });

    // Combine registered users and anonymous users
    const allLiveUsers = [...liveUsers, ...anonymousUsers];

    // Sort by status: online first, then away, then offline
    const statusOrder = { online: 0, away: 1, offline: 2 };
    allLiveUsers.sort((a, b) => {
      const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
      return statusA - statusB;
    });

    return NextResponse.json({ users: allLiveUsers });
  } catch (error) {
    console.error('Admin activity API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
