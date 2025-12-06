import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Input/Input.module.scss';

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
  type: 'text' | 'number' | 'email';
  className?: string;
  as?: React.ElementType;
  adornedStart?: React.ReactNode;
  adornedEnd?: React.ReactNode;
};

type InputProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant,
      shape,
      color,
      size,
      type,
      id,
      as: Component = 'label',
      className,
      adornedStart,
      adornedEnd,
      ...rest
    },
    ref,
  ) => {
    const [value, setValue] = useState('');

    return (
      <Component
        {...(Component === 'label' ? { htmlFor: id } : {})}
        className={clsx(
          `${styles['input']} ${`variant--${variant}`} ${`shape--${shape}`} ${`color--${color}`} ${`size--${size}`}`,
          className,
        )}
      >
        {adornedStart && adornedStart}

        <input id={id} type={type} ref={ref} onChange={e => setValue(e.target.value)} {...rest} />

        {adornedEnd && adornedEnd}
      </Component>
    );
  },
);

Input.displayName = 'Input';

export default Input;
