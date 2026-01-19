import React, { forwardRef, useContext, useRef } from 'react';
import styles from '@/components/ui/molecules/Button/Button.module.scss';
import clsx from 'clsx';

import { mergeRefs } from '@/utils/option/mergeRefs';
import { ModalContext } from '@/components/contexts/ModalContext';
import type { ModalVariant } from '@/types/modal.types';

// 공통 스타일 props
type BaseProps = {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'square' | 'rounded' | 'pill';
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  startSpinner?: React.ReactNode;
  endSpinner?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
};

// 폴리모픽 버튼 타입
type PolymorphicButtonProps<T extends React.ElementType> = BaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof BaseProps | 'as'>;

// forwardRef용 선언 타입 (외부 사용 시 props 추론)
type ButtonComponent = <T extends React.ElementType = 'button'>(
  props: PolymorphicButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] },
) => React.ReactElement | null;

// 내부 구현 (forwardRef 충돌 회피 위해 any 사용)
const ButtonInner = (
  {
    as,
    color = 'primary',
    size = 'md',
    variant = 'solid',
    shape = 'rounded',
    children,
    startIcon,
    endIcon,
    startSpinner,
    endSpinner,
    fullWidth,
    className,
    ...props
  }: PolymorphicButtonProps<React.ElementType>,
  ref: React.ForwardedRef<any>,
) => {
  const { openModal } = useContext(ModalContext);
  const Component = as || 'button';

  // 내부 DOM ref
  const internalRef = useRef<HTMLElement>(null);
  const combinedRef = mergeRefs(ref, internalRef);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const modalType = e.currentTarget.getAttribute('data-modal') as ModalVariant;
    const modalConfigStr = e.currentTarget.getAttribute('data-modal-config');

    if (modalType) {
      let config = {};
      if (modalConfigStr) {
        try {
          config = JSON.parse(modalConfigStr);
        } catch (err) {
          console.error('Modal config parse error:', err);
        }
      }
      if (!props.onClick) {
        openModal(modalType, config);
      }
    }

    (props.onClick as React.MouseEventHandler<HTMLElement>)?.(e);
  };

  return (
    <Component
      ref={combinedRef}
      {...props}
      className={clsx(
        styles['btn'],
        styles[`variant--${variant}`],
        `variant--${variant} color--${color} size--${size} shape--${shape}`,
        fullWidth && 'is-full',
        className,
      )}
      onClick={handleClick}
    >
      {startSpinner}
      {startIcon}
      <span className={styles['btn-label']}>{children}</span>
      {endIcon}
      {endSpinner}
    </Component>
  );
};

// 최종 내보내기: 구현체에 타입 매핑
const Button = forwardRef(ButtonInner) as ButtonComponent;

(Button as any).displayName = 'Button';

export default Button;
