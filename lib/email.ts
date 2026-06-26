import nodemailer from 'nodemailer';
import { connectToDatabase } from './mongodb';
import {
  renderWelcomeEmail,
  renderPasswordResetEmail,
  renderDepositStatusEmail,
  renderKYCStatusEmail,
  renderInvestmentConfirmationEmail,
  renderDailyROIEmail,
  renderWithdrawalOTPEmail,
  renderGiftEmail,
  renderDepositNotificationEmail,
  renderWithdrawalNotificationEmail,
  renderGiftCardNotificationEmail,
  renderXPRedemptionEmail,
  renderContactFormEmail,
  renderPredictionResultEmail,
  renderInvestmentResumeEmail,
  renderCheapPlanActivationEmail
} from './email-renderer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (userEmail: string, username: string) => {
  const htmlContent = await renderWelcomeEmail({ userEmail, username });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Welcome to Secure Rise - Your Account is Ready!',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (userEmail: string, resetCode: string) => {
  const htmlContent = await renderPasswordResetEmail({ userEmail, resetCode });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Secure Rise - Password Reset Code',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendDepositNotificationToAdmins = async (depositData: {
  depositId: string;
  username: string;
  userEmail: string;
  amount: number;
  paymentMethod: string;
  proofImage: string;
  transactionId: string;
}) => {
  const htmlContent = await renderDepositNotificationEmail(depositData);

  // Get all admin users
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();

  // Send email to all admins
  const emailPromises = adminUsers.map(async (admin: any) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: admin.email,
      subject: `New Deposit Alert - ${depositData.username} - $${depositData.amount.toLocaleString()}`,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Deposit notification sent to admin: ${admin.email}`);
    } catch (error) {
      console.error(`Error sending deposit notification to ${admin.email}:`, error);
    }
  });

  await Promise.all(emailPromises);
};

export const sendDepositStatusEmail = async (userEmail: string, depositData: {
  username: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}) => {
  const htmlContent = await renderDepositStatusEmail({ 
    userEmail, 
    ...depositData 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Deposit ${depositData.status === 'approved' ? 'Approved' : 'Rejected'} - ${depositData.transactionId}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Deposit ${depositData.status === 'approved' ? 'approval' : 'rejection'} email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending deposit ${depositData.status === 'approved' ? 'approval' : 'rejection'} email:`, error);
    throw error;
  }
};

export const sendWithdrawalOTP = async (userEmail: string, username: string, otpCode: string, amount: number, cryptoName: string) => {
  const htmlContent = await renderWithdrawalOTPEmail({ 
    userEmail, 
    username, 
    otpCode, 
    amount, 
    cryptoName 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Withdrawal Verification Code - Secure Rise',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Withdrawal OTP email sent successfully');
  } catch (error) {
    console.error('Error sending withdrawal OTP email:', error);
    throw error;
  }
};

export const sendKYCStatusEmail = async (userEmail: string, username: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
  const htmlContent = await renderKYCStatusEmail({ 
    userEmail, 
    username, 
    status, 
    rejectionReason 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `KYC ${status === 'approved' ? 'Approved' : 'Rejected'} - Secure Rise`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`KYC ${status === 'approved' ? 'approval' : 'rejection'} email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending KYC ${status === 'approved' ? 'approval' : 'rejection'} email:`, error);
    throw error;
  }
};

export const sendWithdrawalNotificationToAdmins = async (withdrawalData: {
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
  const htmlContent = await renderWithdrawalNotificationEmail(withdrawalData);

  // Get all admin users
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();

  // Send email to all admins
  const emailPromises = adminUsers.map(async (admin: any) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: admin.email,
      subject: `New Withdrawal Request - ${withdrawalData.username} - $${withdrawalData.amount.toLocaleString()}`,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Withdrawal notification sent to admin: ${admin.email}`);
    } catch (error) {
      console.error(`Error sending withdrawal notification to ${admin.email}:`, error);
    }
  });

  await Promise.all(emailPromises);
};

export const sendWithdrawalStatusEmail = async (userEmail: string, withdrawalData: {
  username: string;
  amount: number;
  crypto: {
    name: string;
    symbol: string;
  };
  destinationAddress: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}) => {
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  const isApproved = withdrawalData.status === 'approved';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Withdrawal ${isApproved ? 'Approved' : 'Rejected'} - Secure Rise</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #09090b;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fafafa;
        }
        .container {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin-bottom: 12px;
        }
        .title {
          color: #09090b;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.025em;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #71717a;
          font-size: 15px;
          margin-bottom: 24px;
        }
        .status-box {
          background: ${isApproved ? '#22c55e' : '#ef4444'};
          color: white;
          padding: 32px;
          border-radius: 16px;
          margin: 32px 0;
          text-align: center;
        }
        .status-label {
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        .status-text {
          font-size: 32px;
          font-weight: 800;
          margin: 8px 0;
        }
        .withdrawal-amount {
          font-size: 24px;
          font-weight: 700;
          margin: 8px 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 24px 0;
        }
        .info-item {
          background: #f4f4f5;
          padding: 16px;
          border-radius: 12px;
        }
        .info-label {
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          opacity: 0.7;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 600;
          word-break: break-all;
        }
        .rejection-reason {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 16px;
          border-radius: 12px;
          margin: 24px 0;
        }
        .cta-button {
          display: block;
          background: #09090b;
          color: #ffffff !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          margin: 32px auto;
          text-align: center;
          width: fit-content;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e4e4e7;
          color: #71717a;
          font-size: 13px;
        }
        strong { color: #09090b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Secure Rise Logo" class="logo">
          <h1 class="title">Withdrawal ${isApproved ? 'Approved' : 'Rejected'}</h1>
          <p class="subtitle">Your withdrawal request has been reviewed</p>
        </div>

        <div class="status-box">
          <div class="status-label">Status</div>
          <div class="status-text">${isApproved ? 'APPROVED' : 'REJECTED'}</div>
          <div class="withdrawal-amount">$${withdrawalData.amount.toLocaleString()}</div>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">${withdrawalData.crypto.name} (${withdrawalData.crypto.symbol})</p>
        </div>

        ${!isApproved && withdrawalData.rejectionReason ? `
          <div class="rejection-reason">
            <div class="info-label">Rejection Reason</div>
            <div>${withdrawalData.rejectionReason}</div>
          </div>
        ` : ''}

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Currency</div>
            <div class="info-value">${withdrawalData.crypto.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Destination Address</div>
            <div class="info-value">${withdrawalData.destinationAddress}</div>
          </div>
        </div>

        ${isApproved ? `
          <p style="text-align: center; margin: 24px 0;">
            The funds have been sent to your designated wallet address. Please allow some time for the transaction to be processed on the blockchain.
          </p>
        ` : ''}

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/withdraw" class="cta-button">
          View Withdrawal History
        </a>

        <div class="footer">
          <p>Best regards,<br><strong>The Secure Rise Team</strong></p>
          <p style="margin-top: 20px; font-size: 11px;">
            This email was sent to ${userEmail}.<br>
            &copy; 2026 Secure Rise. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Withdrawal ${isApproved ? 'Approved' : 'Rejected'} - Secure Rise`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Withdrawal ${isApproved ? 'approval' : 'rejection'} email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending withdrawal ${isApproved ? 'approval' : 'rejection'} email:`, error);
    throw error;
  }
};

export const sendGiftDebitEmail = async (userEmail: string, giftData: {
  senderName: string;
  receiverName: string;
  amount: number;
  transactionId: string;
}) => {
  const htmlContent = await renderGiftEmail({ 
    userEmail, 
    ...giftData, 
    type: 'sent' 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Gift Sent - ${giftData.transactionId}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Gift debit email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending gift debit email:', error);
    throw error;
  }
};

export const sendInvestmentConfirmationEmail = async (userEmail: string, investmentData: {
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
  const htmlContent = await renderInvestmentConfirmationEmail({ 
    userEmail, 
    ...investmentData 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Investment Confirmed - ${investmentData.planName} - $${investmentData.amount.toLocaleString()}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Investment confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending investment confirmation email:', error);
    throw error;
  }
};

export const sendDailyROIEmail = async (userEmail: string, roiData: {
  username: string;
  investmentId: string;
  planName: string;
  dailyProfit: number;
  totalProfit: number;
  daysPassed: number;
  totalDays: number;
  accountBalance: number;
}) => {
  const htmlContent = await renderDailyROIEmail({ 
    userEmail, 
    ...roiData 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Daily ROI Added - $${roiData.dailyProfit.toFixed(2)} - ${roiData.planName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Daily ROI email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending daily ROI email:', error);
    throw error;
  }
};

export const sendGiftCreditEmail = async (userEmail: string, giftData: {
  senderName: string;
  receiverName: string;
  amount: number;
  transactionId: string;
}) => {
  const htmlContent = await renderGiftEmail({ 
    userEmail, 
    ...giftData, 
    type: 'received' 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `🎁 Gift Received - ${giftData.transactionId}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Gift credit email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending gift credit email:', error);
    throw error;
  }
};

export const sendGiftCardNotificationToAdmins = async (giftCardData: {
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
  const htmlContent = await renderGiftCardNotificationEmail(giftCardData);

  // Get all admin users
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();

  // Send email to all admins
  const emailPromises = adminUsers.map(async (admin: any) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: admin.email,
      subject: `New Gift Card Alert - ${giftCardData.username} - ${giftCardData.currency} ${giftCardData.amount.toLocaleString()}`,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Gift card notification sent to admin: ${admin.email}`);
    } catch (error) {
      console.error(`Error sending gift card notification to ${admin.email}:`, error);
    }
  });

  await Promise.all(emailPromises);
};

export const sendGiftCardStatusEmail = async (userEmail: string, giftCardData: {
  username: string;
  cardType: string;
  amount: number;
  currency: string;
  transactionId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}) => {
  // For gift card status emails, we can reuse the deposit status email template
  // with some modifications for gift card specific fields
  const htmlContent = await renderDepositStatusEmail({
    userEmail,
    username: giftCardData.username,
    amount: giftCardData.amount,
    paymentMethod: `${giftCardData.cardType} (${giftCardData.currency})`,
    transactionId: giftCardData.transactionId,
    status: giftCardData.status,
    rejectionReason: giftCardData.rejectionReason
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Gift Card ${giftCardData.status === 'approved' ? 'Approved' : 'Rejected'} - ${giftCardData.transactionId}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Gift card ${giftCardData.status === 'approved' ? 'approval' : 'rejection'} email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending gift card ${giftCardData.status === 'approved' ? 'approval' : 'rejection'} email:`, error);
    throw error;
  }
};

export const sendXPRedemptionEmail = async (userEmail: string, username: string, redemptionData: {
  xpType: 'daily' | 'achievement' | 'prediction';
  xpAmount: number;
  usdtAmount: number;
  transactionId: string;
}) => {
  const htmlContent = await renderXPRedemptionEmail({
    userEmail,
    username,
    ...redemptionData
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `XP Redemption Successful - ${redemptionData.transactionId}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`XP redemption email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending XP redemption email:', error);
    throw error;
  }
};

export const sendContactFormNotificationToAdmins = async (contactData: {
  firstName: string;
  lastName: string;
  email: string;
  contactReason: string;
  message: string;
  submittedAt: string;
}) => {
  const htmlContent = await renderContactFormEmail(contactData);
  const fullName = `${contactData.firstName} ${contactData.lastName}`;

  // Get all admin users
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();

  // Send email to all admins
  const emailPromises = adminUsers.map(async (admin: any) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: admin.email,
      subject: `New Contact Inquiry - ${fullName} - ${contactData.contactReason}`,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Contact form notification sent to admin: ${admin.email}`);
    } catch (error) {
      console.error(`Error sending contact form notification to ${admin.email}:`, error);
    }
  });

  await Promise.all(emailPromises);
};

export const sendPredictionResultEmail = async (userEmail: string, username: string, predictionData: {
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  closePrice: number;
  confidence: 'Low' | 'Medium' | 'High';
  status: 'won' | 'lost';
  xpEarned: number;
  submissionDate: string;
}) => {
  const htmlContent = await renderPredictionResultEmail({
    userEmail,
    username,
    ...predictionData
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Prediction Result: ${predictionData.status === 'won' ? 'Won' : 'Lost'} - ${predictionData.pair}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Prediction result email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending prediction result email:', error);
    throw error;
  }
};

export const sendInvestmentResumeEmail = async (userEmail: string, resumeData: {
  username: string;
  planName: string;
  amount: number;
  roiRate: number;
  durationDays: number;
  daysPassed: number;
  missingDays: number;
  profitEarned: number;
  missingProfit: number;
  totalProfit: number;
  investmentId: string;
  startDate: string;
  endDate: string;
}) => {
  const htmlContent = await renderInvestmentResumeEmail({
    userEmail,
    ...resumeData
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Investment Resumed - Credits Added - ${resumeData.planName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Investment resume email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending investment resume email:', error);
    throw error;
  }
};

export const sendCheapPlanActivationEmail = async (userEmail: string, investmentData: {
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
  const htmlContent = await renderCheapPlanActivationEmail({ 
    userEmail, 
    ...investmentData 
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `🎉 Welcome Bonus Plan Activated - $20 → $10,000`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Cheap plan activation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending cheap plan activation email:', error);
    throw error;
  }
};
