import React, { useState, useRef, useEffect, type ReactElement, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import Styles from '@/components/ui/organisms/ProfilePopover/PropfilePopover.module.scss';

interface ProfilePopoverProps {
  trigger: ReactElement;
  userData: {
    name: string;
    email: string;
    role: string;
    image?: string;
  };
}

const ProfilePopover = ({ trigger, userData }: ProfilePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX,
    });
  };

  const getFocusableElements = () => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ) as HTMLElement[];
  };

  // ✅ [UPDATE] 팝오버 닫기 및 포커스 복원 로직 통합
  const closePopover = (restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) {
      // 트리거로 포커스를 돌려주면, 사용자가 다시 Tab을 눌렀을 때
      // 자연스럽게 트리거 '다음' 요소로 이동하게 됩니다.
      triggerRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closePopover(true); // ESC는 명시적 취소이므로 트리거로 복귀
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // 1. Shift + Tab: 첫 번째 요소에서 뒤로 나갈 때 -> 트리거로 복귀 후 닫기
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        closePopover(true);
      }
      // 2. Tab: 마지막 요소에서 앞으로 나갈 때 -> 트리거로 복귀 후 닫기
      // 이렇게 해야 사용자가 다음 Tab을 눌렀을 때 트리거의 '다음' 요소로 갑니다.
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        closePopover(true);
      }
    }
  };

  useEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !containerRef.current?.contains(e.target as Node)) {
        closePopover(false); // 외부 클릭은 포커스 강제 이동 없이 닫기만
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const togglePopover = () => {
    if (isOpen) closePopover(false);
    else {
      updatePosition();
      setIsOpen(true);
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePopover();
    }
    // 팝오버가 열린 상태에서 Tab 누르면 내부 첫 요소로 진입
    if (e.key === 'Tab' && isOpen && !e.shiftKey) {
      e.preventDefault();
      getFocusableElements()[0]?.focus();
    }
  };

  const triggerWithProps = React.cloneElement(
    trigger as ReactElement,
    {
      ref: triggerRef,
      onClick: togglePopover,
      onKeyDown: handleTriggerKeyDown,
      tabIndex: 0,
      role: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': isOpen,
      'aria-controls': `popover-${userData.name}`,
    } as HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> },
  );

  return (
    <>
      {triggerWithProps}
      {isOpen &&
        createPortal(
          <div
            id={`popover-${userData.name}`}
            ref={containerRef}
            className={Styles.popover}
            style={{ top: coords.top, left: coords.left, position: 'absolute', zIndex: 9999 }}
            role='dialog'
            aria-modal='false'
            aria-label={`${userData.name} 프로필 정보`}
            onKeyDown={handleKeyDown}
          >
            {/* 카드 컨텐츠 생략 (동일) */}
            <div className={Styles.card}>
              <div className={Styles.info}>
                <p className={Styles.name}>{userData.name}</p>
                <p className={Styles.email}>{userData.email}</p>
                <span className={Styles.badge}>{userData.role}</span>
              </div>
              <div className={Styles.actions}>
                <button type='button' className={Styles.primaryBtn}>
                  프로필 보기
                </button>
                <button type='button' className={Styles.secondaryBtn}>
                  메시지
                </button>
              </div>
            </div>
            <span className={Styles.arrow} aria-hidden='true' />
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProfilePopover;
