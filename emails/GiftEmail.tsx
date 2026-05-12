import { Text } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

interface GiftEmailProps {
  userEmail: string;
  senderName: string;
  receiverName: string;
  amount: number;
  transactionId: string;
  type: 'sent' | 'received';
}

export const GiftEmail: React.FC<GiftEmailProps> = ({ 
  userEmail,
  senderName,
  receiverName,
  amount,
  transactionId,
  type
}) => {
  const isReceived = type === 'received';

  return (
    <EmailLayout preview={`🎁 Gift ${isReceived ? 'Received' : 'Sent'} - ${transactionId}`}>
      <EmailHeader 
        title={`🎁 Gift ${isReceived ? 'Received' : 'Sent'}!`} 
        subtitle={isReceived ? 'Someone sent you a wonderful gift' : 'Your gift has been sent and processed'} 
      />
      
      <Text>
        Hi <strong>{isReceived ? receiverName : senderName}</strong>,
      </Text>
      
      <Text>
        {isReceived 
          ? `You have received a gift from ${senderName}. The amount has been credited to your account balance and is available for use.`
          : `You have successfully sent a gift to ${receiverName}. The amount has been debited from your account balance.`
        }
      </Text>

      <InfoCard
        label={`Gift Amount ${isReceived ? 'Received' : 'Sent'}`}
        value={`${isReceived ? '+' : '-'}$${amount.toLocaleString()}`}
        variant={isReceived ? 'success' : 'danger'}
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
        {isReceived ? 'Credited to your account' : 'Debited from your account'}
      </Text>

      <InfoGrid
        columns={2}
        items={[
          { label: isReceived ? 'From' : 'Recipient', value: isReceived ? senderName : receiverName },
          { label: 'Transaction ID', value: transactionId }
        ]}
      />

      {isReceived && (
        <Text style={{ textAlign: 'center', margin: '24px 0' }}>
          You can now use this amount for investments or withdraw it to your preferred wallet.
        </Text>
      )}

      <CTAButton 
        href={
          isReceived 
            ? `${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/dashboard`
            : `${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/gift-member`
        }
      >
        {isReceived ? 'View Your Dashboard' : 'Send Another Gift'}
      </CTAButton>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
