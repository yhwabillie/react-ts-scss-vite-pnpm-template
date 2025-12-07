import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Textarea/Textarea.module.scss';

type BaseProps = {
  variant: 'solid' | 'outline' | 'ghost' | 'soft';
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  className?: string;
};

type TextareaProps = BaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, color, ...rest }, ref) => {
    return (
      <div
        className={clsx(
          `${styles['textarea']} ${`variant--${variant}`} ${`color--${color}`}`,
          className,
        )}
      >
        <textarea ref={ref} {...rest} />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
