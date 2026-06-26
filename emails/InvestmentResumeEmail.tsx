import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface InvestmentResumeEmailProps {
  userEmail: string;
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
}

export const InvestmentResumeEmail: React.FC<InvestmentResumeEmailProps> = ({ 
  userEmail,
  username,
  planName,
  amount,
  roiRate,
  durationDays,
  daysPassed,
  missingDays,
  profitEarned,
  missingProfit,
  totalProfit,
  investmentId,
  startDate,
  endDate
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
            .credit-box {
              background-color: #dcfce7;
              border: 2px solid #22c55e;
              padding: 24px;
              border-radius: 8px;
              margin: 24px 0;
              text-align: center;
            }
            .credit-amount {
              font-size: 36px;
              font-weight: 800;
              color: #16a34a;
              margin: 12px 0;
            }
            .credit-label {
              font-size: 14px;
              color: #166534;
              text-transform: uppercase;
              letter-spacing: 0.1em;
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
      <Preview>Investment Resumed - Credits Added</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Investment Resumed</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Your investment in <strong>{planName}</strong> has been successfully resumed. We've detected missing ROI credits and have added them to your account balance.
          </Text>
          
          <div className="credit-box">
            <Text className="credit-label">Credits Added to Your Account</Text>
            <Text className="credit-amount">+${missingProfit.toFixed(2)}</Text>
            <Text style={{ fontSize: '13px', color: '#166534', marginTop: '8px' }}>
              {missingDays} missing day{missingDays > 1 ? 's' : ''} of profit
            </Text>
          </div>
          
          <div className="amount">
            <strong>${amount.toLocaleString()}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            {planName}
          </Text>
          
          <div className="details">
            <Text>
              Daily ROI Rate: <strong>{roiRate}%</strong><br />
              Duration: <strong>{durationDays} days</strong><br />
              Investment ID: {investmentId}<br />
              Start Date: {startDate}<br />
              End Date: {endDate}
            </Text>
          </div>
          
          <div className="returns">
            <Text className="returns-title">Investment Summary</Text>
            
            <div className="return-row">
              <span className="return-label">Days Passed</span>
              <span className="return-value">{daysPassed} / {durationDays}</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Missing Days Recovered</span>
              <span className="return-value positive">{missingDays}</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Previous Profit</span>
              <span className="return-value">${(profitEarned - missingProfit).toFixed(2)}</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Credits Added</span>
              <span className="return-value positive">+${missingProfit.toFixed(2)}</span>
            </div>
            
            <div className="return-row">
              <span className="return-label">Total Profit Earned</span>
              <span className="return-value positive">${totalProfit.toFixed(2)}</span>
            </div>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0' }}>
            Your investment is now marked as completed. The missing profits have been credited to your account balance and are available for withdrawal.
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
