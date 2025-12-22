import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Label/Label.module.scss';

type BaseProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

type LabelProps = BaseProps & Omit<React.HTMLAttributes<HTMLSpanElement>, keyof BaseProps>;

const Label = forwardRef<HTMLSpanElement, LabelProps>(
  ({ size = 'md', className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(`${styles['label']} ${`size--${size}`}`, className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

Label.displayName = 'Label';

export default Label;
