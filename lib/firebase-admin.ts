import admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const sendPushNotification = async (
  tokens: string[],
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
  },
  data?: Record<string, string>
): Promise<{ success: number; failure: number; results: any[] }> => {
  try {
    const message = {
      notification,
      data: data || {},
      tokens,
      webpush: {
        headers: {
          TTL: '3600', // Time to live in seconds
        },
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/favicon.ico',
          badge: notification.badge || '/favicon.ico',
          tag: notification.tag || 'default',
          requireInteraction: false,
          actions: [
            {
              action: 'view',
              title: 'View Deposit'
            }
          ]
        },
        fcm_options: {
          link: '/admin-dashboard/investment-payouts' // Redirect admins to investment payouts page
        }
      }
    };

    const messaging = admin.messaging();
    
    // Use individual sends instead of multicast if sendMulticast is not available
    const promises = tokens.map(token => {
      const individualMessage = {
        ...message,
        token: token
      };
      return messaging.send(individualMessage);
    });

    const results = await Promise.allSettled(promises);
    
    // Count successes and failures
    const successCount = results.filter(result => 
      result.status === 'fulfilled'
    ).length;
    const failureCount = results.filter(result => 
      result.status === 'rejected'
    ).length;

    console.log('Push notification sent successfully:', {
      successCount,
      failureCount,
      totalTokens: tokens.length
    });

    return {
      success: successCount,
      failure: failureCount,
      results: results
    };
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

// Send notification to a single token
export const sendSinglePushNotification = async (
  token: string,
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
  },
  data?: Record<string, string>
): Promise<void> => {
  try {
    const message = {
      token,
      notification,
      data: data || {},
      webpush: {
        headers: {
          TTL: '3600',
        },
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/favicon.ico',
          badge: notification.badge || '/favicon.ico',
          tag: notification.tag || 'default',
          requireInteraction: false,
          actions: [
            {
              action: 'view',
              title: 'View Deposit'
            }
          ]
        },
        fcm_options: {
          link: '/admin-dashboard/investment-payouts'
        }
      }
    };

    await admin.messaging().send(message);
    console.log('Single push notification sent successfully');
  } catch (error) {
    console.error('Error sending single push notification:', error);
    throw error;
  }
};

// Get all admin FCM tokens from database
export const getAdminFCMTokens = async (): Promise<string[]> => {
  try {
    // Import MongoDB connection
    const { connectToDatabase } = await import('./mongodb');
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Find all admin users with FCM tokens
    const admins = await usersCollection.find(
      { 
        role: 'admin', 
        fcmToken: { $exists: true, $ne: '' } 
      },
      { 
        projection: { fcmToken: 1, username: 1 } 
      }
    ).toArray();
    
    const tokens = admins.map(admin => admin.fcmToken).filter(Boolean);
    
    console.log(`Found ${tokens.length} admin FCM tokens from ${admins.length} admin users`);
    return tokens;
  } catch (error) {
    console.error('Error fetching admin FCM tokens:', error);
    return [];
  }
};

export default admin;
