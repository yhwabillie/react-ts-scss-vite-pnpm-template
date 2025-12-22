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
  fullWidth?: boolean;
  className?: string;
};

/** <a> 전용 Props */
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LinkButtonProps = AnchorProps;

const LinkButton: React.FC<LinkButtonProps> = ({
  color = 'primary',
  size = 'md',
  variant = 'link',
  shape = 'rounded',
  children,
  startIcon,
  endIcon,
  fullWidth,
  className,
  ...props
}) => {
  const anchorProps = props as AnchorProps;

  return (
    <a
      className={clsx(
        `${styles['btn']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`} ${`shape--${shape}`}`,
        fullWidth && 'is-full',
        className,
      )}
      {...anchorProps}
    >
      {startIcon && startIcon}

      <span className={`${styles['btn-label']}`}>{children}</span>

      {endIcon && endIcon}
    </a>
  );
};

export default LinkButton;
