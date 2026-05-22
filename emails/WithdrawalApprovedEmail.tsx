import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface WithdrawalApprovedEmailProps {
  userEmail: string;
  username: string;
  amount: number;
  crypto: {
    name: string;
    symbol: string;
  };
  destinationAddress: string;
  transactionId: string;
}

export const WithdrawalApprovedEmail: React.FC<WithdrawalApprovedEmailProps> = ({ 
  userEmail,
  username,
  amount,
  crypto,
  destinationAddress,
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
            .status {
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
            .address {
              font-family: monospace;
              background-color: #f5f5f5;
              padding: 12px;
              border-radius: 6px;
              word-break: break-all;
              margin: 10px 0;
            }
          `}
        </style>
      </Head>
      <Preview>Withdrawal Approved</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Withdrawal Approved</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Your withdrawal request has been reviewed and approved.
          </Text>
          
          <div className="status">
            <strong>APPROVED</strong>
          </div>
          
          <div className="amount">
            <strong>${amount.toLocaleString()}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '0', fontSize: '14px', opacity: 0.9 }}>
            {crypto.name} ({crypto.symbol})
          </Text>
          
          <div className="details">
            <Text>
              Transaction ID: {transactionId}<br />
              Currency: <strong>{crypto.name}</strong><br />
              Amount: <strong>${amount.toLocaleString()}</strong>
            </Text>
          </div>
          
          <Text>
            Destination Address:
          </Text>
          
          <div className="address">
            {destinationAddress}
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0' }}>
            The funds have been sent to your designated wallet address.
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
