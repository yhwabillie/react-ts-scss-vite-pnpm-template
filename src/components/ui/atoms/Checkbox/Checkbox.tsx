import React, { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Checkbox/Checkbox.module.scss';

type BaseProps = {
  id?: string;
  name?: string;
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

type CheckboxProps = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, name, color, size, className, ...rest }, ref) => {
    // React에서 id는 truthy/falsey로 처리하는 것이 일반적
    // id?.trim()은 다음 경우 모두 false 처리
    // undefined, null, ''
    const generatedId = id?.trim() ? id : `id-${name}-${Math.random().toString(36).slice(2, 7)}`;
    const generatedName = name?.trim()
      ? id
      : `name-${name}-${Math.random().toString(36).slice(2, 7)}`;

    const [checked, setChecked] = useState(false);
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
      if (pathRef.current) {
        setPathLength(pathRef.current.getTotalLength());
      }
    }, []);

    return (
      <label
        htmlFor={generatedId}
        className={clsx(
          styles['checkbox'],
          styles[`color--${color}`],
          styles[`size--${size}`],
          className,
        )}
      >
        <input
          id={generatedId}
          name={generatedName}
          type='checkbox'
          ref={ref}
          onChange={() => setChecked(!checked)}
          {...rest}
        />
        <svg className={clsx('mark', checked)} viewBox='0 0 16 16'>
          <path
            ref={pathRef}
            d='M4 8L7 11L12 5'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            strokeDasharray={pathLength}
            strokeDashoffset={checked ? 0 : pathLength}
          />
        </svg>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
