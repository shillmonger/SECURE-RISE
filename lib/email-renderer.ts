import { render } from '@react-email/render';
import React from 'react';

// Import all email components
import { WelcomeEmail } from '../emails/WelcomeEmail';
import { PasswordResetEmail } from '../emails/PasswordResetEmail';
import { DepositStatusEmail } from '../emails/DepositStatusEmail';
import { KYCStatusEmail } from '../emails/KYCStatusEmail';
import { InvestmentConfirmationEmail } from '../emails/InvestmentConfirmationEmail';
import { DailyROIEmail } from '../emails/DailyROIEmail';
import { WithdrawalOTPEmail } from '../emails/WithdrawalOTPEmail';
import { GiftEmail } from '../emails/GiftEmail';
import { DepositNotificationEmail } from '../emails/DepositNotificationEmail';
import { WithdrawalNotificationEmail } from '../emails/WithdrawalNotificationEmail';
import { GiftCardNotificationEmail } from '../emails/GiftCardNotificationEmail';
import { XPRedemptionEmail } from '../emails/XPRedemptionEmail';
import { ContactFormEmail } from '../emails/ContactFormEmail';

export const renderWelcomeEmail = (props: { username: string; userEmail: string }) => {
  return render(React.createElement(WelcomeEmail, props));
};

export const renderPasswordResetEmail = (props: { userEmail: string; resetCode: string }) => {
  return render(React.createElement(PasswordResetEmail, props));
};

export const renderDepositStatusEmail = (props: {
  userEmail: string;
  username: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}) => {
  return render(React.createElement(DepositStatusEmail, props));
};

export const renderKYCStatusEmail = (props: {
  userEmail: string;
  username: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}) => {
  return render(React.createElement(KYCStatusEmail, props));
};

export const renderInvestmentConfirmationEmail = (props: {
  userEmail: string;
  username: string;
  planName: string;
  amount: number;
  roiPerDay: number;
  duration: number;
  dailyEarnings: number;
  totalProfit: number;
  totalReturn: number;
  investmentId: string;
}) => {
  return render(React.createElement(InvestmentConfirmationEmail, props));
};

export const renderDailyROIEmail = (props: {
  userEmail: string;
  username: string;
  investmentId: string;
  planName: string;
  dailyProfit: number;
  totalProfit: number;
  daysPassed: number;
  totalDays: number;
  accountBalance: number;
}) => {
  return render(React.createElement(DailyROIEmail, props));
};

export const renderWithdrawalOTPEmail = (props: {
  userEmail: string;
  username: string;
  otpCode: string;
  amount: number;
  cryptoName: string;
}) => {
  return render(React.createElement(WithdrawalOTPEmail, props));
};

export const renderGiftEmail = (props: {
  userEmail: string;
  senderName: string;
  receiverName: string;
  amount: number;
  transactionId: string;
  type: 'sent' | 'received';
}) => {
  return render(React.createElement(GiftEmail, props));
};

export const renderDepositNotificationEmail = (props: {
  depositId: string;
  username: string;
  userEmail: string;
  amount: number;
  paymentMethod: string;
  proofImage: string;
  transactionId: string;
}) => {
  return render(React.createElement(DepositNotificationEmail, props));
};

export const renderWithdrawalNotificationEmail = (props: {
  withdrawalId: string;
  username: string;
  userEmail: string;
  amount: number;
  crypto: {
    name: string;
    symbol: string;
    icon: string;
  };
  destinationAddress: string;
}) => {
  return render(React.createElement(WithdrawalNotificationEmail, props));
};

export const renderGiftCardNotificationEmail = (props: {
  giftCardId: string;
  username: string;
  userEmail: string;
  cardType: string;
  country: string;
  amount: number;
  currency: string;
  code: string;
  cardImage: string;
  transactionId: string;
}) => {
  return render(React.createElement(GiftCardNotificationEmail, props));
};

export const renderXPRedemptionEmail = (props: {
  userEmail: string;
  username: string;
  xpType: 'daily' | 'achievement';
  xpAmount: number;
  usdtAmount: number;
  transactionId: string;
}) => {
  return render(React.createElement(XPRedemptionEmail, props));
};

export const renderContactFormEmail = (props: {
  firstName: string;
  lastName: string;
  email: string;
  contactReason: string;
  message: string;
  submittedAt: string;
}) => {
  return render(React.createElement(ContactFormEmail, props));
};
