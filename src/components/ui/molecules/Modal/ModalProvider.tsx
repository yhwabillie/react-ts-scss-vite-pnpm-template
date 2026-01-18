import { useEffect, useRef, useState } from 'react';
import { ModalContext } from '@/components/contexts/ModalContext';
import Modal from '@/components/ui/molecules/Modal/Modal';
import type { ModalConfig, ModalState, ModalVariant } from '@/types/modal.types';
import AlertModalContent from './AlertModalContent';
import CustomModalContent from './CustomModalContent';

interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * 모달 전역 상태 관리
 * - 스택/포커스/배경 스크롤 제어
 */
const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<ModalState[]>([]);
  const activeTriggerNode = useRef<HTMLElement | null>(null);
  const prevModalStackLength = useRef<number>(0); // 이전 스택 길이

  // 모달 오픈 시 배경 스크롤 방지
  useEffect(() => {
    if (modalStack.length > 0) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [modalStack.length]);

  const openModal = (type: ModalVariant, config?: ModalConfig) => {
    if (modalStack.length === 0 && !activeTriggerNode.current) {
      const currentFocus = document.activeElement as HTMLElement;

      if (currentFocus && currentFocus !== document.body && currentFocus.tagName !== 'HTML') {
        activeTriggerNode.current = currentFocus;
      }
    }

    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setModalStack(prev => [...prev, { id, type, config }]);
  };

  const closeModal = (idOrType: string) => {
    setModalStack(prev => {
      const index = prev.findIndex(m => m.id === idOrType || m.type === idOrType);
      if (index === -1) return prev;

      const newStack = [...prev];
      newStack.splice(index, 1);
      return newStack;
    });
  };

  useEffect(() => {
    if (modalStack.length !== 0) return;

    if (prevModalStackLength.current === 0) {
      return;
    }

    const timer = setTimeout(() => {
      const targetNode = activeTriggerNode.current;

      const isValidTarget =
        targetNode &&
        targetNode.isConnected &&
        document.body.contains(targetNode) &&
        !(targetNode as HTMLButtonElement).disabled;

      if (isValidTarget) {
        targetNode.focus({ preventScroll: false });
      } else {
        // 트리거가 없으면 첫 포커스 가능 요소로 이동
        const allFocusableElements = document.querySelectorAll<HTMLElement>(
          `
          button:not([disabled]),
          a[href],
          input:not([disabled]),
          select:not([disabled]),
          textarea:not([disabled]),
          [tabindex]:not([tabindex="-1"])
          `,
        );

        if (allFocusableElements.length > 0) {
          const fallbackTarget = allFocusableElements[0];
          fallbackTarget.focus();
        }
      }

      // 항상 초기화
      activeTriggerNode.current = null;
    }, 100);

    return () => clearTimeout(timer);
  }, [modalStack.length]);

  // 이전 스택 길이 업데이트
  useEffect(() => {
    prevModalStackLength.current = modalStack.length;
  }, [modalStack.length]);

  // ============================================================
  // Modal Components Registry
  // ============================================================
  const modalComponents: Record<string, React.ComponentType<any>> = {
    'alert-info': AlertModalContent,
    'alert-danger': AlertModalContent,
    custom: CustomModalContent,
    // 새로운 모달을 여기에 추가
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <ModalContext.Provider value={{ openModal, closeModal, registerTrigger: () => {} }}>
      {children}

      {modalStack.map((modal, index) => {
        const RegisteredComponent = modalComponents[modal.type];

        if (!RegisteredComponent) return null;

        const finalConfig: ModalConfig = {
          variant: modal.type,
          title: '알림',
          confirmText: '확인',
          ...modal.config,
        };

        return (
          <Modal
            key={modal.id}
            isOpen={true}
            onClose={() => closeModal(modal.id)}
            zIndex={1000 + index * 10}
          >
            {({ firstFocusableRef }) => (
              <RegisteredComponent
                id={modal.id}
                config={finalConfig}
                onClose={() => closeModal(modal.id)}
                firstFocusableRef={firstFocusableRef}
              />
            )}
          </Modal>
        );
      })}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
