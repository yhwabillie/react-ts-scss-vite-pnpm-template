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
  as?: React.ElementType; // 최상위 태그 변경 가능
  htmlFor?: string; // label일 경우 연결
  className?: string;
};

type RadioProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseProps>;

const Radio = forwardRef<HTMLElement, RadioProps>(
  ({ id, name, color, size, as: Component = 'label', htmlFor, className, ...rest }, ref) => {
    const generatedId = id?.trim() ? id : `id-${name}-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <Component
        ref={ref}
        className={clsx(`${styles['radio']} ${`color--${color}`} ${`size--${size}`}`, className)}
        {...(Component === 'label' ? { htmlFor: htmlFor || generatedId } : {})}
      >
        <input id={generatedId} name={name} type='radio' {...rest} />
        <svg
          className='mark'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden
        >
          <circle cx='8' cy='8' r='4' fill='currentColor' />
        </svg>
      </Component>
    );
  },
);

Radio.displayName = 'Radio';

export default Radio;
