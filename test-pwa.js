// PWA Verification Script
// Run this in browser console on https://securerise.vercel.app/

console.log('🔍 PWA Verification Test');
console.log('================================');

// 1. Check Service Worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('✅ Service Workers:', registrations.length > 0 ? 'Registered' : 'Not Registered');
  if (registrations.length > 0) {
    registrations.forEach((reg, index) => {
      console.log(`   SW ${index + 1}: ${reg.scope} - ${reg.active ? 'Active' : 'Inactive'}`);
    });
  }
});

// 2. Check Manifest
if ('manifest' in navigator) {
  navigator.manifest.then(manifest => {
    console.log('✅ Manifest: Loaded successfully');
    console.log('   Name:', manifest.name);
    console.log('   Display:', manifest.display);
  }).catch(() => {
    console.log('❌ Manifest: Not loaded');
  });
} else {
  console.log('❌ Manifest API not supported');
}

// 3. Check Installability
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ Install prompt event fired - App is installable!');
});

// 4. Check Display Mode
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
console.log('✅ Display Mode:', isStandalone ? 'Standalone' : 'Browser');

// 5. Check Connection
console.log('✅ Online Status:', navigator.onLine ? 'Online' : 'Offline');

// 6. Check Caches
caches.keys().then(cacheNames => {
  console.log('✅ Caches:', cacheNames.length, 'caches found');
  cacheNames.forEach(name => {
    console.log('   -', name);
  });
});

console.log('================================');
console.log('🎯 Test complete! Check results above.');
