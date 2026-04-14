import nodemailer from 'nodemailer';

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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          margin-bottom: 20px;
        }
        .title {
          color: #1a1a1a;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 30px;
        }
        .welcome-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin: 30px 0;
          text-align: center;
        }
        .bonus-amount {
          font-size: 36px;
          font-weight: 700;
          margin: 10px 0;
        }
        .feature-list {
          margin: 30px 0;
        }
        .feature-item {
          display: flex;
          align-items: center;
          margin: 15px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .feature-icon {
          width: 24px;
          height: 24px;
          margin-right: 15px;
          color: #667eea;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Secure Rise Logo" class="logo">
          <h1 class="title">Welcome to Secure Rise!</h1>
          <p class="subtitle">Your journey to financial success starts here</p>
        </div>

        <p>Dear <strong>${username}</strong>,</p>
        
        <p>We're thrilled to welcome you to the Secure Rise family! Your account has been successfully created and you're now ready to start your investment journey.</p>

        <div class="welcome-box">
          <h3>🎉 Welcome Bonus Credited!</h3>
          <div class="bonus-amount">$20</div>
          <p>Your welcome bonus has been automatically added to your account balance.</p>
        </div>

        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <div>
              <strong>Secure Trading Platform</strong><br>
              State-of-the-art security measures to protect your investments
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <div>
              <strong>Real-time Analytics</strong><br>
              Track your investments with advanced analytics tools
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <div>
              <strong>24/7 Support</strong><br>
              Our team is always here to help you succeed
            </div>
          </div>
        </div>

       <div style="text-align: center;">
  <a 
    href="${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/dashboard"
    style="
      color: #ffffff;
      background-color: #007bff;
      padding: 12px 20px;
      text-decoration: none;
      display: inline-block;
      border-radius: 5px;
      font-weight: bold;
    "
  >
    Go to Your Dashboard
  </a>
</div>

        <p>Ready to get started? Simply log in to your dashboard to explore all the features and make your first investment.</p>

        <p>If you have any questions, don't hesitate to contact our support team at support@securerise.com.</p>

        <div class="footer">
          <p>Best regards,<br>The Secure Rise Team</p>
          <p style="font-size: 12px; margin-top: 20px;">
            This email was sent to ${userEmail}. If you didn't create an account, please contact us immediately.
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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          margin-bottom: 20px;
        }
        .title {
          color: #1a1a1a;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .reset-code {
          background: #f3f4f6;
          border: 2px dashed #9ca3af;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
          border-radius: 8px;
        }
        .code {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 8px;
          color: #667eea;
          font-family: monospace;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Secure Rise Logo" class="logo">
          <h1 class="title">Password Reset Request</h1>
        </div>

        <p>We received a request to reset your password for your Secure Rise account.</p>

        <div class="reset-code">
          <p style="margin-bottom: 10px;"><strong>Your reset code is:</strong></p>
          <div class="code">${resetCode}</div>
        </div>

        <p><strong>Important:</strong></p>
        <ul>
          <li>This code will expire in 15 minutes</li>
          <li>Never share this code with anyone</li>
          <li>If you didn't request this reset, please ignore this email</li>
        </ul>

        <p>If you continue to have issues, please contact our support team.</p>

        <div class="footer">
          <p>Best regards,<br>The Secure Rise Team</p>
          <p style="font-size: 12px; margin-top: 20px;">
            This email was sent to ${userEmail}. If you didn't request a password reset, please contact us immediately.
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
