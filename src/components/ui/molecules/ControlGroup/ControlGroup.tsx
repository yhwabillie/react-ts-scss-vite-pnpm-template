import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/ControlGroup/ControlGroup.module.scss';

type BaseProps = {
  role?: 'group' | 'toolbar';
  ariaLabel?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
};

type ControlGroupProps = BaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const ControlGroup = forwardRef<HTMLDivElement, ControlGroupProps>(
  ({ role = 'group', ariaLabel, size = 'md', children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(`${styles['control-group']} ${`size--${size}`}`, className)}
        role={role}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ControlGroup.displayName = 'ControlGroup';

export default ControlGroup;
