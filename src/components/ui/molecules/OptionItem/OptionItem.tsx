import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionItem/OptionItem.module.scss';

type BaseProps = {
  variant: 'solid' | 'soft' | 'ghost';
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
};

type OptionItemProps = BaseProps & Omit<React.LiHTMLAttributes<HTMLLIElement>, keyof BaseProps>;

const OptionItem = forwardRef<HTMLLIElement, OptionItemProps>(
  ({ variant, color, size, className, children, ...rest }, ref) => {
    return (
      <li
        ref={ref}
        role='option'
        className={clsx(
          `${styles['option-item']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`}`,
          className,
        )}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

OptionItem.displayName = 'OptionItem';

export default OptionItem;
