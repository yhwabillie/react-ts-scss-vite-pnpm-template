import React, { useEffect, useRef, useState } from 'react';
import { ModalContext } from '@/components/contexts/ModalContext';
import Modal from '@/components/ui/molecules/Modal/Modal';
import type { ModalConfig, ModalState, ModalVariant } from '@/types/modal.types';
import AlertModalContent from './AlertModalContent';
import CustomModalContent from './CustomModalContent';

interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * 모달 시스템의 전역 상태를 관리하는 Provider 컴포넌트
 *
 * @description
 * - 중첩 모달 지원 (modalStack으로 여러 모달 동시 관리)
 * - 자동 포커스 관리 (모달 열림/닫힘 시 트리거 버튼으로 포커스 복귀)
 * - ESC, Enter 키보드 인터랙션 지원
 *
 * @example
 * ```tsx
 * // App.tsx
 * <ModalProvider>
 *   <YourApp />
 * </ModalProvider>
 *
 * // 사용
 * const { openModal } = useContext(ModalContext);
 * openModal('alert', { title: '알림', subtitle: '내용' });
 * ```
 */
const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<ModalState[]>([]);
  const activeTriggerNode = useRef<HTMLElement | null>(null);
  const prevModalStackLength = useRef<number>(0); // ✅ 이전 스택 길이 추적

  // 모달 오픈 시 배경 스크롤 방지 로직
  useEffect(() => {
    if (modalStack.length > 0) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [modalStack.length]);

  const openModal = (type: ModalVariant, config?: ModalConfig) => {
    console.log(`[openModal] 타입: ${type}, 현재 스택 길이: ${modalStack.length}`);

    if (modalStack.length === 0 && !activeTriggerNode.current) {
      const currentFocus = document.activeElement as HTMLElement;

      // ✅ body나 html은 유효한 트리거가 아니므로 저장하지 않음
      if (currentFocus && currentFocus !== document.body && currentFocus.tagName !== 'HTML') {
        activeTriggerNode.current = currentFocus;
        console.log('[openModal] 최초 트리거 저장 완료:', activeTriggerNode.current);
      } else {
        console.log('[openModal] body/html은 트리거로 저장하지 않음');
      }
    } else {
      console.log('[openModal] 트리거 유지 (연쇄 또는 중첩):', activeTriggerNode.current);
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
    // ✅ 모달이 열려있으면 아무것도 안 함
    if (modalStack.length !== 0) return;

    // ✅ 페이지 로드 시 방지: 이전에 모달이 열려있었을 때만 실행
    if (prevModalStackLength.current === 0) {
      console.log('[Focus] 페이지 로드 시에는 포커스 복귀 안 함');
      return;
    }

    const timer = setTimeout(() => {
      const targetNode = activeTriggerNode.current;

      // ✅ 저장된 트리거가 있고 유효한 경우 → 해당 요소로 복귀
      const isValidTarget =
        targetNode &&
        targetNode.isConnected &&
        document.body.contains(targetNode) &&
        !(targetNode as HTMLButtonElement).disabled;

      if (isValidTarget) {
        targetNode.focus({ preventScroll: false });
        console.log('[Focus] 원래 트리거로 복귀:', targetNode);
      } else {
        // ✅ 트리거가 없거나 유효하지 않은 경우 → fallback 실행
        console.log('[Focus] 유효한 트리거 없음 → fallback 실행');

        /**
         * DOM 상단부터 탐색 → 가장 첫 포커스 가능 요소
         */
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

        // ✅ 포커스 가능한 요소가 있을 때만 포커스 이동
        if (allFocusableElements.length > 0) {
          const fallbackTarget = allFocusableElements[0];
          fallbackTarget.focus();
          console.log('[Focus] fallback 포커스:', fallbackTarget);
        } else {
          console.log('[Focus] 포커스 가능한 요소가 없어 포커스 이동하지 않음');
        }
      }

      // 항상 초기화
      activeTriggerNode.current = null;
    }, 100);

    return () => clearTimeout(timer);
  }, [modalStack.length]);

  // ✅ 이전 스택 길이 업데이트 (매 렌더링마다 업데이트)
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

      {/* 모달 렌더링 */}
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
            modalVariant={modal.type}
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
