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
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; // 💡 추가
  thumbProps?: React.HTMLAttributes<HTMLDivElement>; // 💡 추가
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

  // 💡 공통 값 업데이트 로직 (범위 제한 및 Step 적용)
  const updateValue = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);

    // 💡 소수점 오차 해결 로직
    // 1. step이 몇 번째 소수점 자리까지 있는지 계산 (예: 0.1 -> 1, 0.01 -> 2)
    const stepString = step.toString();
    const decimalPlaces = stepString.includes('.') ? stepString.split('.')[1].length : 0;

    // 2. step 단위로 나누고 반올림한 뒤 다시 곱함
    // 3. toFixed를 사용해 부동 소수점 오차를 완전히 제거 후 숫자로 변환
    const steppedValue = Number((Math.round(clampedValue / step) * step).toFixed(decimalPlaces));

    if (steppedValue !== currentValue) {
      setInternalValue(steppedValue);
      onChange?.(steppedValue);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateValue(Number(e.target.value));
  };

  // 💡 키보드 접근성 핸들러
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
      {/* 웹 접근성: 화면에는 보이지 않지만 스크린 리더가 참조할 레이블 */}
      <label id={`${id}-label`} className='sr-only'>
        {label}
      </label>

      <div
        className={clsx(
          'input-wrapper',
          thumbProps?.className === 'pseudo-hover' && thumbProps.className,
        )}
      >
        {/* 1. 마우스/터치 조작용 Native Input (투명) */}
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

        {/* 2. 시각적 트랙 */}
        <div className='track'>
          <div className='fill' style={{ width: `${percentage}%` }} />
        </div>

        {/* 3. 조작 주체인 커스텀 Thumb */}
        <div
          {...thumbProps}
          role='slider' // 슬라이더 역할 명시
          tabIndex={0} // 키보드 포커스 허용
          aria-labelledby={`${id}-label`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          onKeyDown={handleKeyDown} // 화살표 키 조작 연결
          className={clsx('thumb', thumbProps?.className)}
          style={{
            left: `calc(${percentage}% + ${correctionRem})`,
          }}
        >
          {/* 값 표시 툴팁 */}
          <span className='tooltip'>{currentValue}</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
