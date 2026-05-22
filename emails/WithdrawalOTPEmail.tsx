import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface WithdrawalOTPEmailProps {
  userEmail: string;
  username: string;
  otpCode: string;
  amount: number;
  cryptoName: string;
}

export const WithdrawalOTPEmail: React.FC<WithdrawalOTPEmailProps> = ({ 
  userEmail,
  username,
  otpCode,
  amount,
  cryptoName
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
            .code {
              font-size: 32px;
              font-weight: 700;
              margin: 24px 0;
              padding: 20px;
              background-color: #f5f5f5;
              border-radius: 8px;
              text-align: center;
              letter-spacing: 2px;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
              font-size: 12px;
              color: #666666;
            }
            .disclaimer {
              font-size: 13px;
              color: #666666;
              margin-top: 20px;
            }
            .details {
              margin: 20px 0;
              font-size: 14px;
            }
          `}
        </style>
      </Head>
      <Preview>Withdrawal Verification Code</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Enter this temporary verification code to continue:</Text>
          
          <div className="code">
            <strong>{otpCode}</strong>
          </div>
          
          <div className="details">
            <Text>
              Withdrawal Details:<br />
              Amount: <strong>${amount.toLocaleString()}</strong><br />
              Currency: <strong>{cryptoName}</strong>
            </Text>
          </div>
          
          <Text className="disclaimer">
            Please ignore this email if this wasn't you trying to make a withdrawal from your Secure Rise account.
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
