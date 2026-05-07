# Firebase Cloud Messaging (FCM) Setup Guide

## Overview
This guide will help you set up and test Firebase Cloud Messaging push notifications for your Next.js application. The implementation sends push notifications to admins when users submit new deposits.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install firebase admin
```

### 2. Environment Variables
Your `.env.local` already contains all required Firebase variables:

```env
# Firebase Web App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAO1Ca6mEVZhylaj2EXGAjMImUibvScNxM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rise-fa2cf.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rise-fa2cf
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rise-fa2cf.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=487188329575
NEXT_PUBLIC_FIREBASE_APP_ID=1:487188329575:web:dec7bbabbea0fe772550c2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3B23JW97ER

# VAPID Key for Web Push
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BOsA5uGyNsInoOj9HByuk08aQYrONQKIDzky8DcM_rBLQNXj6NQZyAng-dc4Nm-CyWSmENhXI51RbreKgfNqE2k

# Firebase Admin SDK
FIREBASE_PROJECT_ID=rise-fa2cf
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@rise-fa2cf.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2Zq+O6ZK22pmO\nuFuEwoAbiIHcknxj8+VwuExrfH25WikU0lK7VgCZlEDj4ED1uvK0zDsgw4+BM8Bl\nPqMCGzgJfGUyLkrmQuDUWO3j/jFTp1BmOI6WlL821HL34HbTJ36JUb/Y9sFGOkmk\nUyRSNGOkxhsIsRNTrr9ttbXDBtRuaBjnpsp7oLCHy8nC7nxLltZVlAnlh6nH8SUN\nRmPb9p4CXzn+DUQ8Nh/G58ydt/PwvdsMcqfEE0KuCORYLJiXtKGpr8o4uJF9TPAw\nbPFqsdiUGatSwKsTj8j+ACZsxivKQ/YqUXFOjvvLQVR1LiQzQ6S5ebkveJFmF1+A\n6ML4vjGPAgMBAAECggEAKkpWrAD11lWKwu91sKtT/o5A5b5E/vu+l8rzVPyRPdds\nrPoy2mKPUwxvmyYUiaTlvwuXLfqJnEA+fHrwWn2rGW/xGphnH0okTLetuG3oS+gA\nGSNF1B3606CgY150znJawUXmAEz99OVwy5vHURP6gmq4O+SqgX2DvtEhqm079bji\nPKLzJQTcheQEQ7Dw07KD4XllO9SM0SMYEiuPRuUuVd7uI8VTNoyO6zvSdhpFsKZU\ngyhOyVieojcl33oTqeePC0LLi1uQb7bHlRgU7Mx3ii50QVNArCeakg8PVrKw31W6\n5QeLvsXVDfKY4ST625penTSCL3Xc0fahslEED+JHwQKBgQDwoM7OPeQ/tWruWiF+\neTZ8eSStMZFnYpQJcc3CqQjW9OZUVUfRW98gfri28XK+aulFp2zI7OhiZQUTAzmr\n/yAOPa5/4AIRhP1XdXhVbY1of9oWEbjAvp1LFRSq4EIWghtQ7rethJ3EKCrofRzU\nHki0cGOc96yMPlVXYz8lYTbjYQKBgQDCDaSNmmo3Di2r2nfm8uL2Cfg0IUo75eVZ\n7Bw6ypEYQeXM1LO9/Dn+mD+RGZ22mArY3HnM0cCm6/gSypAtgqQX6jJWUphp2CUn\nAsQN2OV9Qodp/jRgV71CBasM7mrJAxth6eYjlEXUQanbwevx1963E/sDO8FeIXMF\nn5ARdHIq7wKBgDRV5WT6FSC+Jom81LgbSPx9pLp+o29nA2eiduw1s5R9I3OIMNya\nLMd2iFpR3XEI87+QkJqK3Gg6LIZcFzkPfjtasw9g+1IwKKHTDN8Xur/Vvus544MY\nckGYTix0JiubFLHfmdeFloLJcburKpAAHjQQlbnYLJE8JXeiQGOy5ytBAoGATDir\nn+s9OS7ahZwkaJSSzW2RDnjc/bYJZk61r+oNH+gSaWhKyZ8e8H/AyC+1oRkLea7w\nMKFa+LXLFSZ3h0i/R5139CwxLbH2teICPCYrzg2pvtpYnFcaQaqUS1oCm74arVUA\nTo1Y+ExqeaUsFixikKrKd7Sq+VxOH7FTF2gTyAUCgYA3+ye8KQpM/cTXBfZMtYyJ\niCx/iGb+xJRU7PxZILxknzgRJyNDFsIQ9lJ+g1l70mx1it+eA4Kh0m2pY4tpIPc7\nWyhJa3N5raDq2hU7yR8lStiSDUY2kpqjONFBY7jrQkNGEIfohC1j4ACpSK/uvGLW\nqDdT7uGcNnd9wYwGiDG8vg==\n-----END PRIVATE KEY-----"
```

## 📁 Files Created

### 1. Firebase Configuration Files
- `lib/firebase.ts` - Client-side Firebase configuration
- `lib/firebase-admin.ts` - Server-side Firebase Admin SDK configuration

### 2. Service Worker
- `public/firebase-messaging-sw.js` - FCM service worker for background messages

### 3. API Endpoints
- `app/api/fcm/token/route.ts` - FCM token registration for admins

### 4. React Hooks
- `hooks/useFCM.ts` - Custom hook for FCM token management

### 5. Components
- `components/admin-dashboard/NotificationSettings.tsx` - Admin notification settings UI

### 6. Integration
- Updated `app/api/user-dashboard/deposit/route.ts` - Added FCM notification trigger
- Updated `components/admin-dashboard/AdminHeader.tsx` - Added notification settings

## 🔧 How It Works

### Deposit Flow
1. User submits deposit → `/api/user-dashboard/deposit`
2. Email notification sent to admins (existing functionality)
3. **NEW**: FCM push notification sent to all admins with registered tokens

### Admin Notification Setup
1. Admin logs in to dashboard
2. Notification bell appears in bottom-right corner
3. Admin clicks bell → requests notification permission
4. FCM token generated and saved to database
5. Admin receives push notifications for new deposits

## 🧪 Testing Guide

### 1. Local Development Testing

#### Step 1: Install Dependencies
```bash
npm install firebase admin
```

#### Step 2: Start Development Server
```bash
npm run dev
```

#### Step 3: Test as Admin
1. Login as admin user
2. Go to admin dashboard
3. Click notification bell (bottom-right)
4. Grant notification permission
5. Verify token is registered (check browser console)

#### Step 4: Test Deposit Notification
1. Login as regular user
2. Go to `/user-dashboard/deposit/[id]` (any payment method)
3. Submit a deposit with proof image
4. Check admin browser for push notification

### 2. Testing Scenarios

#### ✅ Foreground Notifications
- Admin has admin dashboard open
- Notification appears as browser notification
- Clicking notification redirects to investment payouts

#### ✅ Background Notifications
- Admin browser is minimized or on another tab
- Notification appears as system notification
- Clicking notification opens admin dashboard

#### ✅ Service Worker Testing
```javascript
// Test in browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

### 3. Debugging Tools

#### Browser Console
```javascript
// Check notification permission
console.log('Permission:', Notification.permission);

// Check service worker
navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
  .then(registration => console.log('SW Registration:', registration));

// Test FCM token generation
import { requestNotificationPermission } from './lib/firebase.js';
requestNotificationPermission().then(token => console.log('Token:', token));
```

#### Server Logs
Check your server logs for:
- `FCM token registered successfully`
- `Push notification sent to X admin(s)`
- `Found X admin FCM tokens`

## 🔧 Firebase Console Setup

### 1. Project Configuration
Your Firebase project `rise-fa2cf` is already configured with:
- Web App credentials
- Cloud Messaging API enabled
- VAPID key generated

### 2. Service Account
The service account key is already in your `.env.local`:
- Email: `firebase-adminsdk-fbsvc@rise-fa2cf.iam.gserviceaccount.com`
- Private key: Already configured

### 3. Web Push Certificates
VAPID key is already configured:
- Public key: `BOsA5uGyNsInoOj9HByuk08aQYrONQKIDzky8DcM_rBLQNXj6NQZyAng-dc4Nm-CyWSmENhXI51RbreKgfNqE2k`

## 🚨 Common Issues & Solutions

### 1. Permission Denied
**Issue**: User blocks notifications
**Solution**: 
- Click lock icon in browser address bar
- Change notification permission to "Allow"
- Refresh page

### 2. Service Worker Not Registered
**Issue**: `firebase-messaging-sw.js` not found
**Solution**: 
- Ensure file is in `public/` directory
- Restart development server
- Clear browser cache

### 3. FCM Token Not Generated
**Issue**: Token generation fails
**Solution**:
- Check HTTPS (required for production)
- Verify VAPID key configuration
- Check browser console for errors

### 4. Notifications Not Received
**Issue**: Token registered but no notifications
**Solution**:
- Check admin role in database
- Verify token is saved in `users` collection
- Check server logs for FCM errors
- Test with different browsers

### 5. Background Notifications Not Working
**Issue**: Only foreground notifications work
**Solution**:
- Ensure service worker is properly registered
- Check `firebase-messaging-sw.js` is accessible
- Verify HTTPS in production

## 📱 Browser Support

FCM supports:
- ✅ Chrome (desktop & mobile)
- ✅ Firefox (desktop & mobile)
- ✅ Safari (desktop & mobile) - requires HTTPS
- ✅ Edge (desktop & mobile)

## 🔒 Security Considerations

1. **Admin Only**: Only admin users can register FCM tokens
2. **Token Validation**: Server validates admin role before saving tokens
3. **HTTPS Required**: Production requires HTTPS for notifications
4. **VAPID Key**: Securely stored in environment variables

## 🚀 Production Deployment

### Vercel Deployment
1. Ensure all environment variables are set in Vercel
2. HTTPS is automatically handled
3. Service worker will be served from CDN

### Manual Deployment
1. Set up HTTPS certificate
2. Ensure `firebase-messaging-sw.js` is accessible
3. Configure CDN for service worker caching

## 📊 Monitoring

### Firebase Console
- Monitor message delivery rates
- Check error logs
- Analyze notification engagement

### Application Logs
- Track token registration
- Monitor notification sends
- Debug failed deliveries

## 🔄 Maintenance

### Token Cleanup
```javascript
// Remove invalid tokens (run periodically)
const cleanupTokens = async () => {
  const admins = await getAdminFCMTokens();
  // Test each token and remove invalid ones
};
```

### Updates
- Keep Firebase SDK versions updated
- Monitor Firebase API changes
- Test with new browser versions

---

## 🎯 Success Checklist

- [ ] Dependencies installed (`firebase`, `admin`)
- [ ] Admin can register for notifications
- [ ] Deposit submission triggers push notification
- [ ] Notifications work in foreground
- [ ] Notifications work in background
- [ ] Notifications work across different tabs
- [ ] Browser compatibility tested
- [ ] Production deployment verified

Your FCM implementation is now complete! 🎉
