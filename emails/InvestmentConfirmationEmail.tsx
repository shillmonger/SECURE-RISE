import { Text, Section } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  InfoGrid 
} from './components';

interface InvestmentConfirmationEmailProps {
  userEmail: string;
  username: string;
  planName: string;
  amount: number;
  roiPerDay: number;
  duration: number;
  dailyEarnings: number;
  totalProfit: number;
  totalReturn: number;
  investmentId: string;
}

export const InvestmentConfirmationEmail: React.FC<InvestmentConfirmationEmailProps> = ({ 
  userEmail,
  username,
  planName,
  amount,
  roiPerDay,
  duration,
  dailyEarnings,
  totalProfit,
  totalReturn,
  investmentId
}) => {
  return (
    <EmailLayout preview={`Investment Confirmed - ${planName} - $${amount.toLocaleString()}`}>
      <EmailHeader 
        title="Investment Confirmed! 🎉" 
        subtitle="Your investment has been successfully activated" 
      />
      
      <Text>
        Hi <strong>{username}</strong>,
      </Text>
      
      <Text>
        Your investment in <strong>{planName}</strong> has been confirmed and is now active. Your daily ROI will be automatically credited to your account balance.
      </Text>

      <InfoCard
        label="Investment Amount"
        value={`$${amount.toLocaleString()}`}
        variant="success"
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
        {planName}
      </Text>

      <InfoGrid
        items={[
          { label: 'Daily ROI Rate', value: `${roiPerDay}%` },
          { label: 'Duration', value: `${duration} days` },
          { label: 'Investment ID', value: investmentId },
          { label: 'Daily Earnings', value: `$${dailyEarnings.toFixed(2)}` }
        ]}
      />

      <Section style={{ 
        backgroundColor: '#f4f4f5', 
        padding: '24px', 
        borderRadius: '16px', 
        margin: '24px 0' 
      }}>
        <Text style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
          Projected Returns
        </Text>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Text style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>Daily Earnings</Text>
          <Text style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', margin: 0 }}>
            +${dailyEarnings.toFixed(2)}
          </Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Text style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>Duration</Text>
          <Text style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
            {duration} days
          </Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Text style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>Total Profit</Text>
          <Text style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', margin: 0 }}>
            +${totalProfit.toFixed(2)}
          </Text>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          paddingTop: '12px', 
          borderTop: '1px solid #e4e4e7' 
        }}>
          <Text style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>Total Return</Text>
          <Text style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
            ${totalReturn.toFixed(2)}
          </Text>
        </div>
      </Section>

      <Text style={{ textAlign: 'center', margin: '24px 0' }}>
        Daily ROI will be automatically credited to your account balance every 24 hours.
      </Text>

      <CTAButton href={`${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/my-investments`}>
        View Your Investments
      </CTAButton>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
