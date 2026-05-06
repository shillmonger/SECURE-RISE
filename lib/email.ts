import nodemailer from 'nodemailer';
import { connectToDatabase } from './mongodb';

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
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Secure Rise</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #09090b; /* foreground */
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fafafa;
        }
        .container {
          background: #ffffff;
          border: 1px solid #e4e4e7; /* border color from shadcn */
          border-radius: 24px; /* matching your card's rounded-3xl */
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
          margin-bottom: 10px;
        }
        .app-preview {
          width: 100%;
          max-width: 280px;
          height: auto;
          margin: 20px auto;
          display: block;
        }
        .title {
          color: #09090b;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.025em;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #71717a; /* muted-foreground */
          font-size: 15px;
          margin-bottom: 24px;
        }
        .welcome-box {
          background: #09090b; /* primary/black */
          color: #ffffff;
          padding: 32px;
          border-radius: 16px;
          margin: 32px 0;
          text-align: center;
        }
        .bonus-label {
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          opacity: 0.8;
        }
        .bonus-amount {
          font-size: 42px;
          font-weight: 800;
          margin: 8px 0;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          margin: 16px 0;
          padding: 16px;
          border: 1px solid #f4f4f5;
          border-radius: 12px;
        }
        .feature-icon {
          background: #09090b;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
          font-size: 12px;
          margin-right: 12px;
          flex-shrink: 0;
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
          margin: 32px 0;
          text-align: center;
        }
        .pwa-badge {
          text-align: center;
          margin-top: 24px;
          padding: 15px;
          background: #f4f4f5;
          border-radius: 12px;
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
          <h1 class="title">Welcome to Secure Rise</h1>
          <p class="subtitle">Your account is active and ready for growth.</p>
        </div>

        <p>Hi <strong>${username}</strong>,</p>
        
        <p>We're excited to have you on board! Secure Rise is designed to provide you with a premium, secure, and seamless trading experience.</p>

        <div class="welcome-box">
          <div class="bonus-label">Welcome Bonus Credited</div>
          <div class="bonus-amount">$20.00</div>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Start your first investment with us today.</p>
        </div>

        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <div>
              <strong>Pro Trading Tools</strong><br>
              <span style="font-size: 14px; color: #71717a;">Access real-time analytics and advanced charting.</span>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <div>
              <strong>Institutional Security</strong><br>
              <span style="font-size: 14px; color: #71717a;">Your assets are protected by industry-leading encryption.</span>
            </div>
          </div>
        </div>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/dashboard" class="cta-button">
          Open Your Dashboard
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
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - Secure Rise</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #09090b; /* foreground */
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fafafa;
        }
        .container {
          background: #ffffff;
          border: 1px solid #e4e4e7; /* border color from shadcn */
          border-radius: 24px; /* matching your card's rounded-3xl */
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
          color: #71717a; /* muted-foreground */
          font-size: 15px;
        }
        .reset-box {
          background: #09090b; /* primary/black */
          color: #ffffff;
          padding: 32px;
          border-radius: 16px;
          margin: 32px 0;
          text-align: center;
        }
        .code-label {
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          opacity: 0.8;
          margin-bottom: 12px;
          display: block;
        }
        .code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 10px;
          font-family: 'Courier New', Courier, monospace;
          margin: 10px 0;
        }
        .security-list {
          margin: 24px 0;
          padding: 0;
          list-style: none;
        }
        .security-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          color: #4b5563;
        }
        .bullet {
          color: #09090b;
          font-weight: bold;
          margin-right: 10px;
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
          <h1 class="title">Reset your password</h1>
          <p class="subtitle">Enter the code below to secure your account.</p>
        </div>

        <p>We received a request to reset the password for your <strong>Secure Rise</strong> account. Use the verification code below to proceed:</p>

        <div class="reset-box">
          <span class="code-label">Verification Code</span>
          <div class="code">${resetCode}</div>
          <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.8;">Expires in 5 minutes</p>
        </div>

        <div class="security-list">
          <div class="security-item">
            <span class="bullet">!</span> Never share this verification code with anyone.
          </div>
          <div class="security-item">
            <span class="bullet">!</span> Secure Rise staff will never ask for this code.
          </div>
          <div class="security-item">
            <span class="bullet">!</span> If you didn't request this, you can safely ignore this email.
          </div>
        </div>

        <p style="font-size: 14px;">If you continue to have issues, please contact our support team at <a href="mailto:support@securerise.com" style="color: #09090b; font-weight: 600;">support@securerise.com</a>.</p>

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
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Deposit Alert - Secure Rise</title>
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
        .alert-box {
          background: #fbbf24;
          color: #09090b;
          padding: 24px;
          border-radius: 16px;
          margin: 24px 0;
          text-align: center;
        }
        .deposit-amount {
          font-size: 36px;
          font-weight: 800;
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
        }
        .proof-image {
          width: 100%;
          max-width: 300px;
          height: auto;
          border-radius: 12px;
          margin: 16px auto;
          display: block;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          margin: 32px 0;
        }
        .btn {
          flex: 1;
          padding: 16px 24px;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          text-align: center;
          display: block;
        }
        .btn-approve {
          background: #22c55e;
          color: white;
        }
        .btn-reject {
          background: #ef4444;
          color: white;
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
          <h1 class="title">New Deposit Alert</h1>
          <p class="subtitle">A user has submitted a new deposit for review</p>
        </div>

        <div class="alert-box">
          <div class="info-label">Deposit Amount</div>
          <div class="deposit-amount">$${depositData.amount.toLocaleString()}</div>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">${depositData.paymentMethod}</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">User</div>
            <div class="info-value">${depositData.username}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${depositData.userEmail}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">${depositData.transactionId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Payment Method</div>
            <div class="info-value">${depositData.paymentMethod}</div>
          </div>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <div class="info-label">Proof of Transfer</div>
          <img src="${depositData.proofImage}" alt="Proof of Transfer" class="proof-image">
        </div>

        <div class="action-buttons">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin-dashboard/manage-deposit" class="btn btn-approve">
            Review Deposit
          </a>
        </div>

        <div class="footer">
          <p>Best regards,<br><strong>The Secure Rise Team</strong></p>
          <p style="margin-top: 20px; font-size: 11px;">
            This is an automated notification. Please review the deposit promptly.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

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
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  const isApproved = depositData.status === 'approved';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deposit ${isApproved ? 'Approved' : 'Rejected'} - Secure Rise</title>
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
        .deposit-amount {
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
          <h1 class="title">Deposit ${isApproved ? 'Approved' : 'Rejected'}</h1>
          <p class="subtitle">Your deposit has been reviewed</p>
        </div>

        <div class="status-box">
          <div class="status-label">Status</div>
          <div class="status-text">${isApproved ? 'APPROVED' : 'REJECTED'}</div>
          <div class="deposit-amount">$${depositData.amount.toLocaleString()}</div>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">${depositData.paymentMethod}</p>
        </div>

        ${!isApproved && depositData.rejectionReason ? `
          <div class="rejection-reason">
            <div class="info-label">Rejection Reason</div>
            <div>${depositData.rejectionReason}</div>
          </div>
        ` : ''}

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">${depositData.transactionId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Payment Method</div>
            <div class="info-value">${depositData.paymentMethod}</div>
          </div>
        </div>

        ${isApproved ? `
          <p style="text-align: center; margin: 24px 0;">
            The funds have been added to your account balance. You can now use them for investments.
          </p>
        ` : ''}

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/deposit" class="cta-button">
          View Your Deposits
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
    subject: `Deposit ${isApproved ? 'Approved' : 'Rejected'} - ${depositData.transactionId}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Deposit ${isApproved ? 'approval' : 'rejection'} email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending deposit ${isApproved ? 'approval' : 'rejection'} email:`, error);
    throw error;
  }
};

export const sendWithdrawalOTP = async (userEmail: string, username: string, otpCode: string, amount: number, cryptoName: string) => {
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Withdrawal OTP - Secure Rise</title>
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
        .otp-box {
          background: #09090b;
          color: #ffffff;
          padding: 32px;
          border-radius: 16px;
          margin: 32px 0;
          text-align: center;
        }
        .otp-label {
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          opacity: 0.8;
          margin-bottom: 12px;
          display: block;
        }
        .otp-code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 10px;
          font-family: 'Courier New', Courier, monospace;
          margin: 10px 0;
        }
        .withdrawal-info {
          background: #f4f4f5;
          padding: 20px;
          border-radius: 12px;
          margin: 24px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .info-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .info-value {
          font-size: 14px;
          font-weight: 600;
        }
        .security-list {
          margin: 24px 0;
          padding: 0;
          list-style: none;
        }
        .security-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          color: #4b5563;
        }
        .bullet {
          color: #09090b;
          font-weight: bold;
          margin-right: 10px;
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
          <h1 class="title">Withdrawal Verification</h1>
          <p class="subtitle">Enter the code below to confirm your withdrawal</p>
        </div>

        <p>Hi <strong>${username}</strong>,</p>
        
        <p>You have initiated a withdrawal request. Use the verification code below to proceed:</p>

        <div class="withdrawal-info">
          <div class="info-row">
            <span class="info-label">Amount</span>
            <span class="info-value">$${amount.toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Currency</span>
            <span class="info-value">${cryptoName}</span>
          </div>
        </div>

        <div class="otp-box">
          <span class="otp-label">Verification Code</span>
          <div class="otp-code">${otpCode}</div>
          <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.8;">Expires in 5 minutes</p>
        </div>

        <div class="security-list">
          <div class="security-item">
            <span class="bullet">!</span> Never share this verification code with anyone.
          </div>
          <div class="security-item">
            <span class="bullet">!</span> Secure Rise staff will never ask for this code.
          </div>
          <div class="security-item">
            <span class="bullet">!</span> If you didn't request this withdrawal, contact support immediately.
          </div>
        </div>

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
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Withdrawal Request - Secure Rise</title>
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
        .alert-box {
          background: #fbbf24;
          color: #09090b;
          padding: 24px;
          border-radius: 16px;
          margin: 24px 0;
          text-align: center;
        }
        .withdrawal-amount {
          font-size: 36px;
          font-weight: 800;
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
        .action-buttons {
          display: flex;
          gap: 12px;
          margin: 32px 0;
        }
        .btn {
          flex: 1;
          padding: 16px 24px;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          text-align: center;
          display: block;
        }
        .btn-review {
          background: #09090b;
          color: white;
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
          <h1 class="title">New Withdrawal Request</h1>
          <p class="subtitle">A user has submitted a withdrawal for review</p>
        </div>

        <div class="alert-box">
          <div class="info-label">Withdrawal Amount</div>
          <div class="withdrawal-amount">$${withdrawalData.amount.toLocaleString()}</div>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">${withdrawalData.crypto.name} (${withdrawalData.crypto.symbol})</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">User</div>
            <div class="info-value">${withdrawalData.username}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${withdrawalData.userEmail}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Withdrawal ID</div>
            <div class="info-value">${withdrawalData.withdrawalId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Currency</div>
            <div class="info-value">${withdrawalData.crypto.name}</div>
          </div>
        </div>

        <div class="info-item" style="margin: 24px 0;">
          <div class="info-label">Destination Address</div>
          <div class="info-value">${withdrawalData.destinationAddress}</div>
        </div>

        <div class="action-buttons">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin-dashboard/investment-payouts" class="btn btn-review">
            Review Withdrawal
          </a>
        </div>

        <div class="footer">
          <p>Best regards,<br><strong>The Secure Rise Team</strong></p>
          <p style="margin-top: 20px; font-size: 11px;">
            This is an automated notification. Please review the withdrawal promptly.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

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
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gift Sent - Secure Rise</title>
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
        .gift-box {
          background: #ef4444;
          color: white;
          padding: 32px;
          border-radius: 16px;
          margin: 32px 0;
          text-align: center;
        }
        .gift-amount {
          font-size: 36px;
          font-weight: 800;
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
          <h1 class="title">Gift Sent Successfully</h1>
          <p class="subtitle">Your gift has been sent and processed</p>
        </div>

        <p>Hi <strong>${giftData.senderName}</strong>,</p>
        
        <p>You have successfully sent a gift to <strong>${giftData.receiverName}</strong>. The amount has been debited from your account balance.</p>

        <div class="gift-box">
          <div class="info-label">Gift Amount Sent</div>
          <div class="gift-amount">-$${giftData.amount.toLocaleString()}</div>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Debited from your account</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Recipient</div>
            <div class="info-value">${giftData.receiverName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">${giftData.transactionId}</div>
          </div>
        </div>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/gift-member" class="cta-button">
          Send Another Gift
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

export const sendGiftCreditEmail = async (userEmail: string, giftData: {
  senderName: string;
  receiverName: string;
  amount: number;
  transactionId: string;
}) => {
  const logoUrl = 'https://i.postimg.cc/8CWMKzWF/favicon_ico.png';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gift Received - Secure Rise</title>
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
        .gift-box {
          background: #22c55e;
          color: white;
          padding: 32px;
          border-radius: 16px;
          margin: 32px 0;
          text-align: center;
        }
        .gift-amount {
          font-size: 36px;
          font-weight: 800;
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
          <h1 class="title">🎁 Gift Received!</h1>
          <p class="subtitle">Someone sent you a wonderful gift</p>
        </div>

        <p>Hi <strong>${giftData.receiverName}</strong>,</p>
        
        <p>You have received a gift from <strong>${giftData.senderName}</strong>. The amount has been credited to your account balance and is available for use.</p>

        <div class="gift-box">
          <div class="info-label">Gift Amount Received</div>
          <div class="gift-amount">+$${giftData.amount.toLocaleString()}</div>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Credited to your account</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">From</div>
            <div class="info-value">${giftData.senderName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">${giftData.transactionId}</div>
          </div>
        </div>

        <p style="text-align: center; margin: 24px 0;">
          You can now use this amount for investments or withdraw it to your preferred wallet.
        </p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/dashboard" class="cta-button">
          View Your Dashboard
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
