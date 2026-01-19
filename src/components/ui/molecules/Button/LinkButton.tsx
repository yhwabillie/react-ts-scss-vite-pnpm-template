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

  startSpinner?: React.ReactNode;
  endSpinner?: React.ReactNode;

  fullWidth?: boolean;
  className?: string;
};

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
