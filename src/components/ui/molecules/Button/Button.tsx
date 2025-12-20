import React, { forwardRef, useContext, useRef } from 'react';
import styles from '@/components/ui/molecules/Button/Button.module.scss';
import clsx from 'clsx';

import { mergeRefs } from '@/utils/option/mergeRefs';
import { ModalContext } from '@/components/contexts/ModalContext';

type BaseProps = {
  variant: 'solid' | 'outline' | 'ghost' | 'soft';
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape: 'rounded' | 'square' | 'pill';
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  startSpinner?: React.ReactNode;
  endSpinner?: React.ReactNode;
  className?: string;
};

/** <button> 전용 Props */
type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color,
      size,
      variant,
      shape,
      children,
      startIcon,
      endIcon,
      startSpinner,
      endSpinner,
      className,
      ...props
    },
    ref,
  ) => {
    const { openModal, registerTrigger } = useContext(ModalContext);

    // 1. 실제 DOM 요소에 접근할 내부 Ref (객체 형태 유지)
    const internalRef = useRef<HTMLButtonElement>(null);

    // 2. 외부에서 전달된 ref와 내부 ref 병합 (DOM 연결용 함수)
    const combinedRef = mergeRefs(ref, internalRef);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const modalType = e.currentTarget.getAttribute('data-modal');
      const modalConfigStr = e.currentTarget.getAttribute('data-modal-config');

      if (modalType) {
        // 이제 여기서 registerTrigger를 일일이 호출하지 않아도
        // ModalProvider의 openModal 안에서 document.activeElement로 잡아냅니다.

        let config = {};
        if (modalConfigStr) {
          try {
            config = JSON.parse(modalConfigStr);
          } catch (err) {
            console.error(err);
          }
        }

        if (!props.onClick) {
          openModal(modalType, config);
        }
      }

      // 커스텀 onClick 실행 (연쇄 모달 버튼은 이리로 들어옵니다)
      props.onClick?.(e);
    };

    return (
      <button
        ref={combinedRef}
        // [개선] {...props}를 위로 올리고 onClick을 아래에 두어
        // 외부에서 들어오는 onClick이 handleClick을 덮어쓰지 않도록 보호합니다.
        {...props}
        className={clsx(
          styles['btn'], // 기본 클래스
          styles[`variant--${variant}`], // 모듈 방식이라면 이렇게 접근하거나
          `variant--${variant} color--${color} size--${size} shape--${shape}`, // 전역 방식
          className,
        )}
        onClick={handleClick}
      >
        {startSpinner}
        {startIcon}
        <span className={styles['btn-label']}>{children}</span>
        {endIcon}
        {endSpinner}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
