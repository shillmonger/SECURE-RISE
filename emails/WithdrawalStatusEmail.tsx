import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface WithdrawalStatusEmailProps {
  userEmail: string;
  username: string;
  amount: number;
  crypto: {
    name: string;
    symbol: string;
  };
  destinationAddress: string;
  transactionId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export const WithdrawalStatusEmail: React.FC<WithdrawalStatusEmailProps> = ({ 
  userEmail,
  username,
  amount,
  crypto,
  destinationAddress,
  transactionId,
  status,
  rejectionReason
}) => {
  const isApproved = status === 'approved';

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
          `}
        </style>
      </Head>
      <Preview>Withdrawal {isApproved ? 'Approved' : 'Rejected'}</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Withdrawal {isApproved ? 'Approved' : 'Rejected'}</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Your withdrawal request has been reviewed and {isApproved ? 'approved' : 'rejected'}.
          </Text>
          
          <div className="code">
            <strong>{isApproved ? 'APPROVED' : 'REJECTED'}</strong>
          </div>
          
          <Text>
            Amount: <strong>${amount.toLocaleString()}</strong><br />
            Currency: <strong>{crypto.name}</strong><br />
            Transaction ID: {transactionId}
          </Text>
          
          {isApproved && (
            <Text>
              Destination Address: {destinationAddress}<br /><br />
              The funds have been sent to your designated wallet address.
            </Text>
          )}
          
          {!isApproved && rejectionReason && (
            <Text>
              Rejection Reason: {rejectionReason}<br /><br />
              Please review the feedback above and submit a new withdrawal request if needed.
            </Text>
          )}
          
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
