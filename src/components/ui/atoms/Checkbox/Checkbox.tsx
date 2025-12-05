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
  as?: React.ElementType; // 🔹 이렇게 바꿔야 TS가 JSX로 인식
};

type CheckboxProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseProps>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, name, color, size, as: Component = 'label', className, ...rest }, ref) => {
    const generatedId = id?.trim() ? id : `id-${name}-${Math.random().toString(36).slice(2, 7)}`;

    const [checked, setChecked] = useState(false);
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
      if (pathRef.current) {
        setPathLength(pathRef.current.getTotalLength());
      }
    }, []);

    return (
      <Component
        {...(Component === 'label' ? { htmlFor: generatedId } : {})}
        className={clsx(`${styles['checkbox']} ${`color--${color}`} ${`size--${size}`}`, className)}
      >
        <input
          id={generatedId}
          name={name}
          type='checkbox'
          ref={ref}
          onChange={() => setChecked(!checked)}
          {...rest}
        />
        <svg className={clsx('mark', checked)} viewBox='0 0 16 16' aria-hidden>
          <path
            ref={pathRef}
            d='M4 8L7 11L12 5'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            strokeDasharray={pathLength}
            strokeDashoffset={checked ? 0 : pathLength}
          />
        </svg>
      </Component>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
