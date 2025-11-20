import React from 'react';
import styles from '@/components/ui/molecules/Button/Button.module.scss';

type BaseProps = {
  variant: 'solid' | 'outline' | 'ghost' | 'soft';
  color: 'primary' | 'secondary' | 'tertiary' | 'brand' | 'brand-sub';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape: 'rounded' | 'square' | 'pill';
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

/** <a> 전용 Props */
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LinkButtonProps = AnchorProps;

const LinkButton: React.FC<LinkButtonProps> = ({
  color,
  size,
  variant,
  shape,
  children,
  startIcon,
  endIcon,
  ...props
}) => {
  const anchorProps = props as AnchorProps;

  return (
    <a
      className={`${styles['btn']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`} ${`shape--${shape}`}`}
      {...anchorProps}
    >
      {startIcon && startIcon}

      <span className={`${styles['btn-label']}`}>{children}</span>

      {endIcon && endIcon}
    </a>
  );
};

export default LinkButton;
