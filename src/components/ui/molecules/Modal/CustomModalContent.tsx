import type { RefObject } from 'react';
import type { ModalConfig } from '@/types/modal.types';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import Button from '../Button/Button';
import Icon from '../../atoms/Icon/Icon';
import styles from '@/components/ui/molecules/Modal/CustomModalContent.module.scss';
import clsx from 'clsx';

export interface CustomModalContentProps {
  id: string;
  config: ModalConfig;
  onClose: (id: string) => void;
  firstFocusableRef: RefObject<HTMLElement | null>;
  size: 'sm' | 'md' | 'lg';
}

const CustomModalContent = ({
  id,
  config,
  onClose,
  firstFocusableRef,
  size = 'md',
}: CustomModalContentProps) => {
  const handleClose = () => {
    onClose(id);
  };

  return (
    <div
      className={clsx(`${styles['custom-modal']} size--${size}`, {
        'is-outer-scroll': config.scrollType === 'outer',
        'is-inner-scroll': config.scrollType === 'inner',
      })}
      ref={firstFocusableRef as RefObject<HTMLDivElement>}
      tabIndex={-1}
    >
      <div className='modal-head'>
        {config.title && <h3 className='modal-title'>{config.title}</h3>}

        {config.showCloseButton && (
          <div className='modal-action'>
            <button className='btn-close'>
              <Icon name='x' strokeWidth={3} strokeLinecap='round' strokeLinejoin='round' />
              <span className='sr-only'>닫기</span>
            </button>
          </div>
        )}
      </div>
      <div className='modal-body'>
        {config.description && <p className='modal-msg'>{config.description}</p>}
        {config.children}
      </div>
      <ButtonGroup
        className='modal-footer'
        align='right'
        ariaLabel='모달 동작 선택'
        role='group'
        size={size}
      >
        {config.cancelText && (
          <Button
            variant='outline'
            color='primary'
            size={size}
            shape='rounded'
            onClick={() => {
              config.onCancel?.();
              handleClose();
            }}
          >
            {config.cancelText}
          </Button>
        )}

        {config.confirmText && (
          <Button
            variant='solid'
            color='primary'
            size={size}
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
        )}
      </ButtonGroup>
    </div>
  );
};

export default CustomModalContent;
