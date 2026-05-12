import { Section, Img, Text } from '@react-email/components';

interface HeroSectionProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  showImage?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  imageUrl = "https://i.postimg.cc/N0kZzpSB/securerise.png",
  title,
  subtitle,
  showImage = true 
}) => {
  return (
    <Section style={{ textAlign: 'center', margin: '32px 0' }}>
      {showImage && (
        <Img
          src={imageUrl}
          alt="Secure Rise Platform"
          width={280}
          height="auto"
          style={{
            maxWidth: '100%',
            height: 'auto',
            margin: '20px auto',
            display: 'block',
            borderRadius: '12px',
          }}
        />
      )}
      {title && (
        <Text
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#09090b',
            margin: '16px 0 8px 0',
          }}
        >
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          style={{
            fontSize: '14px',
            color: '#71717a',
            margin: '0',
          }}
        >
          {subtitle}
        </Text>
      )}
    </Section>
  );
};
