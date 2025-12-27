import styles from '@/components/ui/molecules/ColorChip/ColorChip.module.scss';

interface ColorItemProps {
  title: string;
  subtitle?: string;
  colors: Record<string, string>;
}

export const ColorItem = ({ title, subtitle, colors }: ColorItemProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <strong className={styles.title}>{title}</strong>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div className={styles.grid}>
        {Object.entries(colors).map(([name, value]) => (
          <div key={name} className={styles.chipWrapper}>
            <div className={styles.chip} style={{ backgroundColor: value }} title={value} />
            <div className={styles.name}>{name}</div>
            <div className={styles.value}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
