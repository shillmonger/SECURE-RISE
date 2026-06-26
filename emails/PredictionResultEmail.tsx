import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface PredictionResultEmailProps {
  userEmail: string;
  username: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  closePrice: number;
  confidence: 'Low' | 'Medium' | 'High';
  status: 'won' | 'lost';
  xpEarned: number;
  submissionDate: string;
}

export const PredictionResultEmail: React.FC<PredictionResultEmailProps> = ({ 
  userEmail,
  username,
  pair,
  direction,
  entryPrice,
  closePrice,
  confidence,
  status,
  xpEarned,
  submissionDate
}) => {
  const isWon = status === 'won';
  const priceChange = closePrice - entryPrice;
  const priceChangePercent = ((priceChange / entryPrice) * 100).toFixed(2);
  const priceChangeSign = priceChange >= 0 ? '+' : '';

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
            .result-box {
              font-size: 32px;
              font-weight: 700;
              margin: 24px 0;
              padding: 24px;
              border-radius: 8px;
              text-align: center;
              letter-spacing: 1px;
            }
            .won {
              background-color: #f0f9f0;
              color: #166534;
            }
            .lost {
              background-color: #fef2f2;
              color: #991b1b;
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
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .price-change {
              font-size: 18px;
              font-weight: 600;
              margin: 8px 0;
            }
            .positive {
              color: #166534;
            }
            .negative {
              color: #991b1b;
            }
          `}
        </style>
      </Head>
      <Preview>Prediction Result: {isWon ? 'Won' : 'Lost'}</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">
            {isWon ? '🎉 Prediction Won!' : '😔 Prediction Lost'}
          </Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            {isWon 
              ? 'Congratulations! Your market prediction was correct and you have been awarded XP.'
              : 'Your market prediction was incorrect this time. Keep trying - you can predict again tomorrow!'
            }
          </Text>
          
          <div className={`result-box ${status}`}>
            <strong>{isWon ? '+1,000 XP Awarded' : 'No XP Earned'}</strong>
          </div>
          
          <div className="info-box">
            <Text>
              <strong>Trading Pair:</strong> {pair}<br />
              <strong>Your Direction:</strong> {direction}<br />
              <strong>Entry Price:</strong> ${entryPrice.toLocaleString()}<br />
              <strong>Market Close Price:</strong> ${closePrice.toLocaleString()}
            </Text>
            <Text className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              Price Change: {priceChangeSign}${priceChange.toFixed(2)} ({priceChangeSign}{priceChangePercent}%)
            </Text>
            <Text>
              <strong>Confidence Level:</strong> {confidence}<br />
              <strong>Prediction Date:</strong> {submissionDate}
            </Text>
          </div>
          
          <div className="details">
            <Text>
              {isWon 
                ? `Your total XP balance has been updated. You can redeem XP for USDT or continue earning more through predictions, daily streaks, and achievements.`
                : `Don't be discouraged! Market predictions require skill and timing. Analyze the market trends and try again tomorrow.`
              }
            </Text>
          </div>
          
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
