import { Html, Head, Preview, Body, Container, Section, Text } from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({ children, preview }) => {
  return (
    <Html>
      <Head>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #09090b;
              margin: 0;
              padding: 0;
              background-color: #fafafa;
            }
            @media (max-width: 600px) {
              .mobile-container {
                padding: 20px !important;
              }
              .mobile-title {
                font-size: 24px !important;
              }
              .mobile-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Body style={{ backgroundColor: '#fafafa', margin: 0, padding: '20px 0' }}>
        <Container 
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          className="mobile-container"
        >
          {children}
        </Container>
      </Body>
    </Html>
  );
};
