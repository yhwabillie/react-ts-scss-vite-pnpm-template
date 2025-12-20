import React, { useState, useRef, useEffect, type HTMLAttributes, isValidElement } from 'react';
import Styles from '@/components/ui/atoms/Tooltip/Tooltip.module.scss';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  variant?: 'simple' | 'rich';
  id: string;
  // ✅ [UPDATE] 위치 지정을 위한 Props 추가
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right';
}

type Position = 'top' | 'bottom' | 'left' | 'right';

const Tooltip = ({
  children,
  content,
  variant = 'simple',
  id,
  preferredPosition, // ✅ [UPDATE] 구조 분해 할당 추가
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [position, setPosition] = useState<Position>('top');

  const targetRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // ✅ [UPDATE] 최종 위치를 결정할 변수 (사용자 지정값 우선, 없으면 자동 계산)
    let calculatedPos: Position = preferredPosition || 'top';

    // ✅ [UPDATE] 자동 계산 모드 (preferredPosition이 없을 때만 수행)
    if (!preferredPosition) {
      if (targetRect.top < tooltipRect.height + 20) {
        calculatedPos = 'bottom';
      } else {
        calculatedPos = 'top';
      }
    }

    let newTop = 0;
    let newLeft = 0;

    // ✅ [UPDATE] 결정된 방향에 따른 좌표 계산 로직 체계화
    if (calculatedPos === 'top' || calculatedPos === 'bottom') {
      newTop =
        calculatedPos === 'top'
          ? targetRect.top + scrollY - tooltipRect.height - 10
          : targetRect.bottom + scrollY + 10;
      newLeft = targetRect.left + scrollX + targetRect.width / 2 - tooltipRect.width / 2;

      // 좌우 이탈 방지 (상하 모드일 때만 적용)
      if (newLeft < 10) newLeft = 10;
      if (newLeft + tooltipRect.width > window.innerWidth - 10) {
        newLeft = window.innerWidth - tooltipRect.width - 10;
      }
    } else {
      // 좌우 모드 (left, right)
      newTop = targetRect.top + scrollY + targetRect.height / 2 - tooltipRect.height / 2;
      newLeft =
        calculatedPos === 'left'
          ? targetRect.left + scrollX - tooltipRect.width - 10
          : targetRect.right + scrollX + 10;
    }

    setCoords({ top: newTop, left: newLeft });
    setPosition(calculatedPos); // ✅ [UPDATE] 결정된 최종 방향 상태 업데이트
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      // ✅ [UPDATE] 접근성: ESC 키 누르면 툴팁 닫기
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsVisible(false);
      };
      window.addEventListener('keydown', handleEsc);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isVisible, preferredPosition]); // ✅ [UPDATE] 의존성 배열에 preferredPosition 추가

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const trigger = React.cloneElement(
    children as React.ReactElement,
    {
      ref: targetRef,
      onMouseEnter: () => setIsVisible(true),
      onMouseLeave: () => setIsVisible(false),
      onFocus: () => setIsVisible(true),
      onBlur: () => setIsVisible(false),
      'aria-describedby': isVisible ? id : undefined,
    } as HTMLAttributes<HTMLElement>,
  );

  return (
    <>
      {trigger}
      {isVisible &&
        createPortal(
          <div
            id={id}
            role='tooltip'
            ref={tooltipRef}
            className={`${Styles.tooltip} ${Styles[position]} ${Styles[variant]}`}
            style={{
              top: coords.top,
              left: coords.left,
              position: 'absolute', // ✅ [UPDATE] Portal 사용 시 명시적 위치 지정
              zIndex: 9999,
            }}
          >
            {content}
            <span className={Styles.arrow} aria-hidden='true' />
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
