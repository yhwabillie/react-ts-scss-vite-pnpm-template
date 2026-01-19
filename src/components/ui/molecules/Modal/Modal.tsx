import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/components/ui/molecules/Modal/Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  zIndex: number;
  children: (refs: { firstFocusableRef: RefObject<HTMLElement | null> }) => ReactNode;
  onClose: () => void;
}

const Modal = ({ isOpen, zIndex, children, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 짧은 지연 후 첫 포커스 이동
      const timer = setTimeout(() => {
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        }
      }, 50); // 50ms 정도로 조정 시도
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC: 최상위 모달 닫기
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }

      // Tab 트래핑
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements?.[0] as HTMLElement | undefined;
        const lastElement = focusableElements?.[focusableElements.length - 1] as
          | HTMLElement
          | undefined;

        if (!firstElement || !lastElement) return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      className={styles['modal']}
      role='dialog'
      aria-modal='true'
      onClick={onClose}
      style={{ zIndex }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ display: 'contents' }} // 레이아웃 유지 + 버블링 차단
      >
        {children({ firstFocusableRef })}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
