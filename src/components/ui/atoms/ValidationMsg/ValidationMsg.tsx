import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/ValidationMsg/ValidationMsg.module.scss';

type BaseProps = {
  variant?: 'danger' | 'warning' | 'success' | 'guide';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  role?: 'alert' | 'status';
  ariaLive?: 'assertive' | 'polite';
  className?: string;
  children: React.ReactNode;
};

type ValidationMsgProps = BaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const ValidationMsg = forwardRef<HTMLDivElement, ValidationMsgProps>(
  ({ variant = 'guide', size = 'md', role, ariaLive, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['validation-msg']} ${`variant--${variant}`} ${`size--${size}`}`,
          className,
        )}
        role={role}
        aria-live={ariaLive}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ValidationMsg.displayName = 'ValidationMsg';

export default ValidationMsg;
