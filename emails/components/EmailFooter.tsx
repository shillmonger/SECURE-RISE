import { Section, Text, Hr } from '@react-email/components';

interface EmailFooterProps {
  userEmail?: string;
  showUnsubscribe?: boolean;
}

export const EmailFooter: React.FC<EmailFooterProps> = ({ 
  userEmail,
  showUnsubscribe = false 
}) => {
  return (
    <>
      <Hr 
        style={{
          borderColor: '#e4e4e7',
          marginTop: '40px',
          marginBottom: '24px',
        }}
      />
      <Section style={{ textAlign: 'center' }}>
        <Text style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>
          Best regards,<br />
          <strong style={{ color: '#09090b' }}>The Secure Rise Team</strong>
        </Text>
        {userEmail && (
          <Text 
            style={{
              color: '#71717a',
              fontSize: '11px',
              marginTop: '20px',
              marginBottom: 0,
            }}
          >
            This email was sent to {userEmail}.<br />
            &copy; 2026 Secure Rise. All rights reserved.
          </Text>
        )}
        {showUnsubscribe && (
          <Text 
            style={{
              color: '#71717a',
              fontSize: '11px',
              marginTop: '16px',
              marginBottom: 0,
            }}
          >
            <a 
              href="#" 
              style={{ 
                color: '#71717a', 
                textDecoration: 'underline' 
              }}
            >
              Unsubscribe
            </a>
          </Text>
        )}
      </Section>
    </>
  );
};
