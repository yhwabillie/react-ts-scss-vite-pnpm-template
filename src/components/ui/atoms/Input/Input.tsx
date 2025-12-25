import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Input/Input.module.scss';

type BaseProps = {
  variant?: 'solid' | 'outline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rounded' | 'square' | 'pill';
  type?: 'text' | 'number' | 'email';
  role?: 'combobox';
  className?: string;
  as?: React.ElementType;
  adornedStart?: React.ReactNode;
  adornedEnd?: React.ReactNode;
};

type InputProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'solid',
      shape = 'rounded',
      color = 'primary',
      size = 'md',
      type = 'text',
      role,
      id,
      as: Component = 'label',
      className,
      adornedStart,
      adornedEnd,
      value, // 부모로부터 value 받기
      onChange, // 부모로부터 onChange 받기
      ...rest
    },
    ref,
  ) => {
    return (
      <Component
        {...(Component === 'label' ? { htmlFor: id } : {})}
        className={clsx(
          `${styles['input']} ${`variant--${variant}`} ${`shape--${shape}`} ${`color--${color}`} ${`size--${size}`}`,
          className,
        )}
      >
        {adornedStart && adornedStart}

        <input
          id={id}
          role={role}
          type={type}
          ref={ref}
          value={value}
          onChange={e => onChange?.(e)}
          {...rest}
        />

        {adornedEnd && adornedEnd}
      </Component>
    );
  },
);

Input.displayName = 'Input';

export default Input;
