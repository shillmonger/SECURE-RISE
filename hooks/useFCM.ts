import { useEffect, useState } from 'react';
import { 
  requestNotificationPermission, 
  getCurrentToken, 
  onForegroundMessage 
} from '@/lib/firebase';

// Client-side function to get current user
const getCurrentUser = async () => {
  try {
    const response = await fetch('/api/user/info', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const useFCM = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Restore token from localStorage on mount and verify with server
  useEffect(() => {
    const restoreToken = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('fcmToken');
        const savedPermission = localStorage.getItem('fcmPermission') as NotificationPermission;
        
        if (savedToken) {
          console.log('Found saved FCM token, verifying...');
          setToken(savedToken);
          
          // Verify token with server
          try {
            const response = await fetch('/api/fcm/token', {
              method: 'GET',
              credentials: 'include',
            });
            
            if (!response.ok) {
              console.log('Token verification failed, clearing saved token');
              setToken(null);
              localStorage.removeItem('fcmToken');
              localStorage.removeItem('fcmPermission');
              return;
            }
            
            console.log('Token verified successfully');
          } catch (error) {
            console.error('Error verifying token:', error);
          }
        }
        
        if (savedPermission) {
          setPermissionStatus(savedPermission);
        }
      }
    };

    restoreToken();
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('fcmToken', token);
      } else {
        localStorage.removeItem('fcmToken');
      }
    }
  }, [token]);

  // Save permission to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fcmPermission', permissionStatus);
    }
  }, [permissionStatus]);

  // Check if FCM is supported
  useEffect(() => {
    const checkSupport = () => {
      console.log('Starting FCM support check...');
      console.log('Environment info:', {
        isBrowser: typeof window !== 'undefined',
        isNavigator: typeof navigator !== 'undefined',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
        isSecure: typeof window !== 'undefined' ? window.isSecureContext : 'N/A',
        protocol: typeof window !== 'undefined' ? window.location?.protocol : 'N/A'
      });

      // Only check if we're in a browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        console.log('FCM support check: Not in browser environment');
        setIsSupported(false);
        return;
      }

      // Check HTTPS requirement for push notifications
      if (!window.isSecureContext) {
        console.warn('FCM support check: Not in secure context (HTTPS required for push notifications)');
        setIsSupported(false);
        return;
      }

      const hasNotification = 'Notification' in window;
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasPushManager = 'PushManager' in window;
      const supported = hasNotification && hasServiceWorker && hasPushManager;
      
      console.log('FCM support check results:', {
        hasNotification,
        hasServiceWorker,
        hasPushManager,
        isSupported: supported,
        currentPermission: hasNotification ? Notification.permission : 'N/A'
      });
      
      setIsSupported(supported);
      
      if (supported) {
        setPermissionStatus(Notification.permission);
      }
    };

    // Delay the check slightly to ensure the page is fully loaded
    const timer = setTimeout(checkSupport, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Listen for foreground messages
  useEffect(() => {
    if (isSupported) {
      onForegroundMessage();
    }
  }, [isSupported]);

  // Register FCM token for admin users
  const registerToken = async () => {
    if (!isSupported) {
      console.error('FCM is not supported in this browser');
      return false;
    }

    setIsLoading(true);
    
    try {
      // Get current user
      const user = await getCurrentUser();
      
      if (!user || !user.role.includes('admin')) {
        console.log('Only admin users can register FCM tokens');
        return false;
      }

      // Request permission and get token
      const fcmToken = await requestNotificationPermission();
      
      if (!fcmToken) {
        console.error('Failed to get FCM token');
        return false;
      }

      // Send token to backend
      const response = await fetch('/api/fcm/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to register token with backend');
      }

      const result = await response.json();
      
      if (result.success) {
        setToken(fcmToken);
        setPermissionStatus('granted');
        console.log('FCM token registered successfully');
        return true;
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering FCM token:', error);
      setPermissionStatus('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get current token without requesting permission
  const getCurrentTokenAsync = async () => {
    if (!isSupported) return null;
    
    try {
      const currentToken = await getCurrentToken();
      setToken(currentToken);
      return currentToken;
    } catch (error) {
      console.error('Error getting current token:', error);
      return null;
    }
  };

  // Remove FCM token
  const removeToken = async () => {
    if (!token) return false;

    try {
      const response = await fetch('/api/fcm/token', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove token from backend');
      }

      const result = await response.json();
      
      if (result.success) {
        setToken(null);
        console.log('FCM token removed successfully');
        return true;
      } else {
        throw new Error(result.error || 'Removal failed');
      }
    } catch (error) {
      console.error('Error removing FCM token:', error);
      return false;
    }
  };

  // Auto-register for admin users
  const autoRegisterForAdmin = async () => {
    try {
      const user = await getCurrentUser();
      
      if (user && user.role.includes('admin') && permissionStatus === 'default') {
        await registerToken();
      }
    } catch (error) {
      console.error('Error in auto-register:', error);
    }
  };

  return {
    token,
    permissionStatus,
    isLoading,
    isSupported,
    registerToken,
    removeToken,
    getCurrentToken: getCurrentTokenAsync,
    autoRegisterForAdmin,
  };
};
