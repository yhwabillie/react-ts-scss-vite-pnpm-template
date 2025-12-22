import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Radio/Radio.module.scss';

type BaseProps = {
  id?: string;
  name: string;
  htmlFor?: string;
  checked?: boolean; // 제어용 Props
  defaultChecked?: boolean; // 비제어 Props
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  as?: React.ElementType;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

type RadioProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseProps>;

const Radio = forwardRef<HTMLElement, RadioProps>(
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
    const generatedId = id?.trim() ? id : `radio-${Math.random().toString(36).slice(2, 7)}`;

    // 내부 상태 관리 (비제어용)
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

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
        ref={ref}
        className={clsx(`${styles['radio']} ${`color--${color}`} ${`size--${size}`}`, className)}
        {...(Component === 'label' ? { htmlFor: htmlFor || generatedId } : {})}
      >
        <input
          id={generatedId}
          name={name}
          type='radio'
          checked={controlledChecked} // 제어 모드 대응
          defaultChecked={defaultChecked} // 비제어 모드 대응
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
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
