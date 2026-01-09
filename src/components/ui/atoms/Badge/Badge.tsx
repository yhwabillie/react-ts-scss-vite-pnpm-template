import Styles from '@/components/ui/atoms/Badge/Badge.module.scss';
import clsx from 'clsx';
import { Children, type ReactNode } from 'react';

interface BadgeProps {
  label?: string;
  variant?: 'solid' | 'outline' | 'dot';
  shape?: 'square' | 'rounded' | 'pill' | 'circle';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  overlapShape?: 'square' | 'rounded' | 'pill'; // children의 모양 정보
  children?: ReactNode;
}

const Badge = ({
  variant = 'solid',
  shape = 'rounded',
  color = 'primary',
  size = 'md',
  ariaLabel,
  label,
  position = 'top-right',
  overlapShape = 'rounded',
  children,
}: BadgeProps) => {
  // children이 실제로 유효한 요소인지 체크
  const hasChildren = Children.count(children) > 0;

  const BadgeElement = (
    <div
      className={clsx(
        `${Styles['badge']} variant--${variant} size--${size} color--${color} ${variant !== 'dot' ? `shape--${shape}` : ''}`,
        overlapShape && `overlap-shape--${overlapShape}`,
        position && `position--${position}`,
      )}
      aria-label={ariaLabel}
    >
      <span className={clsx('badge__label', variant === 'dot' && 'sr-only')}>{label}</span>
    </div>
  );

  // 조건부 렌더링
  if (!hasChildren) {
    return BadgeElement;
  }

  return (
    <div className={Styles['badge-wrapper']}>
      {children}
      {BadgeElement}
    </div>
  );
};

export default Badge;
