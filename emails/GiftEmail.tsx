import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface GiftEmailProps {
  userEmail: string;
  senderName: string;
  receiverName: string;
  amount: number;
  transactionId: string;
  type: 'sent' | 'received';
}

export const GiftEmail: React.FC<GiftEmailProps> = ({ 
  userEmail,
  senderName,
  receiverName,
  amount,
  transactionId,
  type
}) => {
  const isReceived = type === 'received';

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
            .amount.received {
              background-color: #f0f9f0;
              color: #166534;
            }
            .amount.sent {
              background-color: #fef2f2;
              color: #dc2626;
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
      <Preview>Gift {isReceived ? 'Received' : 'Sent'}</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Gift {isReceived ? 'Received' : 'Sent'}</Text>
          
          <Text>
            Hi {isReceived ? receiverName : senderName},
          </Text>
          
          <Text>
            {isReceived 
              ? `You have received a gift from ${senderName}. The amount has been credited to your account balance and is available for use.`
              : `You have successfully sent a gift to ${receiverName}. The amount has been debited from your account balance.`
            }
          </Text>
          
          <div className={`amount ${isReceived ? 'received' : 'sent'}`}>
            <strong>{isReceived ? '+' : '-'}${amount.toLocaleString()}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            {isReceived ? 'Credited to your account' : 'Debited from your account'}
          </Text>
          
          <div className="details">
            <Text>
              {isReceived ? 'From' : 'Recipient'}: <strong>{isReceived ? senderName : receiverName}</strong><br />
              Transaction ID: {transactionId}
            </Text>
          </div>
          
          {isReceived && (
            <Text style={{ textAlign: 'center', margin: '24px 0' }}>
              You can now use this amount for investments or withdraw it to your preferred wallet.
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
