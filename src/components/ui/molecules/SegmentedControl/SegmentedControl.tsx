import { useId } from 'react';
import Styles from './SegmentedControl.module.scss';
import clsx from 'clsx';

interface SegmentOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
  title?: string; // 접근성 지침을 위해 사용자가 읽기 쉬운 한글 제목 권장
}

const SegmentedControl = ({
  options,
  selectedValue,
  onChange,
  name,
  title,
}: SegmentedControlProps) => {
  const baseId = useId();

  // 현재 선택된 인덱스 계산 (indicator 이동 및 checked 동기화용)
  const currentIndex = options.findIndex(o => o.value === selectedValue);

  return (
    <div
      className={Styles['segment-container']}
      role='radiogroup'
      // name(영어변수명) 대신 title(한국어설명)을 우선 사용하여 접근성 향상
      aria-label={title ? `${title} 선택` : '항목 선택'}
    >
      {/* 배경 슬라이더: currentIndex 기반으로 정확히 동기화 */}
      <div
        className={Styles['segment-indicator']}
        style={{
          width: `${100 / options.length}%`,
          transform: `translateX(${currentIndex * 100}%)`,
        }}
        aria-hidden='true' // 시각적 장식 요소임을 명시
      />

      {options.map((option, index) => {
        const id = `${baseId}-${index}`;
        const isChecked = selectedValue === option.value;

        return (
          <div key={option.value} className={Styles['segment-item']}>
            <input
              type='radio'
              id={id}
              name={name}
              value={option.value}
              // checked와 isChecked(active 클래스 조건)가 완벽히 일치해야 함
              checked={isChecked}
              onChange={() => onChange(option.value)}
              className={Styles['segment-input']}
            />
            <label
              htmlFor={id}
              className={clsx(Styles['segment-label'], isChecked && Styles['active'])}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
