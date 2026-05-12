import { Button } from '@react-email/components';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  fullWidth?: boolean;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ 
  href, 
  children, 
  variant = 'primary',
  fullWidth = false 
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      display: 'block',
      padding: '16px 32px',
      textDecoration: 'none',
      borderRadius: '12px',
      fontWeight: 600,
      fontSize: '15px',
      textAlign: 'center' as const,
      width: fullWidth ? '100%' : '50%',
      margin: fullWidth ? '32px 0' : '32px auto',
    };

    const variants = {
      primary: {
        backgroundColor: '#09090b',
        color: '#ffffff',
      },
      secondary: {
        backgroundColor: '#f4f4f5',
        color: '#09090b',
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

  return (
    <Button href={href} style={getButtonStyle()}>
      {children}
    </Button>
  );
};
