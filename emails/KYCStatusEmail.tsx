import { Html, Head, Preview, Body, Container, Text, Img, Section } from '@react-email/components';

interface KYCStatusEmailProps {
  userEmail: string;
  username: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export const KYCStatusEmail: React.FC<KYCStatusEmailProps> = ({ 
  userEmail,
  username,
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
            .status {
              font-size: 32px;
              font-weight: 700;
              margin: 24px 0;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              letter-spacing: 1px;
            }
            .status.approved {
              background-color: #f0f9f0;
              color: #166534;
            }
            .status.rejected {
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
            .rejection-reason {
              background-color: #fef2f2;
              padding: 16px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 14px;
            }
          `}
        </style>
      </Head>
      <Preview>KYC Verification {isApproved ? 'Approved' : 'Rejected'}</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0 }}>
        <Container className="container">
          <Img 
            src="https://i.postimg.cc/0NK6BRV6/favicon-ico.png" 
            alt="Secure Rise" 
            width="32" 
            height="32"
            className="logo"
          />
          
          <Text className="title">KYC Verification {isApproved ? 'Approved' : 'Rejected'}</Text>
          
          <Text>
            Hi {username},
          </Text>
          
          <Text>
            Your identity verification has been reviewed.
          </Text>
          
          <div className={`status ${isApproved ? 'approved' : 'rejected'}`}>
            <strong>{isApproved ? 'APPROVED' : 'REJECTED'}</strong>
          </div>
          
          {isApproved ? (
            <Text style={{ textAlign: 'center', margin: '24px 0' }}>
              Congratulations! Your identity has been verified. You now have full access to all platform features.
            </Text>
          ) : (
            <>
              {!isApproved && rejectionReason && (
                <div className="rejection-reason">
                  <Text>
                    <strong>Rejection Reason:</strong><br />
                    {rejectionReason}
                  </Text>
                </div>
              )}
              <Text style={{ textAlign: 'center', margin: '24px 0' }}>
                Please review the feedback above and submit your KYC again with correct information.
              </Text>
            </>
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
