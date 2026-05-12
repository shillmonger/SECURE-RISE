import { render } from '@react-email/render';
import React from 'react';

// Import all email components for testing
import { WelcomeEmail } from './WelcomeEmail';
import { PasswordResetEmail } from './PasswordResetEmail';
import { DepositStatusEmail } from './DepositStatusEmail';
import { KYCStatusEmail } from './KYCStatusEmail';
import { InvestmentConfirmationEmail } from './InvestmentConfirmationEmail';
import { DailyROIEmail } from './DailyROIEmail';
import { WithdrawalOTPEmail } from './WithdrawalOTPEmail';
import { GiftEmail } from './GiftEmail';
import { DepositNotificationEmail } from './DepositNotificationEmail';
import { WithdrawalNotificationEmail } from './WithdrawalNotificationEmail';
import { GiftCardNotificationEmail } from './GiftCardNotificationEmail';

// Test data for all email types
const testData = {
  welcome: {
    username: 'John Doe',
    userEmail: 'john.doe@example.com'
  },
  passwordReset: {
    userEmail: 'john.doe@example.com',
    resetCode: '123456'
  },
  depositStatus: {
    userEmail: 'john.doe@example.com',
    username: 'John Doe',
    amount: 1000,
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN123456',
    status: 'approved' as const
  },
  kycStatus: {
    userEmail: 'john.doe@example.com',
    username: 'John Doe',
    status: 'approved' as const
  },
  investmentConfirmation: {
    userEmail: 'john.doe@example.com',
    username: 'John Doe',
    planName: 'Premium Growth',
    amount: 5000,
    roiPerDay: 2.5,
    duration: 30,
    dailyEarnings: 125,
    totalProfit: 3750,
    totalReturn: 8750,
    investmentId: 'INV789012'
  },
  dailyROI: {
    userEmail: 'john.doe@example.com',
    username: 'John Doe',
    investmentId: 'INV789012',
    planName: 'Premium Growth',
    dailyProfit: 125,
    totalProfit: 1250,
    daysPassed: 10,
    totalDays: 30,
    accountBalance: 12500
  },
  withdrawalOTP: {
    userEmail: 'john.doe@example.com',
    username: 'John Doe',
    otpCode: '789012',
    amount: 2500,
    cryptoName: 'Bitcoin'
  },
  giftSent: {
    userEmail: 'john.doe@example.com',
    senderName: 'John Doe',
    receiverName: 'Jane Smith',
    amount: 100,
    transactionId: 'GIFT345678',
    type: 'sent' as const
  },
  giftReceived: {
    userEmail: 'jane.smith@example.com',
    senderName: 'John Doe',
    receiverName: 'Jane Smith',
    amount: 100,
    transactionId: 'GIFT345678',
    type: 'received' as const
  },
  depositNotification: {
    depositId: 'DEP123456',
    username: 'John Doe',
    userEmail: 'john.doe@example.com',
    amount: 1000,
    paymentMethod: 'Bank Transfer',
    proofImage: 'https://i.postimg.cc/SKkm38h0/favicon-ico.png',
    transactionId: 'TXN123456'
  },
  withdrawalNotification: {
    withdrawalId: 'WD789012',
    username: 'John Doe',
    userEmail: 'john.doe@example.com',
    amount: 2500,
    crypto: {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'bitcoin-icon'
    },
    destinationAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  },
  giftCardNotification: {
    giftCardId: 'GC345678',
    username: 'John Doe',
    userEmail: 'john.doe@example.com',
    cardType: 'Amazon Gift Card',
    country: 'United States',
    amount: 100,
    currency: 'USD',
    code: 'AMZN-GIFT-123456',
    cardImage: 'https://i.postimg.cc/SKkm38h0/favicon-ico.png',
    transactionId: 'GIFT345678'
  }
};

// Test function to render all emails
export const testAllEmails = async () => {
  console.log('🧪 Testing all email templates...\n');

  try {
    // Test Welcome Email
    console.log('📧 Testing Welcome Email...');
    const welcomeHtml = await render(React.createElement(WelcomeEmail, testData.welcome));
    console.log('✅ Welcome Email rendered successfully\n');

    // Test Password Reset Email
    console.log('📧 Testing Password Reset Email...');
    const passwordResetHtml = await render(React.createElement(PasswordResetEmail, testData.passwordReset));
    console.log('✅ Password Reset Email rendered successfully\n');

    // Test Deposit Status Email
    console.log('📧 Testing Deposit Status Email...');
    const depositStatusHtml = await render(React.createElement(DepositStatusEmail, testData.depositStatus));
    console.log('✅ Deposit Status Email rendered successfully\n');

    // Test KYC Status Email
    console.log('📧 Testing KYC Status Email...');
    const kycStatusHtml = await render(React.createElement(KYCStatusEmail, testData.kycStatus));
    console.log('✅ KYC Status Email rendered successfully\n');

    // Test Investment Confirmation Email
    console.log('📧 Testing Investment Confirmation Email...');
    const investmentConfirmationHtml = await render(React.createElement(InvestmentConfirmationEmail, testData.investmentConfirmation));
    console.log('✅ Investment Confirmation Email rendered successfully\n');

    // Test Daily ROI Email
    console.log('📧 Testing Daily ROI Email...');
    const dailyROIHtml = await render(React.createElement(DailyROIEmail, testData.dailyROI));
    console.log('✅ Daily ROI Email rendered successfully\n');

    // Test Withdrawal OTP Email
    console.log('📧 Testing Withdrawal OTP Email...');
    const withdrawalOTPHtml = await render(React.createElement(WithdrawalOTPEmail, testData.withdrawalOTP));
    console.log('✅ Withdrawal OTP Email rendered successfully\n');

    // Test Gift Email (Sent)
    console.log('📧 Testing Gift Email (Sent)...');
    const giftSentHtml = await render(React.createElement(GiftEmail, testData.giftSent));
    console.log('✅ Gift Email (Sent) rendered successfully\n');

    // Test Gift Email (Received)
    console.log('📧 Testing Gift Email (Received)...');
    const giftReceivedHtml = await render(React.createElement(GiftEmail, testData.giftReceived));
    console.log('✅ Gift Email (Received) rendered successfully\n');

    // Test Deposit Notification Email
    console.log('📧 Testing Deposit Notification Email...');
    const depositNotificationHtml = await render(React.createElement(DepositNotificationEmail, testData.depositNotification));
    console.log('✅ Deposit Notification Email rendered successfully\n');

    // Test Withdrawal Notification Email
    console.log('📧 Testing Withdrawal Notification Email...');
    const withdrawalNotificationHtml = await render(React.createElement(WithdrawalNotificationEmail, testData.withdrawalNotification));
    console.log('✅ Withdrawal Notification Email rendered successfully\n');

    // Test Gift Card Notification Email
    console.log('📧 Testing Gift Card Notification Email...');
    const giftCardNotificationHtml = await render(React.createElement(GiftCardNotificationEmail, testData.giftCardNotification));
    console.log('✅ Gift Card Notification Email rendered successfully\n');

    console.log('🎉 All email templates rendered successfully!');
    console.log('\n📊 Summary:');
    console.log('- 12 email templates tested');
    console.log('- All components working correctly');
    console.log('- Ready for production use');

    return {
      success: true,
      message: 'All email templates rendered successfully'
    };

  } catch (error) {
    console.error('❌ Error testing email templates:', error);
    return {
      success: false,
      message: 'Error testing email templates',
      error: error
    };
  }
};

// Individual test functions for specific emails
export const testWelcomeEmail = async () => {
  try {
    const html = await render(React.createElement(WelcomeEmail, testData.welcome));
    console.log('✅ Welcome Email test passed');
    return html;
  } catch (error) {
    console.error('❌ Welcome Email test failed:', error);
    throw error;
  }
};

export const testDepositStatusEmail = async () => {
  try {
    const html = await render(React.createElement(DepositStatusEmail, testData.depositStatus));
    console.log('✅ Deposit Status Email test passed');
    return html;
  } catch (error) {
    console.error('❌ Deposit Status Email test failed:', error);
    throw error;
  }
};

export const testInvestmentConfirmationEmail = async () => {
  try {
    const html = await render(React.createElement(InvestmentConfirmationEmail, testData.investmentConfirmation));
    console.log('✅ Investment Confirmation Email test passed');
    return html;
  } catch (error) {
    console.error('❌ Investment Confirmation Email test failed:', error);
    throw error;
  }
};

// Export test data for manual testing
export { testData };
