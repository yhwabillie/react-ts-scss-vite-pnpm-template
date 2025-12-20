import React, { useEffect, useState, useRef } from 'react';
import Styles from '@/components/ui/molecules/Toast/Toast.module.scss';
import clsx from 'clsx';
import { useToast } from './ToastProvider';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

// ✅ 링크 데이터 인터페이스 정의
interface ToastLink {
  text: string;
  url: string;
  external?: boolean; // 외부 링크 여부
}

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number; // ✅ 추가
  onClose: (id: string) => void;
  index: number; // 현재 렌더링된 visibleToasts 중에서의 순서 (1, 2, 3)
  link?: ToastLink; // ✅ 링크 props 추가
}

const Toast = ({ id, message, type = 'info', duration, onClose, index, link }: ToastProps) => {
  const { restoreFocus } = useToast();
  const [liveMessage, setLiveMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLiveMessage(message), 50);
    return () => clearTimeout(timeout);
  }, [message]);

  // ✅ [수정] 순차적 포커스 관리: 이제 영역 전체에 포커스를 줍니다.
  useEffect(() => {
    if (index === 1 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [index]);

  useEffect(() => {
    if (!duration || isPaused) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose, isPaused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ✅ 1. ESC 키: 토스트는 유지하고 포커스만 이전 요소로 복구
    if (e.key === 'Escape') {
      e.preventDefault(); // 브라우저 기본 동작 방지
      restoreFocus(); // 포커스만 이동
      return;
    }

    // ✅ 2. Shift + Tab: 첫 번째 토스트에서 밖으로 나가려 할 때 포커스 복구
    if (e.shiftKey && e.key === 'Tab') {
      if (index === 1) {
        e.preventDefault();
        restoreFocus();
      }
    }
  };

  return (
    <div
      ref={containerRef} // ✅ 컨테이너에 Ref 연결
      className={clsx(Styles.toast, Styles[type])}
      role={type === 'error' ? 'alert' : 'status'}
      tabIndex={0} // ✅ 프로그램적으로 포커스를 받을 수 있도록 설정
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      /* ✅ 영역에 포커스가 갔을 때 스크린 리더가 메시지를 읽도록 연결 */
      aria-labelledby={`msg-${id}`}
    >
      <div className={Styles.orderBadge} aria-hidden='true'>
        {index}
      </div>
      <div className={Styles.icon} aria-hidden='true'></div>

      {/* ✅ 2. 메시지에 ID를 부여하여 위labelledby와 연결합니다. */}
      <p id={`msg-${id}`}>{liveMessage}</p>

      <div className={Styles.actionArea}>
        {/* ✅ 링크가 있을 경우 렌더링 */}
        {link && (
          <a
            href={link.url}
            className={Styles.link}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            // ✅ 링크 클릭 시 토스트를 닫음으로써 포커스 복구 트리거
            onClick={() => onClose(id)}
          >
            {link.text}
          </a>
        )}

        <button
          type='button'
          className={Styles.closeButton}
          onClick={() => onClose(id)}
          aria-label='닫기'
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>

      {duration && !isPaused && (
        <div className={Styles.progress} style={{ animationDuration: `${duration}ms` }} />
      )}
    </div>
  );
};

export default Toast;
