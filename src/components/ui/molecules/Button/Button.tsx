import React, { forwardRef, useContext, useRef } from 'react';
import styles from '@/components/ui/molecules/Button/Button.module.scss';
import clsx from 'clsx';

import { mergeRefs } from '@/utils/option/mergeRefs';
import { ModalContext } from '@/components/contexts/ModalContext';

// 1. 공통 스타일 Props 정의
type BaseProps = {
  variant?: 'solid' | 'outline' | 'ghost';
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

// 2. 다형성 지원을 위한 제네릭 타입 정의
type PolymorphicButtonProps<T extends React.ElementType> = BaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof BaseProps | 'as'>;

// 3. forwardRef의 타입 한계를 극복하기 위한 컴포넌트 전체 타입 선언
// 이 타입이 외부에서 사용할 때 정확한 속성(href 등)을 추론하게 해줍니다.
type ButtonComponent = <T extends React.ElementType = 'button'>(
  props: PolymorphicButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] },
) => React.ReactElement | null;

// 4. 내부 구현 (ButtonInner)
// 내부에서는 타입을 조금 느슨하게(any) 처리하여 forwardRef와의 충돌을 피합니다.
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

  // 실제 DOM 접근을 위한 내부 ref
  const internalRef = useRef<HTMLElement>(null);
  const combinedRef = mergeRefs(ref, internalRef);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const modalType = e.currentTarget.getAttribute('data-modal');
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

// 5. ✅ 최종 내보내기: 구현체에 강제로 타입을 매핑
const Button = forwardRef(ButtonInner) as ButtonComponent;

(Button as any).displayName = 'Button';

export default Button;
