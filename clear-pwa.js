// Browser automation script to clear PWA data
// Save as clear-pwa.html and open in browser, or use in DevTools console

const clearPWAData = async () => {
  console.log('🧹 Clearing PWA data...');
  
  try {
    // 1. Unregister all service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log(`✅ Unregistered: ${registration.scope}`);
    }
    
    // 2. Clear all caches
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`✅ Cleared cache: ${cacheName}`);
    }
    
    // 3. Clear localStorage
    localStorage.clear();
    console.log('✅ Cleared localStorage');
    
    // 4. Clear sessionStorage
    sessionStorage.clear();
    console.log('✅ Cleared sessionStorage');
    
    console.log('🎯 PWA data cleared! Reloading...');
    setTimeout(() => {
      location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  clearPWAData();
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clearPWAData };
}
