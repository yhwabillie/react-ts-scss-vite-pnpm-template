import React, { useState, useEffect, useId, type ChangeEvent, type KeyboardEvent } from 'react';
import styles from './Slider.module.scss';
import clsx from 'clsx';

export interface SliderProps {
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  thumbProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Slider = ({
  color = 'primary',
  size = 'md',
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 0,
  value: controlledValue,
  onChange,
  className,
  inputProps,
  thumbProps,
}: SliderProps) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (controlledValue !== undefined) setInternalValue(controlledValue);
  }, [controlledValue]);

  // Clamp 범위 + step 정렬 후 값 업데이트
  const updateValue = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);

    // step의 소수 자릿수 기준으로 반올림하여 부동소수 오차 제거
    const stepString = step.toString();
    const decimalPlaces = stepString.includes('.') ? stepString.split('.')[1].length : 0;

    const steppedValue = Number((Math.round(clampedValue / step) * step).toFixed(decimalPlaces));

    if (steppedValue !== currentValue) {
      setInternalValue(steppedValue);
      onChange?.(steppedValue);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateValue(Number(e.target.value));
  };

  // 키보드 접근성: 방향키/홈/엔드로 값 이동
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        updateValue(currentValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        updateValue(currentValue - step);
        break;
      case 'Home':
        e.preventDefault();
        updateValue(min);
        break;
      case 'End':
        e.preventDefault();
        updateValue(max);
        break;
      default:
        break;
    }
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;

  const thumbSizeMap = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };

  const currentThumbSize = thumbSizeMap[size as keyof typeof thumbSizeMap] || 16;
  const radius = currentThumbSize / 2;
  const correction = radius - percentage * (currentThumbSize / 100);
  const correctionRem = `${correction / 16}rem`;

  return (
    <div className={clsx(styles['slider'], `color--${color}`, `size--${size}`, className)}>
      {/* 스크린 리더용 라벨 */}
      <label id={`${id}-label`} className='sr-only'>
        {label}
      </label>

      <div
        className={clsx(
          'input-wrapper',
          thumbProps?.className === 'pseudo-hover' && thumbProps.className,
        )}
      >
        {/* 마우스/터치 입력용 native range */}
        <input
          id={id}
          type='range'
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className={clsx('native-range-input', inputProps?.className)}
          tabIndex={-1} // 포커스는 Thumb으로 양보
          aria-hidden='true'
          disabled={inputProps?.disabled}
        />

        {/* 트랙 */}
        <div className='track'>
          <div className='fill' style={{ width: `${percentage}%` }} />
        </div>

        {/* 커스텀 thumb (키보드 조작 포커스) */}
        <div
          {...thumbProps}
          role='slider'
          tabIndex={0}
          aria-labelledby={`${id}-label`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          onKeyDown={handleKeyDown}
          className={clsx('thumb', thumbProps?.className)}
          style={{
            left: `calc(${percentage}% + ${correctionRem})`,
          }}
        >
          {/* 현재 값 표시 */}
          <span className='tooltip'>{currentValue}</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
