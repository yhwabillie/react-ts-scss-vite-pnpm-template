import React from 'react';
import Button from '@/components/ui/molecules/Button/Button';
import type { ModalConfig } from '@/types/modal.types';
import styles from '@/components/ui/molecules/Modal/AlertModalContent.module.scss';
import ButtonGroup from '../ButtonGroup/ButtonGroup';

export interface AlertModalContentProps {
  id: string;
  config: ModalConfig;
  onClose: (id: string) => void;
  firstFocusableRef: React.RefObject<HTMLElement | null>;
}

const AlertModalContent = ({ id, config, onClose, firstFocusableRef }: AlertModalContentProps) => {
  const modalClassMap = {
    default: '',
    'alert-info': styles['alert-info-modal'],
    'alert-danger': styles['alert-danger-modal'],
  };

  const currentVariant = config.variant ?? 'default';
  const modalClassName = modalClassMap[currentVariant];

  const isDangerVariant = config.variant === 'alert-danger';

  // 2. [추가] 공통으로 사용할 닫기 헬퍼 함수
  const handleClose = () => {
    onClose(id); // ✅ 이제 id를 인자로 전달하므로 에러가 해결됩니다.
  };

  return (
    <div
      className={modalClassName}
      ref={firstFocusableRef as React.RefObject<HTMLDivElement>}
      tabIndex={-1}
    >
      <div className='modal-body'>
        {config.title && <h2 className='modal-title'>{config.title}</h2>}
        {config.description && <p className='modal-desc'>{config.description}</p>}

        {/* 만약 subtitle도 description도 없다면 테스트용 텍스트라도 출력 */}
        {!config.subTitle && !config.description && <p>내용이 없습니다.</p>}

        <ButtonGroup align='right' ariaLabel='모달 동작 선택' role='group' size='sm'>
          {config.cancelText && (
            <Button
              variant='outline'
              color={isDangerVariant ? 'danger' : 'primary'}
              size='sm'
              shape='rounded'
              onClick={() => {
                config.onCancel?.();
                handleClose();
              }}
            >
              {config.cancelText}
            </Button>
          )}
          <Button
            variant='solid'
            color={isDangerVariant ? 'danger' : 'primary'}
            size='sm'
            shape='rounded'
            onClick={e => {
              e.stopPropagation();
              if (config.onConfirm) {
                config.onConfirm();
              } else {
                handleClose();
              }
            }}
          >
            {config.confirmText}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default AlertModalContent;
