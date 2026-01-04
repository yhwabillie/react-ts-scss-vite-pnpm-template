import Styles from '@/components/ui/atoms/Badge/Badge.module.scss';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  shape?: 'square' | 'rounded' | 'circle';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  overlap?: boolean;
}

const Badge = ({
  variant = 'solid',
  shape = 'rounded',
  color = 'primary',
  size = 'md',
  ariaLabel,
  children,
}: BadgeProps) => {
  return (
    <div
      className={clsx(
        `${Styles['badge']} variant--${variant} size--${size} color--${color} shape--${shape}`,
      )}
      aria-label={ariaLabel}
    >
      <span className='badge__label'>{children}</span>
    </div>
  );
};

export default Badge;
