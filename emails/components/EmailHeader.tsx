import { Section, Img, Heading, Text } from '@react-email/components';

interface EmailHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({ 
  title, 
  subtitle, 
  showLogo = true 
}) => {
  return (
    <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
      {showLogo && (
        <Img
          src="https://i.postimg.cc/SKkm38h0/favicon-ico.png"
          alt="Secure Rise Logo"
          width={80}
          height={80}
          style={{
            marginBottom: '12px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />
      )}
      <Heading
        style={{
          color: '#09090b',
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          marginBottom: '8px',
          marginTop: 0,
        }}
        className="mobile-title"
      >
        {title}
      </Heading>
      {subtitle && (
        <Text
          style={{
            color: '#71717a',
            fontSize: '15px',
            margin: 0,
            marginBottom: '24px',
          }}
        >
          {subtitle}
        </Text>
      )}
    </Section>
  );
};
