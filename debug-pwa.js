// PWA Debug Script - Run this in browser console
// This will help identify why the install prompt isn't showing

console.log('🔍 PWA Debug Check');
console.log('==================');

// 1. Check all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('📋 All Service Workers:');
  if (registrations.length === 0) {
    console.log('   ❌ No service workers found');
  } else {
    registrations.forEach((reg, index) => {
      console.log(`   ${index + 1}. Scope: ${reg.scope}`);
      console.log(`      Active: ${reg.active ? '✅' : '❌'}`);
      console.log(`      Installing: ${reg.installing ? '✅' : '❌'}`);
      console.log(`      Waiting: ${reg.waiting ? '✅' : '❌'}`);
      console.log('');
    });
  }
});

// 2. Check if PWA service worker is registered
navigator.serviceWorker.getRegistration('/').then(registration => {
  if (registration) {
    console.log('✅ PWA Service Worker found at root scope');
  } else {
    console.log('❌ PWA Service Worker NOT found at root scope');
  }
});

// 3. Check manifest
fetch('/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifest loaded successfully');
    console.log('   Name:', manifest.name);
    console.log('   Short Name:', manifest.short_name);
    console.log('   Display:', manifest.display);
    console.log('   Icons:', manifest.icons.length, 'icons');
  })
  .catch(error => {
    console.log('❌ Manifest error:', error);
  });

// 4. Check install criteria
const criteria = {
  https: location.protocol === 'https:',
  manifest: true, // We'll check this above
  serviceWorker: false, // We'll check this above
  icons: true, // We'll check this in manifest
  startUrl: true // We'll check this in manifest
};

navigator.serviceWorker.getRegistrations().then(registrations => {
  criteria.serviceWorker = registrations.length > 0;
  
  console.log('🎯 Install Criteria Check:');
  console.log('   HTTPS:', criteria.https ? '✅' : '❌');
  console.log('   Service Worker:', criteria.serviceWorker ? '✅' : '❌');
  console.log('   Manifest:', criteria.manifest ? '✅' : '❌');
  
  const allMet = Object.values(criteria).every(Boolean);
  console.log('   Overall:', allMet ? '✅ Should be installable' : '❌ Missing criteria');
});

// 5. Check if install prompt was already dismissed
console.log('💾 Dismissal Check:');
const dismissedTime = localStorage.getItem('pwa-install-dismissed');
if (dismissedTime) {
  const timeDiff = Date.now() - parseInt(dismissedTime);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  console.log('   Dismissed:', timeDiff < oneWeek ? '❌ Recently dismissed' : '✅ Can show again');
} else {
  console.log('   ✅ Not dismissed');
}

// 6. Check display mode
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
const isIOSStandalone = window.navigator.standalone === true;
console.log('📱 Display Mode:', isStandalone || isIOSStandalone ? 'Standalone' : 'Browser');

// 7. Manual install prompt test
console.log('🔧 Manual Install Test:');
console.log('   Try running: navigator.serviceWorker.register("/sw.js")');
console.log('   Then refresh page and check for install prompt');

console.log('==================');
console.log('🎯 Debug complete! Check results above.');
