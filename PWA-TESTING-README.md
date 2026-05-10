# PWA Testing & Verification Checklist

## 🚀 Quick Start Testing

### 1. Build and Test Locally
```bash
# Build the application
npm run build

# Start production server
npm start

# Or test with a local HTTPS server
npx serve -s out -l 3000 --ssl
```

### 2. Chrome DevTools Verification

#### Application Tab
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** section:
   - [ ] Manifest loads without errors
   - [ ] Name and short_name are correct
   - [ ] Icons are properly referenced
   - [ ] Start URL and scope are correct
   - [ ] Display mode is "standalone"

#### Service Workers
1. Go to **Service Workers** section:
   - [ ] Service worker is registered and active
   - [ ] Status shows "activated"
   - [ ] Check "Offline" to test offline functionality
   - [ ] Update on reload works correctly

#### Storage
1. Go to **Storage** tab:
   - [ ] Cache storage contains your app caches
   - [ ] IndexedDB has necessary data (if applicable)

### 3. Installability Test

#### Desktop Chrome
1. Open your app in Chrome
2. Look for install icon in address bar
3. [ ] Install prompt appears
4. [ ] Click install and verify app opens in standalone mode
5. [ ] Check app appears in system applications

#### Mobile Testing
1. **Android Chrome**:
   - [ ] Install prompt appears
   - [ ] App installs to home screen
   - [ ] Opens in standalone mode
   - [ ] Splash screen displays correctly

2. **iOS Safari**:
   - [ ] Share button shows "Add to Home Screen"
   - [ ] App installs correctly
   - [ ] Opens in standalone mode
   - [ ] Status bar and safe area work correctly

### 4. Offline Functionality Test

1. Disconnect from internet
2. Open the installed PWA
3. [ ] App loads cached pages
4. [ ] Navigation between cached pages works
5. [ ] Offline fallback page displays for uncached content
6. [ ] App shows appropriate offline indicators

### 5. Performance Testing

#### Lighthouse Audit
1. Run Lighthouse audit in DevTools
2. [ ] PWA score is 90+ 
3. [ ] Installable criteria met
4. [ ] Works offline criteria met
5. [ ] Performance score is acceptable

#### Network Throttling
1. Use DevTools Network throttling
2. [ ] App loads reasonably on slow 3G
3. [ ] Service worker caching works
4. [ ] Images load progressively

## 📱 Device-Specific Testing

### iOS Testing
- [ ] Test on iPhone (iOS 13+)
- [ ] Test on iPad
- [ ] Verify safe area insets
- [ ] Test status bar appearance
- [ ] Verify home screen icon quality

### Android Testing  
- [ ] Test on various Android versions
- [ ] Verify adaptive icons
- [ ] Test splash screens
- [ ] Check notification permissions

### Desktop Testing
- [ ] Test on Chrome
- [ ] Test on Edge
- [ ] Test on Firefox (limited PWA support)
- [ ] Verify window controls and title bar

## 🔧 Advanced Testing

### Service Worker Testing
```javascript
// Test service worker registration in console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});

// Test cache contents
caches.keys().then(cacheNames => {
  return Promise.all(
    cacheNames.map(cacheName => {
      return caches.open(cacheName).then(cache => {
        return cache.keys().then(keys => {
          console.log(`Cache ${cacheName}:`, keys);
        });
      });
    })
  );
});
```

### Push Notifications (Future)
- [ ] Test notification permissions
- [ ] Test push notification delivery
- [ ] Test notification click handling
- [ ] Test notification styling

## ✅ Final Verification Checklist

### Core PWA Requirements
- [ ] Serves over HTTPS (production)
- [ ] Has valid Web App Manifest
- [ ] Has service worker registered
- [ ] Works offline
- [ ] Is installable

### User Experience
- [ ] Loads quickly on 3G
- [ ] Responsive design works on all devices
- [ ] Touch targets are appropriate size
- [ ] No horizontal scroll on mobile
- [ ] Text is readable without zooming

### Technical Requirements
- [ ] No console errors in production
- [ ] All images have proper alt text
- [ ] Forms work offline where appropriate
- [ ] Back button functions correctly
- [ ] Deep links work in standalone mode

## 🐛 Common Issues & Solutions

### Install Prompt Not Showing
- Check if user already dismissed the prompt
- Verify HTTPS is being used
- Check service worker is active
- Verify manifest is valid

### Service Worker Not Updating
- Clear browser cache and service workers
- Check cache versioning
- Verify skipWaiting() is implemented

### Offline Issues
- Check cache strategies in service worker
- Verify fallback pages exist
- Test network-first vs cache-first strategies

### Icon Issues
- Verify all icon sizes are present
- Check file formats (PNG required)
- Verify paths in manifest are correct

## 📊 Performance Benchmarks

### Good Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1

### Cache Size Targets
- Total cache size: < 50MB
- Individual cache: < 10MB
- Cache expiration: 30 days for static assets

## 🔍 Debug Tools

### Chrome Extensions
- PWA Builder Extension
- Service Worker Toolbox
- Manifest Viewer

### Console Commands
```javascript
// Check PWA install status
navigator.standalone // iOS
window.matchMedia('(display-mode: standalone)').matches // Android/Desktop

// Check service worker status
navigator.serviceWorker.controller

// Clear all caches
caches.keys().then(cacheNames => {
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
});
```

Remember to test thoroughly across different devices and network conditions before deploying to production!
