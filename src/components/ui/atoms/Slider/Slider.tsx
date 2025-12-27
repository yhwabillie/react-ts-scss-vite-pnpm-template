import React, { useState, useRef, useEffect, useCallback } from 'react';
import Styles from '@/components/ui/atoms/Slider/Slider.module.scss';

export interface SliderProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

const Slider = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 0,
  onChange,
}: SliderProps) => {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // 값을 업데이트하고 부모에게 알리는 공통 함수
  const updateValue = useCallback(
    (newValue: number) => {
      const clampedValue = Math.min(Math.max(newValue, min), max);
      // step 단위로 값 보정 (자석 효과)
      const steppedValue = Math.round(clampedValue / step) * step;
      setValue(steppedValue);
      onChange?.(steppedValue);
    },
    [min, max, step, onChange],
  );

  // 마우스 위치를 기반으로 값을 계산하는 함수
  const handleMove = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = (clientX - rect.left) / rect.width;
      const newValue = percentage * (max - min) + min;
      updateValue(newValue);
    },
    [max, min, updateValue],
  );

  // 드래그 로직 (Window 이벤트 리스너 활용)
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleMove(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // 키보드 조작 핸들러 (웹 접근성 필수)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        updateValue(value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        updateValue(value - step);
        break;
      case 'Home':
        e.preventDefault();
        updateValue(min);
        break;
      case 'End':
        e.preventDefault();
        updateValue(max);
        break;
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={Styles.sliderContainer}>
      <label id='slider-label' className={Styles.label}>
        {label}
      </label>

      <div
        ref={trackRef}
        className={Styles.track}
        onMouseDown={onMouseDown} // 클릭 시 이동 및 드래그 시작
      >
        <div className={Styles.fill} style={{ width: `${percentage}%` }} />

        <div
          className={`${Styles.thumb} ${isDragging ? Styles.active : ''}`}
          style={{ left: `${percentage}%` }}
          role='slider'
          tabIndex={0}
          aria-labelledby='slider-label'
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={handleKeyDown}
        >
          <span className={Styles.tooltip}>{value}</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
