import { Section, Text } from '@react-email/components';

interface InfoCardProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  fullWidth?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ 
  label, 
  value, 
  variant = 'default',
  fullWidth = false 
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '16px',
      width: fullWidth ? '100%' : 'auto',
    };

    const variants = {
      default: {
        backgroundColor: '#f4f4f5',
        border: '1px solid #e4e4e7',
      },
      success: {
        backgroundColor: '#22c55e',
        color: '#ffffff',
      },
      danger: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
      },
      warning: {
        backgroundColor: '#f59e0b',
        color: '#09090b',
      },
    };

    return { ...baseStyle, ...variants[variant] };
  };

  const getLabelStyle = () => {
    const baseStyle = {
      textTransform: 'uppercase' as const,
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      opacity: 0.7,
      marginBottom: '4px',
    };

    if (variant === 'success' || variant === 'danger') {
      return { ...baseStyle, opacity: 0.8 };
    }

    return baseStyle;
  };

  const getValueStyle = () => {
    const baseStyle = {
      fontSize: '14px',
      fontWeight: 600,
      margin: 0,
    };

    if (variant === 'success' || variant === 'danger') {
      return { ...baseStyle, color: '#ffffff' };
    }

    return { ...baseStyle, color: '#09090b' };
  };

  return (
    <Section style={getCardStyle()}>
      <Text style={getLabelStyle()}>{label}</Text>
      <Text style={getValueStyle()}>{value}</Text>
    </Section>
  );
};
