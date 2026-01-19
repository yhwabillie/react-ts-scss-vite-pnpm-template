import { useEffect, useState, useRef } from 'react';
import Styles from '@/components/ui/molecules/Toast/Toast.module.scss';
import clsx from 'clsx';
import { useToast } from './ToastProvider';
import Icon from '../../atoms/Icon/Icon';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastLink {
  url: string;
  label?: string;
  external?: boolean; // 외부 링크 여부
}

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
  index: number; // visibleToasts 내 순서 (1, 2, 3)
  link?: ToastLink;
}

const Toast = ({ id, message, type = 'info', duration, onClose, index, link }: ToastProps) => {
  const { restoreFocus } = useToast();
  const [liveMessage, setLiveMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 닫기 애니메이션 후 실제 제거
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLiveMessage(message), 50);
    return () => clearTimeout(timeout);
  }, [message]);

  // 첫 번째 토스트에만 포커스 부여
  useEffect(() => {
    if (index === 1 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [index]);

  // 자동 종료 타이머
  useEffect(() => {
    if (!duration || isPaused) return;
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [id, duration, isPaused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      restoreFocus();
      return;
    }

    if (e.shiftKey && e.key === 'Tab') {
      if (index === 1) {
        e.preventDefault();
        restoreFocus();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx(Styles.toast, `is-${type}`, isClosing && Styles.fadeOut)}
      role={type === 'error' ? 'alert' : 'status'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-labelledby={`msg-${id}`}
    >
      <Icon
        className='icon'
        name={
          type === 'info'
            ? 'info-circle'
            : type === 'success'
              ? 'check-circle'
              : type === 'warning'
                ? 'warning-triangle'
                : 'x-circle'
        }
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2.5}
      />

      <div className={Styles['info-area']}>
        <p id={`msg-${id}`}>{liveMessage}</p>

        {link && (
          <a
            href={link.url}
            className={Styles['link-btn']}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            onClick={() => onClose(id)}
          >
            {link.label ?? '바로가기'}
          </a>
        )}
      </div>

      <button type='button' className={Styles['close-btn']} onClick={handleClose}>
        <Icon
          className='icon'
          name='x'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2.5}
        />
        <span className='sr-only'>닫기</span>
      </button>

      {duration && !isPaused && (
        <div className={Styles.progress} style={{ animationDuration: `${duration}ms` }} />
      )}
    </div>
  );
};

export default Toast;
