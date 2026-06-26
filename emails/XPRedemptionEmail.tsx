import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface XPRedemptionEmailProps {
  userEmail: string;
  username: string;
  xpType: 'daily' | 'achievement' | 'prediction';
  xpAmount: number;
  usdtAmount: number;
  transactionId: string;
}

export const XPRedemptionEmail: React.FC<XPRedemptionEmailProps> = ({ 
  userEmail,
  username,
  xpType,
  xpAmount,
  usdtAmount,
  transactionId
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
              background-color: #f0f9f0;
              color: #166534;
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
            .info-box {
              background-color: #f5f5f5;
              padding: 16px;
              border-radius: 8px;
              margin: 16px 0;
            }
          `}
        </style>
      </Head>
      <Preview>XP Redemption Successful</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">XP Redemption Successful</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Your XP redemption has been successfully processed. The USDT amount has been credited to your account balance and is available for use.
          </Text>
          
          <div className="amount">
            <strong>+${usdtAmount.toFixed(2)} USDT</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            Credited to your account
          </Text>
          
          <div className="info-box">
            <Text>
              <strong>XP Type:</strong> {xpType === 'daily' ? 'Daily Streak XP' : xpType === 'achievement' ? 'Achievement Milestone XP' : 'Prediction XP'}<br />
              <strong>XP Redeemed:</strong> {xpAmount.toLocaleString()} XP<br />
              <strong>USDT Received:</strong> ${usdtAmount.toFixed(2)}<br />
              <strong>Conversion Rate:</strong> 100 XP = $2.00
            </Text>
          </div>
          
          <div className="details">
            <Text>
              Transaction ID: {transactionId}
            </Text>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0' }}>
            You can now use this amount for investments or withdraw it to your preferred wallet.
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
