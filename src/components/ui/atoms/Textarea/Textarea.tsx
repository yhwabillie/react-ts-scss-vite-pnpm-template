import React, { forwardRef, useState } from 'react';
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
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps> & {
    showCount?: boolean; // 글자 수 표시 여부
    maxLength?: number; // 최대 글자 수
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, color, showCount, maxLength, onChange, value, defaultValue, ...rest },
    ref,
  ) => {
    // 초기값 설정 (제어 컴포넌트 value 또는 비제어 컴포넌트 defaultValue 대응)
    const [currentLength, setCurrentLength] = useState(String(value ?? defaultValue ?? '').length);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentLength(e.target.value.length);
      if (onChange) onChange(e); // 부모의 onChange 호출
    };

    return (
      <div
        className={clsx(
          `${styles['textarea']} ${`variant--${variant}`} ${`color--${color}`}`,
          className,
        )}
      >
        <textarea
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          {...rest}
        />

        {showCount && maxLength && (
          <div
            className={styles['textarea-counter']}
            aria-live='polite' // 글자 수가 바뀔 때마다 스크린 리더가 읽어줌
          >
            <span
              className={clsx(
                styles['current'],
                currentLength >= maxLength && styles['is-max'], // 최대치 도달 시 강조
              )}
            >
              {currentLength}
            </span>
            <span className={styles['separator']}>/</span>
            <span className={styles['total']}>{maxLength}</span>
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
