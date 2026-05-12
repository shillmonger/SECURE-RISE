import { Text } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

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
    <EmailLayout preview={`KYC ${isApproved ? 'Approved' : 'Rejected'} - Secure Rise`}>
      <EmailHeader 
        title={`KYC ${isApproved ? 'Approved' : 'Rejected'}`} 
        subtitle="Your identity verification has been reviewed" 
      />
      
      <Text>
        Hi <strong>{username}</strong>,
      </Text>

      <InfoCard
        label="Status"
        value={isApproved ? 'APPROVED' : 'REJECTED'}
        variant={isApproved ? 'success' : 'danger'}
        fullWidth
      />

      {!isApproved && rejectionReason && (
        <InfoCard
          label="Rejection Reason"
          value={rejectionReason}
          variant="danger"
          fullWidth
        />
      )}

      {isApproved ? (
        <Text style={{ textAlign: 'center', margin: '24px 0' }}>
          Congratulations! Your identity has been verified. You now have full access to all platform features.
        </Text>
      ) : (
        <Text style={{ textAlign: 'center', margin: '24px 0' }}>
          Please review the feedback above and submit your KYC again with the correct information.
        </Text>
      )}

      <CTAButton href={`${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/kyc`} fullWidth>
        View KYC Status
      </CTAButton>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
