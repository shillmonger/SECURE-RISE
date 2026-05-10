# PWA Troubleshooting Guide

## 🚨 Common PWA Issues & Solutions

### 1. Install Prompt Not Showing

**Problem**: The install prompt never appears on desktop or mobile.

**Causes & Solutions**:
- **Not served over HTTPS**: PWAs require HTTPS in production
  - Solution: Deploy to a service that provides HTTPS (Vercel, Netlify, etc.)
  
- **Service worker not active**: Service worker must be installed and active
  - Check: `navigator.serviceWorker.controller` in console
  - Solution: Ensure service worker is properly registered and activated

- **User already dismissed prompt**: Chrome remembers dismissal
  - Solution: Clear site data or use incognito mode for testing
  
- **Manifest validation errors**: Invalid manifest prevents installability
  - Check: Chrome DevTools → Application → Manifest
  - Solution: Fix manifest.json syntax and required fields

- **Missing icons**: All referenced icons must exist and be accessible
  - Solution: Verify all icon paths are correct and files exist

### 2. Service Worker Not Working

**Problem**: Service worker fails to register or update properly.

**Common Issues**:
```javascript
// Check service worker status
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registrations:', registrations);
});
```

**Solutions**:
- **Scope mismatch**: Service worker scope must cover all pages
  - Solution: Place service worker at root or adjust scope in manifest

- **CORS issues**: Service worker must be served from same origin
  - Solution: Ensure service worker is served from your domain

- **Cache errors**: Invalid cache operations can break service worker
  - Solution: Add proper error handling in fetch events

- **Development vs Production**: Service worker disabled in dev by default
  - Check `next.config.ts` for `disable: process.env.NODE_ENV === 'development'`

### 3. Offline Functionality Issues

**Problem**: App doesn't work properly offline.

**Debugging Steps**:
1. Open Chrome DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Navigate through your app
4. Check Network tab for failed requests

**Common Solutions**:
- **Missing cache strategies**: Implement proper caching in service worker
- **Incorrect cache keys**: Ensure cache names match between install and fetch events
- **Network-only requests**: Some requests may bypass cache intentionally
- **Cache expiration**: Check if cached content has expired

### 4. Icon and Display Issues

**Problem**: Icons don't display correctly or app doesn't look native.

**Solutions**:
- **Missing icon sizes**: Include all required sizes (72x72 to 512x512)
- **Wrong file formats**: Use PNG for icons, avoid SVG in manifest
- **Adaptive icons missing**: Android requires adaptive icon support
- **Safe area insets**: iOS requires proper meta tags for safe areas

### 5. iOS Specific Issues

**Problem**: PWA doesn't work properly on iOS devices.

**Common iOS Issues**:
- **No install prompt**: iOS doesn't show install prompts like Android
  - Solution: Users must manually "Add to Home Screen"
  
- **Status bar issues**: Wrong status bar appearance
  - Solution: Use proper meta tags for status bar style
  
- **Safe area problems**: Content overlaps with notch/home indicator
  - Solution: Use CSS env() variables for safe areas
  
- **Safari caching**: Aggressive caching can cause issues
  - Solution: Implement proper cache busting strategies

### 6. Performance Issues

**Problem**: PWA is slow or uses too much data.

**Optimization Tips**:
- **Large cache sizes**: Limit cache to essential assets
- **Unnecessary API calls**: Cache API responses appropriately
- **Heavy images**: Optimize images and use WebP format
- **Bundle size**: Use code splitting and lazy loading

## 🔧 Debugging Tools & Techniques

### Chrome DevTools

**Application Tab**:
- **Manifest**: Validate manifest.json
- **Service Workers**: Debug service worker registration and lifecycle
- **Storage**: Inspect cache contents and IndexedDB
- **Background Services**: Test sync and push notifications

**Network Tab**:
- Use throttling to test slow networks
- Check which requests are cached vs network
- Identify failed requests

**Console Commands**:
```javascript
// Clear all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});

// Clear all caches
caches.keys().then(cacheNames => {
  return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
});

// Check PWA install status
console.log('Standalone mode:', window.matchMedia('(display-mode: standalone)').matches);
console.log('iOS standalone:', navigator.standalone);
```

### Mobile Testing

**Android**:
- Use Chrome DevTools Remote Debugging
- Test with different network conditions
- Check Android System WebView version

**iOS**:
- Use Safari Web Inspector on macOS
- Test with different iOS versions
- Check device-specific behaviors

## 🚫 Common Mistakes to Avoid

### 1. Manifest Errors
```json
// ❌ Wrong - Missing required fields
{
  "name": "My App"
}

// ✅ Correct - Complete manifest
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "icons": [...]
}
```

### 2. Service Worker Scope Issues
```javascript
// ❌ Wrong - Service worker in subfolder
// /sw.js can only control / and subdirectories

// ✅ Correct - Service worker at root
// /sw.js can control entire site
```

### 3. Cache Strategy Mistakes
```javascript
// ❌ Wrong - Caching everything without strategy
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request));
});

// ✅ Correct - Appropriate caching strategies
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    // Cache first for images
  } else if (event.request.url.includes('/api/')) {
    // Network first for API calls
  }
});
```

### 4. Missing Error Handling
```javascript
// ❌ Wrong - No error handling
fetch(event.request).then(response => response);

// ✅ Correct - Proper error handling
fetch(event.request)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response;
  })
  .catch(error => {
    console.error('Fetch failed:', error);
    return caches.match(event.request);
  });
```

## 📋 Pre-Deployment Checklist

### Technical Requirements
- [ ] Site served over HTTPS
- [ ] Valid manifest.json with all required fields
- [ ] Service worker registered and functional
- [ ] All icon sizes present and accessible
- [ ] No console errors in production build

### User Experience
- [ ] App loads quickly on slow networks
- [ ] Works offline with appropriate fallbacks
- [ ] Installable on supported platforms
- [ ] Responsive design works on all devices
- [ ] Touch interactions work properly

### Performance
- [ ] Lighthouse PWA score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cache sizes are reasonable (< 50MB total)

## 🆘 Getting Help

### Resources
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Guides](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Next.js PWA Documentation](https://github.com/shadowwalker/next-pwa)

### Community Support
- Stack Overflow: Tag questions with `progressive-web-app`
- GitHub Issues: Check relevant repositories
- Discord/Slack: PWA and Next.js communities

Remember: PWAs require thorough testing across different devices and network conditions. Always test in production-like environments before deployment!
