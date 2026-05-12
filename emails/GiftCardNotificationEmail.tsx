import { Text, Img } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

interface GiftCardNotificationEmailProps {
  giftCardId: string;
  username: string;
  userEmail: string;
  cardType: string;
  country: string;
  amount: number;
  currency: string;
  code: string;
  cardImage: string;
  transactionId: string;
}

export const GiftCardNotificationEmail: React.FC<GiftCardNotificationEmailProps> = ({ 
  giftCardId,
  username,
  userEmail,
  cardType,
  country,
  amount,
  currency,
  code,
  cardImage,
  transactionId
}) => {
  return (
    <EmailLayout preview={`New Gift Card Alert - ${username} - ${currency} ${amount.toLocaleString()}`}>
      <EmailHeader 
        title="New Gift Card Alert" 
        subtitle="A user has submitted a new gift card for review" 
        showLogo={false}
      />
      
      <InfoCard
        label="Gift Card Value"
        value={`${currency} ${amount.toLocaleString()}`}
        variant="warning"
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '0', fontSize: '14px', opacity: 0.9 }}>
        {cardType} ({country})
      </Text>

      <InfoGrid
        columns={1}
        items={[
          { label: 'User', value: username },
          { label: 'Email', value: userEmail },
          { label: 'Transaction ID', value: transactionId },
          { label: 'Card Code', value: code }
        ]}
      />

      <Text style={{ textAlign: 'center', margin: '24px 0', fontSize: '14px', fontWeight: 600 }}>
        Gift Card Image
      </Text>
      
      <Img
        src={cardImage}
        alt="Gift Card Image"
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
        href={`${process.env.NEXT_PUBLIC_APP_URL}/admin-dashboard/manage-gift-cards`}
        variant="warning"
        fullWidth
      >
        Review Gift Card
      </CTAButton>

      <EmailFooter showUnsubscribe={false} />
    </EmailLayout>
  );
};
