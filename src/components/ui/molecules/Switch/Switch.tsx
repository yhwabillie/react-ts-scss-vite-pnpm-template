import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/Switch/Switch.module.scss';
import Icon from '../../atoms/Icon/Icon';

type BaseProps = {
  id?: string;
  name: string;
  value?: boolean; // 제어용 Props
  defaultChecked?: boolean; // 비제어 Props
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // 전달받은 핸들러
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  labelPlacement?: 'start' | 'end';
  children?: React.ReactNode;
};

type SwitchProps = BaseProps & Omit<React.HTMLAttributes<HTMLLabelElement>, keyof BaseProps>;

const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (
    {
      id,
      name,
      value,
      defaultChecked,
      onChange,
      disabled,
      color = 'primary',
      size = 'md',
      className,
      labelPlacement = 'end',
      children,
    },
    ref,
  ) => {
    // 내부 상태 관리 (비제어용)
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

    // 현재 상태 결정 (제어 프롭인 value가 있으면 우선, 없으면 내부 상태 사용)
    const isChecked = value !== undefined ? value : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      // 비제어 모드일 때 내부 상태 업데이트
      if (value === undefined) {
        setInternalChecked(e.target.checked);
      }

      // 외부에서 넘겨준 onChange 콜백 실행
      onChange?.(e);
    };

    return (
      <label
        ref={ref}
        className={clsx(`${styles['switch']} ${`color--${color}`} ${`size--${size}`}`, className)}
        htmlFor={id}
        aria-label={isChecked ? '체크 됨' : '체크 해제'}
      >
        <input
          type='checkbox'
          id={id}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          name={name}
        />

        <div className={clsx(`label`, labelPlacement === 'end' ? 'is-end' : 'is-start')}>
          <span className='track'>
            <span className='handle'>
              <Icon
                name={isChecked ? 'check' : 'x'}
                className='icon'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.5}
              />
            </span>
          </span>
          {children}
        </div>
      </label>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
