import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionList/OptionList.module.scss';

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
};

type OptionListProps = BaseProps & Omit<React.HTMLAttributes<HTMLUListElement>, keyof BaseProps>;

const OptionList = forwardRef<HTMLUListElement, OptionListProps>(
  ({ variant, color, size, className, children, ...rest }, ref) => {
    return (
      <ul
        ref={ref}
        role='listbox'
        className={clsx(
          `${styles['option-list']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`}`,
          className,
        )}
        {...rest}
      >
        {children}
      </ul>
    );
  },
);

OptionList.displayName = 'OptionList';

export default OptionList;
