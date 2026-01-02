export type ModalVariant = 'custom' | 'alert-info' | 'alert-danger';

export interface ModalConfig {
  variant?: ModalVariant;
  title?: string;
  subTitle?: string;
  description?: string;
  content?: React.ReactNode; // BaseModal용
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
  scrollType?: 'outer' | 'inner';
  children?: React.ReactNode;
}

export interface ModalState {
  id: string; // 고유 ID (중첩 모달 대비)
  type: ModalVariant;
  config?: ModalConfig;
}
