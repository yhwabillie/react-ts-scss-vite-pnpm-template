import React, { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Checkbox/Checkbox.module.scss';

type BaseProps = {
  id?: string;
  name?: string;
  htmlFor?: string;
  checked?: boolean; // 제어용 Props
  defaultChecked?: boolean; // 비제어 Props
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // 전달받은 핸들러
  disabled?: boolean;
  as?: React.ElementType;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

type CheckboxProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseProps>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      htmlFor,
      checked: controlledChecked,
      defaultChecked,
      onChange,
      disabled,
      as: Component = 'label',
      color = 'primary',
      size = 'md',
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = id?.trim() ? id : `checkbox-${Math.random().toString(36).slice(2, 7)}`;

    // 내부 상태 관리 (비제어용)
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

    // 현재 상태 결정 (제어 프롭이 있으면 우선, 없으면 내부 상태 사용)
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
      if (pathRef.current) {
        setPathLength(pathRef.current.getTotalLength());
      }
    }, []);

    // 변경 핸들러 병합
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      // 비제어 모드일 때만 내부 상태 업데이트
      if (controlledChecked === undefined) {
        setInternalChecked(e.target.checked);
      }

      // 외부에서 전달받은 onChange 실행
      onChange?.(e);
    };

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
          checked={controlledChecked} // 제어 모드 대응
          defaultChecked={defaultChecked} // 비제어 모드 대응
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        <svg className={clsx('mark', isChecked)} viewBox='0 0 16 16' aria-hidden>
          <path
            ref={pathRef}
            d='M4 8L7 11L12 5'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            strokeDasharray={pathLength}
            strokeDashoffset={isChecked ? 0 : pathLength}
          />
        </svg>
      </Component>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
