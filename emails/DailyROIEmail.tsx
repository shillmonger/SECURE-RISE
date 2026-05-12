import { Text, Section } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

interface DailyROIEmailProps {
  userEmail: string;
  username: string;
  investmentId: string;
  planName: string;
  dailyProfit: number;
  totalProfit: number;
  daysPassed: number;
  totalDays: number;
  accountBalance: number;
}

export const DailyROIEmail: React.FC<DailyROIEmailProps> = ({ 
  userEmail,
  username,
  investmentId,
  planName,
  dailyProfit,
  totalProfit,
  daysPassed,
  totalDays,
  accountBalance
}) => {
  const progressPercentage = Math.round((daysPassed / totalDays) * 100);

  return (
    <EmailLayout preview={`Daily ROI Added - $${dailyProfit.toFixed(2)} - ${planName}`}>
      <EmailHeader 
        title="Daily ROI Added! 💰" 
        subtitle="Your daily earnings have been credited" 
      />
      
      <Text>
        Hi <strong>{username}</strong>,
      </Text>
      
      <Text>
        Great news! Your daily ROI has been automatically credited to your account balance for your <strong>{planName}</strong> investment.
      </Text>

      <InfoCard
        label="Today's Earnings"
        value={`+$${dailyProfit.toFixed(2)}`}
        variant="success"
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
        Credited to your account
      </Text>

      <InfoGrid
        columns={1}
        items={[
          { label: 'Investment Plan', value: planName },
          { label: 'Investment ID', value: investmentId },
          { label: 'Days Progress', value: `${daysPassed} / ${totalDays}` },
          { label: 'Account Balance', value: `$${accountBalance.toFixed(2)}` }
        ]}
      />

      <Section style={{ 
        backgroundColor: '#f4f4f5', 
        padding: '24px', 
        borderRadius: '16px', 
        margin: '24px 0' 
      }}>
        <Text style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>
          Investment Progress
        </Text>
        
        <div style={{ 
          backgroundColor: '#e4e4e7', 
          height: '8px', 
          borderRadius: '4px', 
          margin: '16px 0', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            backgroundColor: '#22c55e', 
            height: '100%', 
            borderRadius: '4px', 
            width: `${progressPercentage}%` 
          }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <Text style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
            {progressPercentage}% Complete
          </Text>
          <Text style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
            Total Profit: ${totalProfit.toFixed(2)}
          </Text>
        </div>
      </Section>

      <Text style={{ textAlign: 'center', margin: '24px 0' }}>
        Your daily ROI will continue to be automatically credited for {totalDays - daysPassed} more days.
      </Text>

      <CTAButton href={`${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/my-investments`} fullWidth>
        View All Investments
      </CTAButton>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
