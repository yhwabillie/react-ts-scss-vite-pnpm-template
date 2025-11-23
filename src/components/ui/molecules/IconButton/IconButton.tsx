import React from 'react';
import styles from '@/components/ui/molecules/IconButton/IconButton.module.scss';

type BaseProps = {
  variant: 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape: 'rounded' | 'square' | 'pill';
  icon: React.ReactNode;
};

/** <button> 전용 Props */
type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton: React.FC<ButtonProps> = ({ color, size, variant, shape, icon, ...props }) => {
  const buttonProps = props as ButtonProps;

  return (
    <button
      className={`${styles['btn']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`} ${`shape--${shape}`}`}
      {...buttonProps}
    >
      {icon && icon}
    </button>
  );
};

export default IconButton;
