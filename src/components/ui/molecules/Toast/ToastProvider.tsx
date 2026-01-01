import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import Styles from '@/components/ui/molecules/Toast/ToastProvider.module.scss';
import type { ToastType } from './Toast';
import Toast from './Toast';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
}

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  order: number;
  link?: { text?: string; url: string; external?: boolean };
}

interface ToastContextType {
  addToast: (
    message: string,
    type?: ToastType,
    duration?: number,
    link?: ToastItem['link'],
  ) => void;
  removeToast: (id: string) => void;
  restoreFocus: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children, position = 'top-right' }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const visibleToasts = useMemo(() => toasts.slice(0, 3), [toasts]);

  // ✅ [추가] 토스트가 발생하기 전, 사용자가 머물던 요소를 기억하기 위한 Ref
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // ✅ 포커스를 복구하는 공통 함수
  const restoreFocus = useCallback(() => {
    if (lastFocusedElementRef.current) {
      const target = lastFocusedElementRef.current;
      setTimeout(() => target.focus(), 0);
      lastFocusedElementRef.current = null;
    }
  }, []);

  // Toast 컴포넌트에서 접근할 수 있도록 윈도우 객체 등에 임시 연결하거나,
  // Context를 통해 전달할 수도 있습니다. 여기서는 이해를 돕기 위해 ref 로직을 강화합니다.
  useEffect(() => {
    (window as any).__toastRestoreFocus = restoreFocus;
    return () => {
      delete (window as any).__toastRestoreFocus;
    };
  }, [restoreFocus]);

  // ✅ 핵심 수정: addToast 내부에서 최신 toasts 상태를 직접 확인하여
  // '진짜 첫 토스트'인 경우에만 포커스를 저장합니다.
  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration?: number, link?: ToastItem['link']) => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts(prev => {
        if (prev.length === 0 && typeof document !== 'undefined') {
          const currentActive = document.activeElement as HTMLElement;

          // ✅ 현재 포커스가 '알림 리스트' 섹션 내부(또는 토스트 자체)에 있지 않을 때만 저장
          const isFocusInsideToast = currentActive.closest('section[aria-label="알림 리스트"]');

          if (!isFocusInsideToast) {
            lastFocusedElementRef.current = currentActive;
          }
        }

        const nextOrder = prev.length > 0 ? prev[prev.length - 1].order + 1 : 1;
        return [...prev, { id, message, type, duration, link, order: nextOrder }];
      });
    },
    [], // ✅ 의존성 비움: 더 이상 toasts.length에 반응하지 않음
  );

  const removeToast = useCallback(
    (id: string) => {
      setToasts(prev => {
        const updatedToasts = prev.filter(toast => toast.id !== id);
        // ✅ 모든 토스트가 사라지면 복구 함수 호출
        if (updatedToasts.length === 0) {
          restoreFocus();
        }
        return updatedToasts;
      });
    },
    [restoreFocus],
  );

  return (
    // ✅ value에 restoreFocus 추가
    <ToastContext.Provider value={{ addToast, removeToast, restoreFocus }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`${Styles.toastContainer} ${Styles[position]}`}
            role='presentation'
            aria-live='off'
          >
            {visibleToasts.map((toast, idx) => (
              <Toast key={toast.id} {...toast} onClose={removeToast} index={idx + 1} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
