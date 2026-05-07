// Test script for Firebase Cloud Messaging
// Run this script to test FCM functionality

const { initializeApp } = require('firebase/app');
const { getMessaging, getToken } = require('firebase/messaging');

// Firebase config from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyAO1Ca6mEVZhylaj2EXGAjMImUibvScNxM",
  authDomain: "rise-fa2cf.firebaseapp.com",
  projectId: "rise-fa2cf",
  storageBucket: "rise-fa2cf.firebasestorage.app",
  messagingSenderId: "487188329575",
  appId: "1:487188329575:web:dec7bbabbea0fe772550c2",
  measurementId: "G-3B23JW97ER"
};

// Test FCM token generation
async function testFCMToken() {
  try {
    console.log('Testing FCM token generation...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    
    // Request permission and get token
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: "BOsA5uGyNsInoOj9HByuk08aQYrONQKIDzky8DcM_rBLQNXj6NQZyAng-dc4Nm-CyWSmENhXI51RbreKgfNqE2k"
      });
      
      console.log('FCM Token generated successfully:');
      console.log(token);
      
      // Test sending token to backend
      const response = await fetch('/api/fcm/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken: token }),
      });
      
      if (response.ok) {
        console.log('✅ FCM token registered successfully');
      } else {
        console.log('❌ Failed to register FCM token');
      }
    } else {
      console.log('❌ Notification permission denied');
    }
  } catch (error) {
    console.error('❌ Error testing FCM:', error);
  }
}

// Test notification permission
function testNotificationPermission() {
  console.log('Current notification permission:', Notification.permission);
  
  if ('Notification' in window) {
    console.log('✅ Notifications are supported');
  } else {
    console.log('❌ Notifications are not supported');
  }
  
  if ('serviceWorker' in navigator) {
    console.log('✅ Service Workers are supported');
  } else {
    console.log('❌ Service Workers are not supported');
  }
  
  if ('PushManager' in window) {
    console.log('✅ Push API is supported');
  } else {
    console.log('❌ Push API is not supported');
  }
}

// Test service worker registration
async function testServiceWorker() {
  try {
    console.log('Testing service worker registration...');
    
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service worker registered successfully');
    console.log('Service worker scope:', registration.scope);
    
    return registration;
  } catch (error) {
    console.error('❌ Service worker registration failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Running FCM Tests...\n');
  
  testNotificationPermission();
  console.log('\n');
  
  await testServiceWorker();
  console.log('\n');
  
  await testFCMToken();
}

// Export functions for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testFCMToken,
    testNotificationPermission,
    testServiceWorker,
    runAllTests
  };
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 FCM Test Script Loaded');
  console.log('Run runAllTests() to test everything');
}
