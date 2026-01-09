import { useId } from 'react';
import styles from './SegmentedControl.module.scss';
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
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rounded' | 'pill';
  className?: string;
  disabled?: boolean;
}

const SegmentedControl = ({
  options,
  selectedValue,
  onChange,
  name,
  title,
  color = 'primary',
  size = 'md',
  shape = 'rounded',
  className,
  disabled,
  ...rest
}: SegmentedControlProps) => {
  const baseId = useId();

  // 현재 선택된 인덱스 계산 (indicator 이동 및 checked 동기화용)
  const currentIndex = options.findIndex(o => o.value === selectedValue);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else {
      return;
    }
    e.preventDefault();
    onChange(options[nextIndex].value);
  };

  return (
    <div
      className={clsx(
        `${styles['segmented-control']} color--${color} shape--${shape} size--${size}`,
        className,
      )}
      role='radiogroup'
      // name(영어변수명) 대신 title(한국어설명)을 우선 사용하여 접근성 향상
      aria-label={title ? `${title} 선택` : '항목 선택'}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      {/* 배경 슬라이더: currentIndex 기반으로 정확히 동기화 */}
      <div
        className='segmented-indicator'
        style={{
          // (전체 100% - 좌우거터합) / 개수
          width: `calc((100% - (var(--slider-gutter) * 2)) / ${options.length})`,
          // 정확히 100%씩 이동 (아이템들이 정확히 1/N 너비를 가질 때 가장 정확함)
          transform: `translateX(${currentIndex * 100}%)`,
        }}
        aria-hidden='true' // 시각적 장식 요소임을 명시
      />

      {options.map((option, index) => {
        const id = `${baseId}-${index}`;
        const isChecked = selectedValue === option.value;

        return (
          <div key={option.value} className='segmented-item'>
            <input
              tabIndex={-1}
              type='radio'
              id={id}
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={e => {
                // 💡 실제 input 요소가 가진 value를 로그로 출력
                console.log('선택된 Value:', e.target.value);

                // 부모의 onChange 호출
                onChange(e.target.value);
              }}
              className='native-segmented-input'
              disabled={disabled}
              {...rest}
            />
            <label htmlFor={id} className={clsx('segmented-label', isChecked && 'is-active')}>
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
