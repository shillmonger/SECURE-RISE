import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface WelcomeEmailProps {
  username: string;
  userEmail: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ username, userEmail }) => {
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
            .full-width-image {
              width: 100%;
              max-width: 560px;
              height: auto;
              margin: 30px 0;
              border-radius: 12px;
            }
          `}
        </style>
      </Head>
      <Preview>Welcome to Secure Rise</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">Welcome to Secure Rise</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Welcome to Secure Rise! Your account has been successfully created and you're ready to start your investment journey.
          </Text>
          
          <Text>
            We've credited your account with a welcome bonus of <strong style={{ color: '#22c55e' }}>$20.00</strong> to get you started.
          </Text>
          
          <Img 
            src="https://i.postimg.cc/N0kZzpSB/securerise.png" 
            alt="Secure Rise" 
            className="full-width-image"
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
