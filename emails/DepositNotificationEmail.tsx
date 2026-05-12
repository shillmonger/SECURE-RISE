import { Text, Img } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

interface DepositNotificationEmailProps {
  depositId: string;
  username: string;
  userEmail: string;
  amount: number;
  paymentMethod: string;
  proofImage: string;
  transactionId: string;
}

export const DepositNotificationEmail: React.FC<DepositNotificationEmailProps> = ({ 
  depositId,
  username,
  userEmail,
  amount,
  paymentMethod,
  proofImage,
  transactionId
}) => {
  return (
    <EmailLayout preview={`New Deposit Alert - ${username} - $${amount.toLocaleString()}`}>
      <EmailHeader 
        title="New Deposit Alert" 
        subtitle="A user has submitted a new deposit for review" 
        showLogo={false}
      />
      
      <InfoCard
        label="Deposit Amount"
        value={`$${amount.toLocaleString()}`}
        variant="warning"
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '0', fontSize: '14px', opacity: 0.9 }}>
        {paymentMethod}
      </Text>

      <InfoGrid
        columns={1}
        items={[
          { label: 'User', value: username },
          { label: 'Email', value: userEmail },
          { label: 'Transaction ID', value: transactionId },
          { label: 'Payment Method', value: paymentMethod }
        ]}
      />

      <Text style={{ textAlign: 'center', margin: '24px 0', fontSize: '14px', fontWeight: 600 }}>
        Proof of Transfer
      </Text>
      
      <Img
        src={proofImage}
        alt="Proof of Transfer"
        width={300}
        height="auto"
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '12px',
          margin: '16px auto',
          display: 'block',
        }}
      />

      <CTAButton 
        href={`${process.env.NEXT_PUBLIC_APP_URL}/admin-dashboard/manage-deposit`}
        variant="warning"
        fullWidth
      >
        Review Deposit
      </CTAButton>

      <EmailFooter showUnsubscribe={false} />
    </EmailLayout>
  );
};
