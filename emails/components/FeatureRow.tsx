import { Section, Text } from '@react-email/components';

interface FeatureRowProps {
  icon?: string;
  title: string;
  description: string;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({ 
  icon = '✓', 
  title, 
  description 
}) => {
  return (
    <Section
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        margin: '16px 0',
        padding: '16px',
        border: '1px solid #f4f4f5',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          backgroundColor: '#09090b',
          color: 'white',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '20px',
          fontSize: '12px',
          marginRight: '12px',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: 600,
            margin: '0 0 4px 0',
            color: '#09090b',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: '14px',
            color: '#71717a',
            margin: 0,
          }}
        >
          {description}
        </Text>
      </div>
    </Section>
  );
};
