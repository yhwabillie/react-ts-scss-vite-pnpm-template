import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/ButtonGroup/ButtonGroup.module.scss';

type BaseProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align: 'left' | 'center' | 'right';
  role?: 'group' | 'toolbar';
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
};

type ButtonGroupProps = BaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ size, className, align, role, ariaLabel, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['button-group']} ${`size--${size}`} ${`align--${align}`}`,
          className,
        )}
        role={role}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
