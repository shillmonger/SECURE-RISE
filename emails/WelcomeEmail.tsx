import { Text, Section, Img } from '@react-email/components';
import { 
  EmailLayout, 
  EmailHeader, 
  EmailFooter, 
  CTAButton, 
  InfoCard, 
  FeatureRow,
  HeroSection 
} from './components';

interface WelcomeEmailProps {
  username: string;
  userEmail: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ username, userEmail }) => {
  return (
    <EmailLayout preview="Welcome to Secure Rise - Your Account is Ready!">
      <EmailHeader 
        title="Welcome to Secure Rise" 
        subtitle="Your account is active and ready for growth." 
      />
      
      <Text>
        Hi <strong>{username}</strong>,
      </Text>
      
      <Text>
        We're excited to have you on board! Secure Rise is designed to provide you with a premium, secure, and seamless trading experience.
      </Text>

      <InfoCard
        label="Welcome Bonus Credited"
        value="$20.00"
        variant="success"
        fullWidth
      />

      <Text style={{ textAlign: 'center', margin: '0', fontSize: '14px', opacity: 0.9 }}>
        Start your first investment with us today.
      </Text>

      <Section style={{ margin: '32px 0' }}>
        <FeatureRow
          title="Pro Trading Tools"
          description="Access real-time analytics and advanced charting."
        />
        <FeatureRow
          title="Institutional Security"
          description="Your assets are protected by industry-leading encryption."
        />
      </Section>

      <HeroSection
        title="Ready to start growing your wealth?"
        subtitle="Your journey to financial success begins now"
      />

      <CTAButton href={`${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/dashboard`}>
        Open Your Dashboard
      </CTAButton>

      <EmailFooter userEmail={userEmail} />
    </EmailLayout>
  );
};
