import { Html, Head, Preview, Body, Container, Text, Img, Section, Hr } from '@react-email/components';

interface ContactFormEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  contactReason: string;
  message: string;
  submittedAt: string;
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({ 
  firstName,
  lastName,
  email,
  contactReason,
  message,
  submittedAt
}) => {
  const fullName = `${firstName} ${lastName}`;
  
  return (
    <Html>
      <Head>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #fafafa;
              color: #09090b;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
              background-color: #ffffff;
              border: 1px solid #e4e4e7;
              border-radius: 24px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .logo {
              margin-bottom: 32px;
              text-align: center;
            }
            .header {
              text-align: center;
              margin-bottom: 32px;
            }
            .title {
              font-size: 26px;
              font-weight: 700;
              margin-bottom: 8px;
              color: #09090b;
              letter-spacing: -0.025em;
            }
            .subtitle {
              font-size: 15px;
              color: #71717a;
              margin-bottom: 24px;
            }
            .info-box {
              background-color: #f4f4f5;
              border: 1px solid #e4e4e7;
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
            }
            .info-label {
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #71717a;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 15px;
              font-weight: 600;
              color: #09090b;
              word-break: break-all;
            }
            .info-row {
              margin-bottom: 16px;
              padding-bottom: 16px;
              border-bottom: 1px solid #e4e4e7;
            }
            .info-row:last-child {
              margin-bottom: 0;
              padding-bottom: 0;
              border-bottom: none;
            }
            .message-content {
              font-size: 15px;
              line-height: 1.6;
              color: #09090b;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 40px;
              padding-top: 24px;
              border-top: 1px solid #e4e4e7;
              text-align: center;
              font-size: 13px;
              color: #71717a;
            }
            .reason-badge {
              display: inline-block;
              background-color: #229ED9;
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin: 16px 0;
            }
          `}
        </style>
      </Head>
      <Preview>New Contact Form Submission - {fullName}</Preview>
      <Body style={{ backgroundColor: '#fafafa', margin: 0, padding: 0 }}>
        <Container className="container">
          <div className="logo">
            <Img 
              src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
              alt="Secure Rise" 
              width="64" 
              height="64"
            />
          </div>
          
          <div className="header">
            <Text className="title">New Contact Inquiry</Text>
            <Text className="subtitle">A user has submitted a contact form on the Secure Rise platform</Text>
          </div>
          
          <div className="info-box">
            <div className="info-row">
              <Text className="info-label">Contact Information</Text>
              <Text className="info-value">{fullName}</Text>
              <Text className="info-value" style={{ marginTop: '4px' }}>{email}</Text>
            </div>
            
            <div className="info-row">
              <Text className="info-label">Inquiry Reason</Text>
              <div style={{ marginTop: '8px' }}>
                <div className="reason-badge">
                  {contactReason}
                </div>
              </div>
            </div>
            
            <div className="info-row">
              <Text className="info-label">Message</Text>
              <Text className="message-content" style={{ marginTop: '8px' }}>{message}</Text>
            </div>
            
            <div className="info-row">
              <Text className="info-label">Submitted At</Text>
              <Text className="info-value" style={{ marginTop: '4px' }}>{submittedAt}</Text>
            </div>
          </div>
          
          <Hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e4e4e7' }} />
          
          <Text style={{ fontSize: '14px', color: '#71717a', textAlign: 'center' }}>
            Please review this inquiry and respond to the user as soon as possible.
          </Text>
          
          <Section className="footer">
            <Text>
              Secure Rise Contact Form<br />
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/landing-page/contact-us`} style={{ color: '#229ED9', textDecoration: 'none', fontWeight: 600 }}>View Contact Page</a> • <a href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard`} style={{ color: '#229ED9', textDecoration: 'none', fontWeight: 600 }}>Admin Dashboard</a>
            </Text>
            <Text style={{ marginTop: '16px', fontSize: '11px' }}>
              &copy; 2026 Secure Rise. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
