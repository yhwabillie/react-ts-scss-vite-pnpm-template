import React, { forwardRef, type CSSProperties } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/FormFieldset/FormFieldset.module.scss';

type BaseProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  legend: string;
  direction?: 'column' | 'row';
  required?: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
};

type FormFieldsetProps = BaseProps &
  Omit<React.HTMLAttributes<HTMLFieldSetElement>, keyof BaseProps>;

const FormFieldset = forwardRef<HTMLFieldSetElement, FormFieldsetProps>(
  ({ size = 'md', legend, direction = 'row', required, className, style, children }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={clsx(
          `${styles['form-fieldset']} ${`size--${size}`} ${`direction--${direction}`}`,
          className,
        )}
        style={style}
      >
        <legend className='legend'>
          {legend}

          {required && (
            <>
              <span className='requried' aria-hidden>
                *
              </span>
              <span className='sr-only'>필수 항목</span>
            </>
          )}
        </legend>
        {children}
      </fieldset>
    );
  },
);

FormFieldset.displayName = 'FormFieldset';

export default FormFieldset;
