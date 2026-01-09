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
    'alert-info': styles['alert-info-modal'],
    'alert-danger': styles['alert-danger-modal'],
  };

  // variant가 있을 때만 map에서 찾고, 타입 시스템에 해당 키가 map 안에 있음을 알립니다.
  const modalClassName = config.variant
    ? modalClassMap[config.variant as keyof typeof modalClassMap]
    : '';

  const isDangerVariant = config.variant === 'alert-danger';

  const handleClose = () => {
    onClose(id);
  };

  return (
    <div
      className={modalClassName}
      ref={firstFocusableRef as React.RefObject<HTMLDivElement>}
      tabIndex={-1}
    >
      <div className='modal-body'>
        {config.title && <h3 className='modal-title'>{config.title}</h3>}
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
