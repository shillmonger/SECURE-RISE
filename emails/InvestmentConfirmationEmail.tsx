import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface InvestmentConfirmationEmailProps {
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

export const InvestmentConfirmationEmail: React.FC<InvestmentConfirmationEmailProps> = ({ 
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
            .amount {
              font-size: 32px;
              font-weight: 700;
              margin: 24px 0;
              padding: 20px;
              background-color: #f5f5f5;
              border-radius: 8px;
              text-align: center;
              letter-spacing: 1px;
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
              border-radius: 8px;
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
          `}
        </style>
      </Head>
      <Preview>Investment Confirmed</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/SKkm38h0/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Investment Confirmed</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Your investment in <strong>{planName}</strong> has been confirmed and is now active. Your daily ROI will be automatically credited to your account balance.
          </Text>
          
          <div className="amount">
            <strong>${amount.toLocaleString()}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            {planName}
          </Text>
          
          <div className="details">
            <Text>
              Daily ROI Rate: <strong>{roiPerDay}%</strong><br />
              Duration: <strong>{duration} days</strong><br />
              Investment ID: {investmentId}<br />
              Daily Earnings: <strong>${dailyEarnings.toFixed(2)}</strong>
            </Text>
          </div>
          
          <div className="returns">
            <Text className="returns-title">Projected Returns</Text>
            
            <div className="return-row">
              <span className="return-label">Daily Earnings</span>
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
          
          <Text style={{ textAlign: 'center', margin: '24px 0' }}>
            Daily ROI will be automatically credited to your account balance every 24 hours.
          </Text>
          
          <Text>
            Best,<br />
            The Secure Rise team
          </Text>
          
          <Section className="footer">
            <Text>
              Secure Rise<br />
              <a href="#" style={{ color: '#666666', textDecoration: 'underline' }}>Dashboard</a> • <a href="#" style={{ color: '#666666', textDecoration: 'underline' }}>Help Center</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
