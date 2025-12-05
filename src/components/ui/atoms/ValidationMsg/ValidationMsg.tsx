import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/ValidationMsg/ValidationMsg.module.scss';

type BaseProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'error' | 'warning' | 'success' | 'guide';
  className?: string;
  children: React.ReactNode;
};

type ValidationMsgProps = BaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const ValidationMsg = forwardRef<HTMLDivElement, ValidationMsgProps>(
  ({ variant, size, className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['validation-msg']} ${`variant--${variant}`} ${`size--${size}`}`,
          className,
        )}
        role='alert'
        aria-live='assertive'
      >
        {children}
      </div>
    );
  },
);

ValidationMsg.displayName = 'ValidationMsg';

export default ValidationMsg;
