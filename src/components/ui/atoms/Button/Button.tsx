import React from 'react';
import styles from '@/components/ui/atoms/Button/Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'solid' | 'outline' | 'ghost' | 'soft';
  color: 'primary' | 'secondary' | 'tertiary' | 'brand' | 'brand-sub';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape: 'rounded' | 'square' | 'pill';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ color, size, variant, shape, children, ...props }) => {
  return (
    <button
      className={`${styles['btn']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`} ${`shape--${shape}`}`}
      {...props}
    >
      <span className={`${styles['btn-label']}`}>{children}</span>
    </button>
  );
};

export default Button;
