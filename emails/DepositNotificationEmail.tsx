import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface DepositNotificationEmailProps {
  depositId: string;
  username: string;
  userEmail: string;
  amount: number;
  paymentMethod: string;
  proofImage: string;
  transactionId: string;
}

export const DepositNotificationEmail: React.FC<DepositNotificationEmailProps> = ({ 
  depositId,
  username,
  userEmail,
  amount,
  paymentMethod,
  proofImage,
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
            .proof-image {
              width: 100%;
              max-width: 560px;
              height: auto;
              margin: 30px 0;
              border-radius: 8px;
            }
          `}
        </style>
      </Head>
      <Preview>New Deposit Received</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/SKkm38h0/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">New Deposit Received</Text>
          
          <Text>
            A new deposit has been submitted for review:
          </Text>
          
          <div className="amount">
            <strong>${amount.toLocaleString()}</strong>
          </div>
          
          <div className="details">
            <Text>
              User: <strong>{username}</strong><br />
              Email: {userEmail}<br />
              Payment Method: <strong>{paymentMethod}</strong><br />
              Transaction ID: {transactionId}
            </Text>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0', fontSize: '14px', fontWeight: 600 }}>
            Proof of Transfer
          </Text>
          
          <Img
            src={proofImage}
            alt="Proof of Transfer"
            className="proof-image"
          />
          
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
