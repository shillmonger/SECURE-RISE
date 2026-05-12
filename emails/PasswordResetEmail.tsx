import { Text, Section } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  InfoCard 
} from './components';

interface PasswordResetEmailProps {
  userEmail: string;
  resetCode: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ 
  userEmail, 
  resetCode 
}) => {
  return (
    <EmailLayout preview="Password Reset - Secure Rise">
      <EmailHeader 
        title="Reset your password" 
        subtitle="Enter the code below to secure your account." 
      />
      
      <Text>
        We received a request to reset the password for your <strong>Secure Rise</strong> account. Use the verification code below to proceed:
      </Text>

      <InfoCard
        label="Verification Code"
        value={resetCode}
        variant="default"
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '10px 0 0 0', fontSize: '13px', opacity: 0.8 }}>
        Expires in 5 minutes
      </Text>

      <Section style={{ margin: '24px 0', padding: 0 }}>
        <Text style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '12px', 
          fontSize: '14px', 
          color: '#4b5563' 
        }}>
          <span style={{ color: '#09090b', fontWeight: 'bold', marginRight: '10px' }}>!</span>
          Never share this verification code with anyone.
        </Text>
        <Text style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '12px', 
          fontSize: '14px', 
          color: '#4b5563' 
        }}>
          <span style={{ color: '#09090b', fontWeight: 'bold', marginRight: '10px' }}>!</span>
          Secure Rise staff will never ask for this code.
        </Text>
        <Text style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '12px', 
          fontSize: '14px', 
          color: '#4b5563' 
        }}>
          <span style={{ color: '#09090b', fontWeight: 'bold', marginRight: '10px' }}>!</span>
          If you didn't request this, you can safely ignore this email.
        </Text>
      </Section>

      <Text style={{ fontSize: '14px' }}>
        If you continue to have issues, please contact our support team at{' '}
        <a 
          href="mailto:support@securerise.com" 
          style={{ color: '#09090b', fontWeight: 600 }}
        >
          support@securerise.com
        </a>.
      </Text>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
