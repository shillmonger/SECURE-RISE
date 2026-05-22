import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface DailyROIEmailProps {
  userEmail: string;
  username: string;
  investmentId: string;
  planName: string;
  dailyProfit: number;
  totalProfit: number;
  daysPassed: number;
  totalDays: number;
  accountBalance: number;
}

export const DailyROIEmail: React.FC<DailyROIEmailProps> = ({ 
  userEmail,
  username,
  investmentId,
  planName,
  dailyProfit,
  totalProfit,
  daysPassed,
  totalDays,
  accountBalance
}) => {
  const progressPercentage = Math.round((daysPassed / totalDays) * 100);

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
            .progress {
              background-color: #f4f4f5;
              padding: 24px;
              border-radius: 8px;
              margin: 24px 0;
            }
            .progress-title {
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .progress-bar {
              background-color: #e4e4e7;
              height: 8px;
              border-radius: 4px;
              margin: 16px 0;
              overflow: hidden;
            }
            .progress-fill {
              background-color: #22c55e;
              height: 100%;
              border-radius: 4px;
            }
            .progress-info {
              display: flex;
              justify-content: space-between;
              margin-top: 8px;
              font-size: 12px;
              color: #71717a;
            }
          `}
        </style>
      </Head>
      <Preview>Daily ROI Added</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Daily ROI Added</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Great news! Your daily ROI has been automatically credited to your account balance for your <strong>{planName}</strong> investment.
          </Text>
          
          <div className="amount">
            <strong>+${dailyProfit.toFixed(2)}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            Credited to your account
          </Text>
          
          <div className="details">
            <Text>
              Investment Plan: <strong>{planName}</strong><br />
              Investment ID: {investmentId}<br />
              Days Progress: <strong>{daysPassed} / {totalDays}</strong><br />
              Account Balance: <strong>${accountBalance.toFixed(2)}</strong>
            </Text>
          </div>
          
          <div className="progress">
            <Text className="progress-title">Investment Progress</Text>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="progress-info">
              <span>{progressPercentage}% Complete</span>
              <span>Total Profit: ${totalProfit.toFixed(2)}</span>
            </div>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0' }}>
            Your daily ROI will continue to be automatically credited for {totalDays - daysPassed} more days.
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
