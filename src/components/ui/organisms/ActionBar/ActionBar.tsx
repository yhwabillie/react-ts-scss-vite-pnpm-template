import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/organisms/ActionBar/ActionBar.module.scss';

type BaseProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  role?: 'group' | 'toolbar';
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
};

type ActionBarProps = BaseProps & Omit<React.HtmlHTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ size, children, role, ariaLabel, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(`${styles['action-bar']} ${`size--${size}`}`, className)}
        role={role}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ActionBar.displayName = 'ActionBar';

export default ActionBar;
