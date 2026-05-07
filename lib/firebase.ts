import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get messaging instance (client-side only)
const getMessagingInstance = () => {
  if (typeof window !== 'undefined' && 'navigator' in window) {
    return getMessaging(app);
  }
  return null;
};

// Request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !('navigator' in window)) {
      console.log('Firebase messaging can only be used in a browser environment');
      return null;
    }

    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      const messaging = getMessagingInstance();
      if (!messaging) {
        console.error('Firebase messaging not available');
        return null;
      }
      
      console.log('Getting FCM token...');
      console.log('VAPID Key:', process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);
      
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied:', permission);
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = () => {
  const messaging = getMessagingInstance();
  if (!messaging) {
    console.error('Firebase messaging not available for foreground messages');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Show notification in foreground
    if (payload.notification) {
      new Notification(payload.notification.title || 'New Notification', {
        body: payload.notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.tag || 'default',
        requireInteraction: false,
      });
    }
  });
};

// Get current FCM token (without requesting permission)
export const getCurrentToken = async (): Promise<string | null> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !('navigator' in window)) {
      console.log('Firebase messaging can only be used in a browser environment');
      return null;
    }

    const messaging = getMessagingInstance();
    if (!messaging) {
      console.error('Firebase messaging not available');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error('Error getting current token:', error);
    return null;
  }
};

export { app };
