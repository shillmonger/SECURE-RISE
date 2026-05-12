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
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    margin: '24px 0',
  } as const;

  const itemStyle = {
    flex: columns === 2 ? '1 1 calc(50% - 8px)' : '1 1 100%',
    minWidth: '0',
  } as const;

  return (
    <Section style={gridStyle} className="mobile-grid">
      {items.map((item, index) => (
        <div key={index} style={itemStyle}>
          <InfoCard
            label={item.label}
            value={item.value}
            variant={item.variant}
            fullWidth={columns === 1}
          />
        </div>
      ))}
    </Section>
  );
};
