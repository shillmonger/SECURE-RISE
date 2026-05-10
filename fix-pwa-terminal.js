// Terminal script to fix PWA service worker conflicts
// Run this with: node fix-pwa-terminal.js

const https = require('https');
const http = require('http');

function checkSite(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

async function debugPWA() {
  console.log('🔍 Debugging PWA on securerise.vercel.app');
  console.log('=========================================');
  
  try {
    // Check manifest
    console.log('📋 Checking manifest...');
    const manifestResponse = await checkSite('https://securerise.vercel.app/manifest.json');
    if (manifestResponse.status === 200) {
      console.log('✅ Manifest accessible');
      const manifest = JSON.parse(manifestResponse.data);
      console.log(`   Name: ${manifest.name}`);
      console.log(`   Display: ${manifest.display}`);
      console.log(`   Icons: ${manifest.icons.length} found`);
    } else {
      console.log('❌ Manifest not accessible');
    }
    
    // Check service worker
    console.log('\n🔧 Checking service worker...');
    const swResponse = await checkSite('https://securerise.vercel.app/sw.js');
    if (swResponse.status === 200) {
      console.log('✅ Service worker accessible');
    } else {
      console.log('❌ Service worker not accessible');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Deploy the updated next.config.ts changes');
    console.log('2. Clear browser data for securerise.vercel.app');
    console.log('3. Visit site and check for install prompt');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugPWA();
