// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyAO1Ca6mEVZhylaj2EXGAjMImUibvScNxM",
  authDomain: "rise-fa2cf.firebaseapp.com",
  projectId: "rise-fa2cf",
  storageBucket: "rise-fa2cf.firebasestorage.app",
  messagingSenderId: "487188329575",
  appId: "1:487188329575:web:dec7bbabbea0fe772550c2",
  measurementId: "G-3B23JW97ER"
};

firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.data?.tag || 'default',
    requireInteraction: false,
    data: payload.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Deposit'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // Get the notification data
  const notificationData = event.notification.data || {};
  
  // Define the URL to open
  const urlToOpen = notificationData.link || '/admin-dashboard/investment-payouts';

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if a client with the URL is already open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // If no client is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle push events (for when the app is closed)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received.');

  if (!event.data) {
    console.log('[firebase-messaging-sw.js] Push event has no data.');
    return;
  }

  const data = event.data.json();
  const title = data.notification?.title || 'New Notification';
  const options = {
    body: data.notification?.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.data?.tag || 'default',
    requireInteraction: false,
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Deposit'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
