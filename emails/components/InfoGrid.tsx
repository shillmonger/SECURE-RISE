import { Section } from '@react-email/components';
import { InfoCard } from './InfoCard';

interface InfoGridProps {
  items: Array<{
    label: string;
    value: string | number;
    variant?: 'default' | 'success' | 'danger' | 'warning';
  }>;
  columns?: 1 | 2;
}

export const InfoGrid: React.FC<InfoGridProps> = ({ 
  items, 
  columns = 2 
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: columns === 2 ? '1fr 1fr' : '1fr',
    gap: '16px',
    margin: '24px 0',
  };

  return (
    <Section style={gridStyle} className="mobile-grid">
      {items.map((item, index) => (
        <InfoCard
          key={index}
          label={item.label}
          value={item.value}
          variant={item.variant}
        />
      ))}
    </Section>
  );
};
