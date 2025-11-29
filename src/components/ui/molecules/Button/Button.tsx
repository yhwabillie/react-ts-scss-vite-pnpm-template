import React from 'react';
import styles from '@/components/ui/molecules/Button/Button.module.scss';

type BaseProps = {
  variant: 'solid' | 'outline' | 'ghost' | 'soft';
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
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  startSpinner?: React.ReactNode;
  endSpinner?: React.ReactNode;
};

/** <button> 전용 Props */
type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  color,
  size,
  variant,
  shape,
  children,
  startIcon,
  endIcon,
  startSpinner,
  endSpinner,
  ...props
}) => {
  const buttonProps = props as ButtonProps;

  return (
    <button
      className={`${styles['btn']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`} ${`shape--${shape}`}`}
      {...buttonProps}
    >
      {startSpinner && startSpinner}
      {startIcon && startIcon}

      <span className={`${styles['btn-label']}`}>{children}</span>

      {endIcon && endIcon}
      {endSpinner && endSpinner}
    </button>
  );
};

export default Button;
