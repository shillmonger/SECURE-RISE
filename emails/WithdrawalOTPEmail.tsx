import { Text, Section } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  InfoCard, 
  InfoGrid 
} from './components';

interface WithdrawalOTPEmailProps {
  userEmail: string;
  username: string;
  otpCode: string;
  amount: number;
  cryptoName: string;
}

export const WithdrawalOTPEmail: React.FC<WithdrawalOTPEmailProps> = ({ 
  userEmail,
  username,
  otpCode,
  amount,
  cryptoName
}) => {
  return (
    <EmailLayout preview="Withdrawal Verification Code - Secure Rise">
      <EmailHeader 
        title="Withdrawal Verification" 
        subtitle="Enter the code below to confirm your withdrawal" 
      />
      
      <Text>
        Hi <strong>{username}</strong>,
      </Text>
      
      <Text>
        You have initiated a withdrawal request. Use the verification code below to proceed:
      </Text>

      <InfoGrid
        items={[
          { label: 'Amount', value: `$${amount.toLocaleString()}` },
          { label: 'Currency', value: cryptoName }
        ]}
      />

      <InfoCard
        label="Verification Code"
        value={otpCode}
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
          If you didn't request this withdrawal, contact support immediately.
        </Text>
      </Section>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
