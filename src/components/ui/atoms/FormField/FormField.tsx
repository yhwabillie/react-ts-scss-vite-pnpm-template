import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/FormField/FormField.module.scss';

type BaseProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

type FormFieldProps = BaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps>;

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ size, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(`${styles['formfield']} ${`size--${size}`}`, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
