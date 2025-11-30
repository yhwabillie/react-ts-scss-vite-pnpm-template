import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Radio/Radio.module.scss';

type BaseProps = {
  id?: string;
  name: string;
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type RadioProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>;

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ id, name, color, size, className, ...rest }, ref) => {
    // React에서 id는 truthy/falsey로 처리하는 것이 일반적
    // id?.trim()은 다음 경우 모두 false 처리
    // undefined, null, ''
    const generatedId = id?.trim() ? id : `id-${name}-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <label
        htmlFor={generatedId}
        className={clsx(
          styles['radio'],
          styles[`color--${color}`],
          styles[`size--${size}`],
          className,
        )}
      >
        <input id={generatedId} name={name} type='radio' ref={ref} {...rest} />
        <svg className='mark' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <circle cx='8' cy='8' r='4' fill='currentColor' />
        </svg>
      </label>
    );
  },
);

Radio.displayName = 'Radio';

export default Radio;
