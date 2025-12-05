import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/ControlGroup/ControlGroup.module.scss';

type BaseProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction: 'row' | 'column';
  role?: 'group' | 'toolbar';
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
};

type ControlGroupProps = BaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const ControlGroup = forwardRef<HTMLDivElement, ControlGroupProps>(
  ({ size, direction, className, role, ariaLabel, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['control-group']} ${`size--${size}`} ${`direction--${direction}`}`,
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

ControlGroup.displayName = 'ControlGroup';

export default ControlGroup;
