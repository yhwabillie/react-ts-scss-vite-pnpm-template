import React from 'react';
import styles from '@/components/ui/molecules/Button/Button.module.scss';
import clsx from 'clsx';

type BaseProps = {
  variant?: 'link';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rounded';
  children?: React.ReactNode;

  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  /** DOM으로 내려가면 안 되는 커스텀 슬롯 */
  startSpinner?: React.ReactNode;
  endSpinner?: React.ReactNode;

  fullWidth?: boolean;
  className?: string;
};

/** <a> 전용 Props */
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LinkButtonProps = BaseProps & AnchorProps;

const LinkButton: React.FC<LinkButtonProps> = ({
  color = 'primary',
  size = 'md',
  variant = 'link',
  shape = 'rounded',
  children,

  startIcon,
  endIcon,
  startSpinner,
  endSpinner,

  fullWidth,
  className,

  // 커스텀 props는 위에서 구조분해로 제거됨 → rest에는 DOM-safe props만 남음
  ...anchorProps
}) => {
  return (
    <a
      className={clsx(
        `${styles['btn']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`} ${`shape--${shape}`}`,
        fullWidth && 'is-full',
        className,
      )}
      {...anchorProps}
    >
      {startSpinner}
      {startIcon}

      <span className={styles['btn-label']}>{children}</span>

      {endIcon}
      {endSpinner}
    </a>
  );
};

export default LinkButton;
