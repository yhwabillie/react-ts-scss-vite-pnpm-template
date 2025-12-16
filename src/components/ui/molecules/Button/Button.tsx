import React, { forwardRef } from 'react';
import styles from '@/components/ui/molecules/Button/Button.module.scss';
import clsx from 'clsx';

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
  className?: string;
};

/** <button> 전용 Props */
type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color,
      size,
      variant,
      shape,
      children,
      startIcon,
      endIcon,
      startSpinner,
      endSpinner,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          `${styles['btn']} variant--${variant} color--${color} size--${size} shape--${shape}`,
          className,
        )}
        {...props}
      >
        {startSpinner}
        {startIcon}

        <span className={styles['btn-label']}>{children}</span>

        {endIcon}
        {endSpinner}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
