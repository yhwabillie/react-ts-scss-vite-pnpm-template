import { createContext } from 'react';
import type { ModalConfig } from '@/types/modal.types'; // 작성하신 타입 경로

interface ModalContextType {
  // config 인자를 선택적(?)으로 추가하여 2개의 인자를 받을 수 있게 합니다.
  openModal: (modalType: string, config?: ModalConfig) => void;
  closeModal: (idOrType: string) => void;
  registerTrigger: (modalType: string, ref: React.RefObject<HTMLButtonElement | null>) => void;
}

export const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  registerTrigger: () => {},
});
