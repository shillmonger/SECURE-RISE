// Test script for the cron job endpoint
// Run this with: node test-cron.js

const http = require('http');

function testCronJob() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/cron/distribute-profits',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer test-cron-secret',
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response: ${data}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

console.log('Testing cron job endpoint...');
console.log('Make sure your Next.js app is running on localhost:3000');
console.log('Set CRON_SECRET=test-cron-secret in your .env.local file');
testCronJob();
