import React from 'react';
import Button from '@/components/ui/molecules/Button/Button';
import type { ModalConfig } from '@/types/modal.types';

interface AlertModalContentProps {
  id?: string; // 이 부분이 추가되어야 에러가 사라집니다.
  config: ModalConfig;
  onClose: () => void;
  firstFocusableRef: React.RefObject<HTMLElement | null>;
}

const AlertModalContent = ({ config, onClose, firstFocusableRef }: AlertModalContentProps) => {
  return (
    <div className={`alert-modal alert-modal--${config.variant}`}>
      {/* 1. Header (이 부분이 사라졌으므로 명시적 렌더링) */}
      <div className='modal-header'>
        <h2
          className='modal-title'
          ref={firstFocusableRef as any}
          tabIndex={-1}
          style={{ outline: 'none' }} // 포커스 시 테두리 제거 (선택)
        >
          {config.title}
        </h2>
      </div>

      {/* 2. Body (비어있던 부분) */}
      <div className='modal-body'>
        {config.subtitle && (
          <strong className='modal-subtitle' style={{ display: 'block', marginBottom: '8px' }}>
            {config.subtitle}
          </strong>
        )}
        {config.description && <p className='modal-desc'>{config.description}</p>}
        {/* 만약 subtitle도 description도 없다면 테스트용 텍스트라도 출력 */}
        {!config.subtitle && !config.description && <p>내용이 없습니다.</p>}
      </div>

      {/* 3. Footer */}
      <div className='modal-footer'>
        {/* cancelText가 존재하고 빈 문자열이 아닐 때만 렌더링 */}
        {config.cancelText && (
          <Button
            variant='outline'
            color='secondary'
            size='md'
            shape='rounded'
            onClick={() => {
              config.onCancel?.();
              onClose();
            }}
          >
            {config.cancelText}
          </Button>
        )}
        <Button
          variant='solid'
          color={config.variant === 'alert' ? 'danger' : 'brand'}
          size='md'
          shape='rounded'
          onClick={e => {
            e.stopPropagation(); // 이벤트 전파 방지
            if (config.onConfirm) {
              config.onConfirm(); // 여기서 페이지의 handleDeleteFlow 내 onConfirm이 실행됨
            } else {
              onClose(); // 기본 동작
            }
          }}
        >
          {config.confirmText}
        </Button>
      </div>
    </div>
  );
};

export default AlertModalContent;
