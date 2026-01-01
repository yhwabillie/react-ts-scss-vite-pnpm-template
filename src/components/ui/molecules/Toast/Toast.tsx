import React, { useEffect, useState, useRef } from 'react';
import Styles from '@/components/ui/molecules/Toast/Toast.module.scss';
import clsx from 'clsx';
import { useToast } from './ToastProvider';
import Icon from '../../atoms/Icon/Icon';
import IconFrame from '../IconFrame/IconFrame';
import IconButton from '../IconButton/IconButton';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

// 링크 데이터 인터페이스 정의
interface ToastLink {
  url: string;
  external?: boolean; // 외부 링크 여부
}

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
  index: number; // 현재 렌더링된 visibleToasts 중에서의 순서 (1, 2, 3)
  link?: ToastLink;
}

const Toast = ({ id, message, type = 'info', duration, onClose, index, link }: ToastProps) => {
  const { restoreFocus } = useToast();
  const [liveMessage, setLiveMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // 닫히는 중인지 상태값 추가
  const containerRef = useRef<HTMLDivElement>(null);

  // 닫기 로직을 래핑함
  const handleClose = () => {
    setIsClosing(true); // 닫기 애니메이션 시작
    setTimeout(() => {
      onClose(id); // 0.3초(애니메이션 시간) 후에 실제로 제거
    }, 300);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLiveMessage(message), 50);
    return () => clearTimeout(timeout);
  }, [message]);

  //  순차적 포커스 관리
  useEffect(() => {
    if (index === 1 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [index]);

  // 타이머 로직 수정 (onClose 대신 handleClose 호출)
  useEffect(() => {
    if (!duration || isPaused) return;
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [id, duration, isPaused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ESC 키: 토스트는 유지하고 포커스만 이전 요소로 복구
    if (e.key === 'Escape') {
      e.preventDefault(); // 브라우저 기본 동작 방지
      restoreFocus(); // 포커스만 이동
      return;
    }

    // Shift + Tab: 첫 번째 토스트에서 밖으로 나가려 할 때 포커스 복구
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
      /* 영역에 포커스가 갔을 때 스크린 리더가 메시지를 읽도록 연결 */
      aria-labelledby={`msg-${id}`}
    >
      {/* 순서 index */}
      {/* <div className={Styles.orderBadge} aria-hidden='true'>
        {index}
      </div> */}

      {/* 아이콘 */}
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
        {/* 메시지 */}
        <p id={`msg-${id}`}>{liveMessage}</p>

        {/* 액션 영역 */}
        {link && (
          <a
            href={link.url}
            className={Styles['link-btn']}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            // 링크 클릭 시 토스트를 닫음으로써 포커스 복구 트리거
            onClick={() => onClose(id)}
          >
            바로가기
          </a>
        )}
      </div>

      {/* 닫기 */}
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
