export type ModalVariant = 'default' | 'alert' | 'confirm' | 'success' | 'error';

export interface ModalConfig {
  variant?: ModalVariant;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: React.ReactNode; // BaseModal용
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
}

export interface ModalState {
  id: string; // 고유 ID (중첩 모달 대비)
  type: 'alert' | 'base' | string;
  config?: ModalConfig;
}
