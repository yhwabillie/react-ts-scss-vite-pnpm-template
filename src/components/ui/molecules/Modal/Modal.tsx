import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/components/ui/molecules/Modal/Modal.module.scss';
import type { ModalVariant } from '@/types/modal.types';

interface ModalProps {
  isOpen: boolean;
  modalVariant: ModalVariant;
  zIndex: number;
  children: (refs: { firstFocusableRef: React.RefObject<HTMLElement | null> }) => React.ReactNode;
  onClose: () => void;
}

const Modal = ({ isOpen, zIndex, children, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 0ms보다는 아주 약간의 딜레이를 주거나,
      // rAF(requestAnimationFrame)를 사용하면 더 확실합니다.
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
      // ESC 키는 가장 위의 모달만 닫기
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
      // ✅ 1. 배경 클릭 시에만 onClose 실행
      onClick={onClose}
      style={{ zIndex }}
    >
      <div
        // ✅ 2. 콘텐츠 영역 클릭 시 이벤트가 부모(배경)로 퍼지지 않게 차단
        onClick={e => e.stopPropagation()}
        style={{ display: 'contents' }} // 레이아웃에 영향을 주지 않으면서 버블링만 차단
      >
        {children({ firstFocusableRef })}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
