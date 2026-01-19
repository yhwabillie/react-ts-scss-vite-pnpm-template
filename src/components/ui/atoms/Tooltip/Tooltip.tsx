import React, {
  useState,
  useRef,
  useEffect,
  useId,
  type HTMLAttributes,
  isValidElement,
} from 'react';
import Styles from '@/components/ui/atoms/Tooltip/Tooltip.module.scss';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import Icon from '../Icon/Icon';

interface TooltipProps {
  id?: string;
  content: React.ReactNode;
  variant?: 'standard' | 'rich';
  shape?: 'balloon' | 'plain';
  size?: 'sm' | 'md';
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
  className?: string;
}

type Position = 'top' | 'bottom' | 'left' | 'right';

const Tooltip = ({
  children,
  content,
  id: externalId,
  variant = 'standard',
  shape = 'balloon',
  size = 'md',
  preferredPosition,
  align = 'center',
  className,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [position, setPosition] = useState<Position>('top');

  const generatedId = useId();
  const tooltipId = externalId || generatedId;

  const targetRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // 닫힘 시 트리거로 포커스 복귀
  const handleClose = () => {
    setIsVisible(false);
    // 닫기 버튼 클릭 시 포커스를 다시 트리거(IconButton 등)로 이동
    if (targetRef.current) {
      targetRef.current.focus();
    }
  };

  // Rich 모드: 열릴 때 내부 포커스 이동
  useEffect(() => {
    if (isVisible && variant === 'rich') {
      const timer = requestAnimationFrame(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus({ preventScroll: true });
        } else if (tooltipRef.current) {
          tooltipRef.current.focus({ preventScroll: true });
        }
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isVisible, variant]);

  const updatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const { scrollY, scrollX } = window;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let calculatedPos: Position = preferredPosition || 'top';
    const offset = 10;

    // 상하 플립 우선 판단
    if (!preferredPosition || preferredPosition === 'top' || preferredPosition === 'bottom') {
      const spaceAbove = targetRect.top;
      const spaceBelow = viewportHeight - targetRect.bottom;

      // preferredPosition이 top인데 위에 공간이 없고 아래에 공간이 더 많으면 bottom으로 변경
      if (
        calculatedPos === 'top' &&
        spaceAbove < tooltipRect.height + offset &&
        spaceBelow > spaceAbove
      ) {
        calculatedPos = 'bottom';
      }
      // preferredPosition이 bottom인데 아래에 공간이 없고 위에 공간이 더 많으면 top으로 변경
      else if (
        calculatedPos === 'bottom' &&
        spaceBelow < tooltipRect.height + offset &&
        spaceAbove > spaceBelow
      ) {
        calculatedPos = 'top';
      }
    }

    let newTop = 0;
    let newLeft = 0;

    // 최종 좌표 계산
    if (calculatedPos === 'top' || calculatedPos === 'bottom') {
      newTop =
        calculatedPos === 'top'
          ? targetRect.top + scrollY - tooltipRect.height - offset
          : targetRect.bottom + scrollY + offset;

      // Align 계산
      if (align === 'start') {
        newLeft = targetRect.left + scrollX;
      } else if (align === 'end') {
        newLeft = targetRect.right + scrollX - tooltipRect.width;
      } else {
        newLeft = targetRect.left + scrollX + targetRect.width / 2 - tooltipRect.width / 2;
      }
    } else {
      // 좌우 배치 시 공간 부족하면 반대 방향으로 플립
      newLeft =
        calculatedPos === 'left'
          ? targetRect.left + scrollX - tooltipRect.width - offset
          : targetRect.right + scrollX + offset;

      // 왼쪽 공간 없으면 오른쪽으로, 오른쪽 공간 없으면 왼쪽으로 (Flip)
      if (calculatedPos === 'left' && targetRect.left < tooltipRect.width + offset) {
        newLeft = targetRect.right + scrollX + offset;
        calculatedPos = 'right';
      } else if (
        calculatedPos === 'right' &&
        viewportWidth - targetRect.right < tooltipRect.width + offset
      ) {
        newLeft = targetRect.left + scrollX - tooltipRect.width - offset;
        calculatedPos = 'left';
      }

      newTop = targetRect.top + scrollY + targetRect.height / 2 - tooltipRect.height / 2;
    }

    // 뷰포트 이탈 방지
    newLeft = Math.max(10, Math.min(newLeft, viewportWidth - tooltipRect.width - 10));
    // 상하 이탈 방지 (스크롤 영역 고려)
    newTop = Math.max(scrollY + 10, newTop);

    setCoords({ top: newTop, left: newLeft });
    setPosition(calculatedPos);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();

      // ESC로 닫기
      const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isVisible, preferredPosition]);

  if (!isValidElement(children)) return <>{children}</>;

  const triggerProps: HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> } = {
    ref: targetRef,
    'aria-describedby': isVisible ? tooltipId : undefined,
  };

  if (variant === 'standard') {
    triggerProps.onMouseEnter = () => setIsVisible(true);
    triggerProps.onMouseLeave = () => setIsVisible(false);
    triggerProps.onFocus = () => setIsVisible(true);
    triggerProps.onBlur = () => setIsVisible(false);
  } else {
    triggerProps.onClick = e => {
      e.preventDefault();
      e.stopPropagation();
      setIsVisible(prev => !prev);
    };

    // 키보드 Enter/Space 대응
    triggerProps.onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(true);
      }
    };
  }

  return (
    <>
      {React.cloneElement(children as React.ReactElement, triggerProps)}
      {isVisible &&
        createPortal(
          <div
            id={tooltipId}
            role='tooltip'
            ref={tooltipRef}
            tabIndex={-1}
            className={clsx(
              `${Styles['tooltip']} variant--${variant} size--${size} shape--${shape}`,
              className,
            )}
            style={{ top: coords.top, left: coords.left, position: 'absolute', zIndex: 9999 }}
          >
            <div className='tooltip__content'>{content}</div>
            {variant === 'rich' && (
              <button
                ref={closeBtnRef}
                type='button'
                className='tooltip__close-btn'
                aria-label='툴팁 닫기'
                onClick={handleClose}
              >
                <Icon name='x' className='icon' strokeWidth={size === 'sm' ? 3.5 : 3} />
              </button>
            )}
            {shape === 'balloon' && (
              <svg
                className={clsx(
                  'tooltip__tail',
                  position && `position--${position}`,
                  align && `align--${align}`,
                )}
                viewBox='0 0 12 6'
                preserveAspectRatio='none'
                aria-hidden='true'
              >
                <path d='M1,0 L11,0 L6,5 Z' />
              </svg>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
