import React, { useEffect, useRef, useState } from 'react';
import { ModalContext } from '@/components/contexts/ModalContext';
import Modal from '@/components/ui/molecules/Modal/Modal';
import type { ModalConfig, ModalState } from '@/types/modal.types';
import AlertModalContent from './AlertModalContent';
import ProfileEditModal from './ProfileEditModal';
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
 * // 버튼에서 사용
 * <Button data-modal="alert">모달 열기</Button>
 * ```
 */
const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<ModalState[]>([]);
  const activeTriggerNode = useRef<HTMLElement | null>(null);

  const openModal = (type: string, config?: ModalConfig) => {
    console.log(`[openModal] 타입: ${type}, 현재 스택 길이: ${modalStack.length}`);

    // [수정] 스택이 0이고, '기존에 저장된 트리거 노드가 없을 때만' 저장합니다.
    // 이렇게 하면 연쇄 모달 도중에 스택이 잠시 0이 되어도 첫 버튼을 끝까지 지킵니다.
    if (modalStack.length === 0 && !activeTriggerNode.current) {
      activeTriggerNode.current = document.activeElement as HTMLElement;
      console.log('[openModal] 최초 트리거 저장 완료:', activeTriggerNode.current);
    } else {
      console.log('[openModal] 트리거 유지 (연쇄 또는 중첩):', activeTriggerNode.current);
    }

    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setModalStack(prev => [...prev, { id, type, config }]);
  };

  const closeModal = (idOrType: string) => {
    setModalStack(prev => {
      // 1. ID로 먼저 찾고, 없으면 타입으로 찾음
      const index = prev.findIndex(m => m.id === idOrType || m.type === idOrType);

      if (index === -1) return prev;

      const newStack = [...prev];
      newStack.splice(index, 1);
      return newStack;
    });
  };

  useEffect(() => {
    // 모달 스택이 비었고, 돌아갈 타겟 노드가 있을 때만 실행
    if (modalStack.length === 0 && activeTriggerNode.current) {
      const targetNode = activeTriggerNode.current;

      const timer = setTimeout(() => {
        // 1. 노드가 실제로 문서 내에 '연결'되어 있는지 더 정확히 확인 (isConnected)
        const isVisibleAndConnected =
          targetNode && targetNode.isConnected && document.body.contains(targetNode);

        if (isVisibleAndConnected) {
          // [핵심] 버튼이 비활성화 상태라면 포커스를 받을 수 없으므로 강제 활성화 검사
          if ((targetNode as HTMLButtonElement).disabled) {
            console.warn('[Focus] 타겟 버튼이 disabled 상태입니다.');
          }

          // preventScroll: false로 하여 버튼이 있는 곳으로 화면이 이동하게 함
          targetNode.focus({ preventScroll: false });
          console.log('[Focus] 원래 버튼으로 복구 성공:', targetNode);

          // 성공적으로 복구했다면 초기화
          activeTriggerNode.current = null;
        } else {
          // 2. 버튼이 있는데도 여기로 들어온다면 타이밍 문제일 확률이 높음
          console.log('[Focus] 원래 버튼을 찾을 수 없어 Fallback 실행');

          const fallbackTarget =
            document.querySelector<HTMLElement>('main h1, #root a, button') || document.body;

          fallbackTarget.focus();
          activeTriggerNode.current = null;
        }
      }, 100); // 60ms에서 100ms로 늘려 브라우저 렌더링 완료를 기다림

      return () => clearTimeout(timer);
    }
  }, [modalStack.length]);

  // registerTrigger는 이제 보조 수단으로만 남겨두거나 삭제해도 됩니다.
  // const registerTrigger = (modalType: string, ref: React.RefObject<HTMLButtonElement | null>) => {
  //   if (ref.current) activeTriggerNode.current = ref.current;
  // };

  // ============================================================
  // Types
  // ============================================================
  /**
   * 모든 모달 컨텐츠 컴포넌트가 받아야 하는 공통 Props
   */

  // ============================================================
  // Modal Components Registry
  // ============================================================
  /**
   * 모달 타입과 실제 컴포넌트를 매핑
   *
   * 새로운 모달 추가 방법:
   * 1. ModalContent 컴포넌트 생성 (firstFocusableRef prop 필수)
   * 2. 여기에 등록: myModal: MyModalContent
   * 3. 사용: <Button data-modal="myModal">열기</Button>
   */

  const modalComponents: Record<string, React.ComponentType<any>> = {
    profileEdit: ProfileEditModal, // 이제 openModal('profileEdit')로 호출 가능
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
        const RegisteredComponent =
          modal.type === 'alert' ? AlertModalContent : modalComponents[modal.type];

        if (!RegisteredComponent) return null;

        // 1. 여기서 config를 재조립합니다.
        const finalConfig: ModalConfig = {
          variant: 'default',
          title: '알림',
          confirmText: '확인',
          ...modal.config, // 이 부분이 비어있으면 위 기본값들이 나옵니다.
        };

        return (
          <Modal
            key={modal.id}
            isOpen={true}
            modalType={modal.type}
            onClose={() => closeModal(modal.id)}
            zIndex={1000 + index * 10}
          >
            {({ firstFocusableRef }) => (
              <RegisteredComponent
                id={modal.id} // ID 전달
                config={finalConfig} // 이제 undefined가 아니므로 에러가 사라집니다
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
