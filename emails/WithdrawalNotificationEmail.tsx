import { Text } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

interface WithdrawalNotificationEmailProps {
  withdrawalId: string;
  username: string;
  userEmail: string;
  amount: number;
  crypto: {
    name: string;
    symbol: string;
    icon: string;
  };
  destinationAddress: string;
}

export const WithdrawalNotificationEmail: React.FC<WithdrawalNotificationEmailProps> = ({ 
  withdrawalId,
  username,
  userEmail,
  amount,
  crypto,
  destinationAddress
}) => {
  return (
    <EmailLayout preview={`New Withdrawal Request - ${username} - $${amount.toLocaleString()}`}>
      <EmailHeader 
        title="New Withdrawal Request" 
        subtitle="A user has submitted a withdrawal for review" 
        showLogo={false}
      />
      
      <InfoCard
        label="Withdrawal Amount"
        value={`$${amount.toLocaleString()}`}
        variant="warning"
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '0', fontSize: '14px', opacity: 0.9 }}>
        {crypto.name} ({crypto.symbol})
      </Text>

      <InfoGrid
        columns={1}
        items={[
          { label: 'User', value: username },
          { label: 'Email', value: userEmail },
          { label: 'Withdrawal ID', value: withdrawalId },
          { label: 'Currency', value: crypto.name }
        ]}
      />

      <InfoCard
        label="Destination Address"
        value={destinationAddress}
        variant="default"
        fullWidth
      />

      <CTAButton 
        href={`${process.env.NEXT_PUBLIC_APP_URL}/admin-dashboard/investment-payouts`}
        variant="warning"
      >
        Review Withdrawal
      </CTAButton>

      <EmailFooter showUnsubscribe={false} />
    </EmailLayout>
  );
};
