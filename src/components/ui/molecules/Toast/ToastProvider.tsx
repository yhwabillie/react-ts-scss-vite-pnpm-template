import type { ReactNode } from 'react';
import {
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
  children: ReactNode;
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

  // 토스트 발생 전 포커스 저장
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // 포커스 복구
  const restoreFocus = useCallback(() => {
    if (lastFocusedElementRef.current) {
      const target = lastFocusedElementRef.current;
      setTimeout(() => target.focus(), 0);
      lastFocusedElementRef.current = null;
    }
  }, []);

  // Storybook/테스트용 포커스 복구 헬퍼
  useEffect(() => {
    (window as any).__toastRestoreFocus = restoreFocus;
    return () => {
      delete (window as any).__toastRestoreFocus;
    };
  }, [restoreFocus]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration?: number, link?: ToastItem['link']) => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts(prev => {
        if (prev.length === 0 && typeof document !== 'undefined') {
          const currentActive = document.activeElement as HTMLElement;

          const isFocusInsideToast = currentActive.closest('section[aria-label="알림 리스트"]');

          if (!isFocusInsideToast) {
            lastFocusedElementRef.current = currentActive;
          }
        }

        const nextOrder = prev.length > 0 ? prev[prev.length - 1].order + 1 : 1;
        return [...prev, { id, message, type, duration, link, order: nextOrder }];
      });
    },
    [],
  );

  const removeToast = useCallback(
    (id: string) => {
      setToasts(prev => {
        const updatedToasts = prev.filter(toast => toast.id !== id);
        if (updatedToasts.length === 0) {
          restoreFocus();
        }
        return updatedToasts;
      });
    },
    [restoreFocus],
  );

  return (
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
