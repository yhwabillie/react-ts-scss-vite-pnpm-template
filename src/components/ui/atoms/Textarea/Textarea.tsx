import React, { forwardRef, useEffect, useId, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/atoms/Textarea/Textarea.module.scss';

type BaseProps = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showCount?: boolean;
  className?: string;
  maxLength?: number;
};

type TextareaProps = BaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps> & {
    showCount?: boolean; // 글자 수 표시 여부
    maxLength?: number; // 최대 글자 수
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      onChange,
      disabled,
      readOnly,
      variant = 'solid',
      color = 'primary',
      size = 'md',
      showCount = false,
      className,
      maxLength,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    // 내부 상태는 defaultValue가 있을 때만 사용하고, value가 있으면 value를 우선시합니다.
    const [currentLength, setCurrentLength] = useState(() => {
      return String(value ?? defaultValue ?? '').length;
    });

    // 제어 컴포넌트 대응: 외부에서 value가 주입되어 변경될 때 길이를 동기화합니다.
    useEffect(() => {
      if (value !== undefined) {
        setCurrentLength(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let val = e.target.value;

      // 1. 브라우저가 허용하더라도 JS 레벨에서 강제로 잘라냄 (물리적 차단)
      if (maxLength !== undefined && val.length > maxLength) {
        val = val.substring(0, maxLength);
        e.target.value = val; // 실제 DOM의 값을 강제로 되돌림
      }

      setCurrentLength(val.length);
      if (onChange) onChange(e);
    };

    // 가독성을 위해 변수로 추출
    const isMaxLengthReached = maxLength !== undefined && currentLength >= maxLength;

    return (
      <div
        className={clsx(
          `${styles['textarea']} ${`variant--${variant}`} ${`color--${isMaxLengthReached ? 'danger' : color}`} ${`size--${size}`}`,
          className,
        )}
      >
        <textarea
          ref={ref}
          id={textareaId} // id 연결
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={disabled}
          // className={clsx(className?.includes('pseudo-hover') && className)}
          {...rest}
        />

        {showCount && maxLength !== undefined && (
          <div
            className={clsx(styles['textarea-counter'], isMaxLengthReached && 'is-max')}
            aria-live='polite'
          >
            <span className={clsx(styles['current'])}>{currentLength}</span>
            <span className={styles['separator']}> / </span>
            <span className={styles['total']}>{maxLength}</span>
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
