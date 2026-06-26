import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface CheapPlanActivationEmailProps {
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
}

export const CheapPlanActivationEmail: React.FC<CheapPlanActivationEmailProps> = ({ 
  userEmail,
  username,
  planName,
  amount,
  roiPerDay,
  duration,
  dailyEarnings,
  totalProfit,
  totalReturn,
  investmentId
}) => {
  return (
    <Html>
      <Head>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              color: #000000;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .logo {
              margin-bottom: 40px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .subtitle {
              font-size: 14px;
              color: #71717a;
              margin-bottom: 24px;
            }
            .highlight-box {
              background: linear-gradient(135deg, #229ED9 0%, #1a7ab8 100%);
              color: white;
              padding: 32px;
              border-radius: 16px;
              margin: 32px 0;
              text-align: center;
            }
            .highlight-amount {
              font-size: 48px;
              font-weight: 800;
              margin: 16px 0;
              letter-spacing: 2px;
            }
            .highlight-label {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 2px;
              opacity: 0.9;
              margin-bottom: 8px;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
              font-size: 12px;
              color: #666666;
            }
            .details {
              margin: 20px 0;
              font-size: 14px;
              line-height: 1.6;
            }
            .returns {
              background-color: #f4f4f5;
              padding: 24px;
              border-radius: 12px;
              margin: 24px 0;
            }
            .returns-title {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .return-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 14px;
            }
            .return-row:last-child {
              margin-bottom: 0;
              padding-top: 12px;
              border-top: 1px solid #e4e4e7;
            }
            .return-label {
              color: #71717a;
            }
            .return-value {
              font-weight: 600;
            }
            .positive {
              color: #22c55e;
            }
            .feature-list {
              margin: 24px 0;
              padding-left: 20px;
            }
            .feature-item {
              margin-bottom: 8px;
              font-size: 14px;
            }
            .badge {
              display: inline-block;
              background-color: #229ED9;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 16px;
            }
          `}
        </style>
      </Head>
      <Preview>Welcome Bonus Plan Activated - $20 → $10,000</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">🎉 Welcome Bonus Plan Activated!</Text>
          <Text className="subtitle">Congratulations {username}! Your exclusive $20 Welcome Bonus has been successfully activated.</Text>
          
          <div className="badge">One-Time Exclusive Offer</div>
          
          <div className="highlight-box">
            <div className="highlight-label">Investment Capital</div>
            <div className="highlight-amount">$10,000</div>
            <Text style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              Activated with your $20 Welcome Bonus
            </Text>
          </div>
          
          <Text>
            Your <strong>{planName}</strong> is now active! This is a special one-time offer that gives you massive returns on your welcome bonus. Here's what you can expect:
          </Text>
          
          <div className="details">
            <Text>
              <strong>What to Expect:</strong><br /><br />
              • Daily ROI of <strong>${dailyEarnings.toFixed(2)}</strong> will be automatically credited to your account balance every 24 hours<br />
              • Your investment runs for <strong>{duration} days</strong> with a <strong>{roiPerDay}% daily ROI rate</strong><br />
              • Total profit potential: <strong>${totalProfit.toFixed(2)}</strong><br />
              • Platform keeps <strong>$0.00</strong> - you keep 100% of the returns<br />
              • Investment ID: {investmentId}
            </Text>
          </div>

          <div className="feature-list">
            <Text className="feature-item">✅ Daily ROI payouts automatically credited</Text>
            <Text className="feature-item">✅ VIP support priority</Text>
            <Text className="feature-item">✅ Priority withdrawals</Text>
            <Text className="feature-item">✅ Bonus rewards and exclusive perks</Text>
          </div>
          
          <div className="returns">
            <Text className="returns-title">Your Investment Breakdown</Text>
            
            <div className="return-row">
              <span className="return-label">Welcome Bonus Used</span>
              <span className="return-value">$20.00</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Investment Capital</span>
              <span className="return-value">$10,000.00</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Daily Earnings ({roiPerDay}%)</span>
              <span className="return-value positive">+${dailyEarnings.toFixed(2)}</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Duration</span>
              <span className="return-value">{duration} days</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Total Profit</span>
              <span className="return-value positive">+${totalProfit.toFixed(2)}</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Total Return</span>
              <span className="return-value">${totalReturn.toFixed(2)}</span>
            </div>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0', fontWeight: '600' }}>
            💰 Total Return: <span style={{ color: '#22c55e', fontSize: '20px' }}>${totalReturn.toFixed(2)}</span>
          </Text>
          
          <Text style={{ textAlign: 'center', margin: '24px 0', fontSize: '14px', opacity: 0.9 }}>
            Your daily ROI will be automatically credited to your account balance every 24 hours. No action required on your part!
          </Text>
          
          <Text>
            Best regards,<br />
            <strong>The Secure Rise Team</strong>
          </Text>
          
          <Section className="footer">
            <Text>
              Secure Rise<br />
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/dashboard`} style={{ color: '#666666', textDecoration: 'underline' }}>Dashboard</a> • <a href="#" style={{ color: '#666666', textDecoration: 'underline' }}>Help Center</a>
            </Text>
            <Text style={{ marginTop: '16px' }}>
              This email was sent to {userEmail}.<br />
              &copy; 2026 Secure Rise. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
