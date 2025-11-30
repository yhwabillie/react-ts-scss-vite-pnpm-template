import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Label/Label.module.scss';

type BaseProps = {
  htmlFor: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

type LabelProps = BaseProps & Omit<React.LabelHTMLAttributes<HTMLLabelElement>, keyof BaseProps>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, size = 'md', className, children, ...rest }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={clsx(`${styles['label']} ${`size--${size}`}`, className)}
        {...rest}
      >
        {children}
      </label>
    );
  },
);

Label.displayName = 'Label';

export default Label;
