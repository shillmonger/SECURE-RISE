import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface DepositApprovedAdminEmailProps {
  username: string;
  userEmail: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
}

export const DepositApprovedAdminEmail: React.FC<DepositApprovedAdminEmailProps> = ({ 
  username,
  userEmail,
  amount,
  paymentMethod,
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
          `}
        </style>
      </Head>
      <Preview>Deposit Approved</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Deposit Approved</Text>
          
          <Text>
            A user deposit has been approved and processed:
          </Text>
          
          <div className="status">
            <strong>APPROVED</strong>
          </div>
          
          <div className="amount">
            <strong>${amount.toLocaleString()}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '0', fontSize: '14px', opacity: 0.9 }}>
            {paymentMethod}
          </Text>
          
          <div className="details">
            <Text>
              User: <strong>{username}</strong><br />
              Email: {userEmail}<br />
              Transaction ID: {transactionId}<br />
              Payment Method: <strong>{paymentMethod}</strong>
            </Text>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0' }}>
            The funds have been added to the user's account balance.
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
