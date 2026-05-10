// Test script to verify KYC API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUserData = {
  userId: '507f1f77bcf86cd799439011', // Sample MongoDB ObjectId
  username: 'testuser',
  userEmail: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  dob: '1990-01-01',
  nationality: 'Nigerian',
  address: '123 Test Street',
  city: 'Lagos',
  country: 'Nigeria',
  postalCode: '100001',
  idType: 'National ID Card',
  idNumber: '1234567890'
};

async function testKYCSubmission() {
  try {
    console.log('Testing KYC submission...');
    
    // Create FormData
    const FormData = require('form-data');
    const form = new FormData();
    
    // Add all fields
    Object.keys(testUserData).forEach(key => {
      form.append(key, testUserData[key]);
    });
    
    // Add dummy files (you'll need actual image files for real testing)
    form.append('frontImage', Buffer.from('dummy'), 'front.jpg');
    form.append('backImage', Buffer.from('dummy'), 'back.jpg');
    
    const response = await axios.post(`${BASE_URL}/api/kyc`, form, {
      headers: {
        ...form.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ KYC submission successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ KYC submission failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testKYCStatus(userId) {
  try {
    console.log('Testing KYC status retrieval...');
    
    const response = await axios.get(`${BASE_URL}/api/kyc?userId=${userId}`);
    
    console.log('✅ KYC status retrieved:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ KYC status retrieval failed:', error.response?.data || error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Starting KYC API tests...\n');
  
  try {
    // Test submission
    const submissionResult = await testKYCSubmission();
    
    // Test status retrieval
    await testKYCStatus(testUserData.userId);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.log('\n❌ Tests failed. Please check the errors above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testKYCSubmission,
  testKYCStatus,
  runTests
};
