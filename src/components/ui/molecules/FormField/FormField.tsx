import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/FormField/FormField.module.scss';

type BaseProps = {
  id?: string;
  htmlFor?: string;
  as?: React.ElementType;
  required?: boolean;
  direction?: 'column' | 'row';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  labelText?: string; // label일 경우 텍스트
  children?: React.ReactNode;
  className?: string;
};

type FormFieldProps = BaseProps & Omit<React.HTMLAttributes<HTMLElement>, keyof BaseProps>;

const FormField = forwardRef<HTMLElement, FormFieldProps>(
  (
    {
      id,
      htmlFor,
      as: Component = 'div',
      required,
      direction = 'row',
      size = 'md',
      labelText,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    // label일 경우에만 htmlFor 적용
    const labelProps = Component === 'label' && htmlFor ? { htmlFor } : {};

    return (
      <Component
        ref={ref}
        className={clsx(
          `${styles['formfield']} ${`size--${size}`} ${`direction--${direction}`}`,
          className,
        )}
        {...labelProps}
        {...rest}
      >
        {Component == 'div' && (
          <label id={id} htmlFor={htmlFor} className='label'>
            {labelText}
            {required && (
              <>
                <span className='requried' aria-hidden='true'>
                  *
                </span>
                <span className='sr-only'>필수 항목</span>
              </>
            )}
          </label>
        )}

        {children}
      </Component>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
