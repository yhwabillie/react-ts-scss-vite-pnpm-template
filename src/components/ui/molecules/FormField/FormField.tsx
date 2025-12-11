import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/FormField/FormField.module.scss';

type BaseProps = {
  id?: string;
  required?: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: React.ElementType; // 최상위 태그 변경 가능
  htmlFor?: string; // label일 경우 적용 가능
  labelText?: string; // label일 경우 텍스트
  direction: 'column' | 'row';
};

type FormFieldProps = BaseProps & Omit<React.HTMLAttributes<HTMLElement>, keyof BaseProps>;

const FormField = forwardRef<HTMLElement, FormFieldProps>(
  (
    {
      id,
      required,
      size,
      className,
      as: Component = 'div',
      htmlFor,
      labelText,
      direction,
      children,
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
