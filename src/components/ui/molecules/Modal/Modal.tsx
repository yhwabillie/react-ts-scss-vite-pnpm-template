import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { StyleProps } from '@/types/design/design-tokens.types';

interface ModalProps {
  isOpen: boolean;
  modalType: string;
  zIndex: number;
  children: (refs: { firstFocusableRef: React.RefObject<HTMLElement | null> }) => React.ReactNode;
  onClose: () => void;
}

const Modal = ({ isOpen, modalType, zIndex, children, onClose }: ModalProps) => {
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
    <div className='modal' style={{ zIndex }}>
      {/* Overlay */}
      <div className='modal-overlay' aria-hidden={true} onClick={onClose} />
      {/* Content */}
      <div ref={modalRef} className='modal-content' role='dialog' aria-modal='true'>
        {children({ firstFocusableRef })}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
