import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/FormField/FormField.module.scss';

type BaseProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: React.ElementType; // 최상위 태그 변경 가능
  htmlFor?: string; // label일 경우 적용 가능
};

type FormFieldProps = BaseProps & Omit<React.HTMLAttributes<HTMLElement>, keyof BaseProps>;

const FormField = forwardRef<HTMLElement, FormFieldProps>(
  ({ size, className, as: Component = 'div', htmlFor, children, ...rest }, ref) => {
    // label일 경우에만 htmlFor 적용
    const labelProps = Component === 'label' && htmlFor ? { htmlFor } : {};

    return (
      <Component
        ref={ref}
        className={clsx(`${styles['formfield']} ${`size--${size}`}`, className)}
        {...labelProps}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
