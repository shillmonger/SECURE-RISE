import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface GiftCardNotificationEmailProps {
  giftCardId: string;
  username: string;
  userEmail: string;
  cardType: string;
  country: string;
  amount: number;
  currency: string;
  code: string;
  cardImage: string;
  transactionId: string;
}

export const GiftCardNotificationEmail: React.FC<GiftCardNotificationEmailProps> = ({ 
  giftCardId,
  username,
  userEmail,
  cardType,
  country,
  amount,
  currency,
  code,
  cardImage,
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
            .card-image {
              width: 100%;
              max-width: 560px;
              height: auto;
              margin: 30px 0;
              border-radius: 8px;
            }
            .card-code {
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
      <Preview>New Gift Card Received</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">New Gift Card Received</Text>
          
          <Text>
            A user has submitted a new gift card for review:
          </Text>
          
          <div className="amount">
            <strong>{currency} {amount.toLocaleString()}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '0', fontSize: '14px', opacity: 0.9 }}>
            {cardType} ({country})
          </Text>
          
          <div className="details">
            <Text>
              User: <strong>{username}</strong><br />
              Email: {userEmail}<br />
              Transaction ID: {transactionId}<br />
              Card Type: <strong>{cardType}</strong>
            </Text>
          </div>
          
          <Text>
            Card Code:
          </Text>
          
          <div className="card-code">
            <strong>{code}</strong>
          </div>
          
          <Text style={{ textAlign: 'center', margin: '24px 0', fontSize: '14px', fontWeight: 600 }}>
            Gift Card Image
          </Text>
          
          <Img
            src={cardImage}
            alt="Gift Card Image"
            className="card-image"
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
