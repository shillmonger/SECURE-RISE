import { Text, Section, Img } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

interface DepositStatusEmailProps {
  userEmail: string;
  username: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export const DepositStatusEmail: React.FC<DepositStatusEmailProps> = ({ 
  userEmail,
  username,
  amount,
  paymentMethod,
  transactionId,
  status,
  rejectionReason
}) => {
  const isApproved = status === 'approved';

  return (
    <EmailLayout preview={`Deposit ${isApproved ? 'Approved' : 'Rejected'} - ${transactionId}`}>
      <EmailHeader 
        title={`Deposit ${isApproved ? 'Approved' : 'Rejected'}`} 
        subtitle="Your deposit has been reviewed" 
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

      <InfoCard
        label={`Deposit ${isApproved ? 'Amount' : 'Amount'}`}
        value={`$${amount.toLocaleString()}`}
        variant={isApproved ? 'success' : 'danger'}
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
        {paymentMethod}
      </Text>

      {!isApproved && rejectionReason && (
        <InfoCard
          label="Rejection Reason"
          value={rejectionReason}
          variant="danger"
          fullWidth
        />
      )}

      <InfoGrid
        columns={1}
        items={[
          { label: 'Transaction ID', value: transactionId },
          { label: 'Payment Method', value: paymentMethod }
        ]}
      />

      {isApproved && (
        <Text style={{ textAlign: 'center', margin: '24px 0' }}>
          The funds have been added to your account balance. You can now use them for investments.
        </Text>
      )}

      <CTAButton href={`${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/deposit`} fullWidth>
        View Your Deposits
      </CTAButton>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
