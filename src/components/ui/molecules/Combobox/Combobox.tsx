import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/Combobox/Combobox.module.scss';
import Input from '../../atoms/Input/Input';
import IconButton from '../IconButton/IconButton';
import Icon from '../../atoms/Icon/Icon';

type BaseProps = {
  variant: 'solid' | 'soft' | 'outline' | 'ghost';
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
  className?: string;
  children: React.ReactNode;
  value?: string;
  required?: boolean;
  disabled?: boolean;
};

type ComboboxProps = BaseProps & Omit<React.HTMLAttributes<HTMLInputElement>, keyof BaseProps>;

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  ({ variant, color, size, className, children, value, required, disabled }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['combobox']} variant--${variant} color--${color} size--${size}`,
          className,
        )}
      >
        <Input
          as='div'
          id='combobox-solid-3'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='md'
          name='combobox-name'
          defaultValue='defaultValue'
          placeholder='아이템 선택.'
          adornedEnd={
            <IconButton
              as='div'
              color='tertiary'
              size='md'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={
                <Icon
                  name='arrow-down'
                  className='icon'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            />
          }
        />
        {children}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';

export default Combobox;
