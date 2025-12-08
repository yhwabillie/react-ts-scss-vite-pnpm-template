import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionItem/OptionItem.module.scss';

type BaseProps = {
  variant: 'solid' | 'soft' | 'ghost';
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  value: string; // 선택값
  disabled?: boolean;
  onSelect?: (value: string) => void; // OptionList → OptionItem 선택 콜백
  className?: string;
  children: React.ReactNode;
};

export type OptionItemProps = BaseProps &
  Omit<React.LiHTMLAttributes<HTMLLIElement>, keyof BaseProps>;

const OptionItem = forwardRef<HTMLLIElement, OptionItemProps>(
  (
    { variant, color, size, value, disabled, onSelect, className, children, onClick, ...rest },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
      // 기존 onClick 먼저 실행
      onClick?.(e);

      if (!disabled) {
        // 선택 이벤트 전달
        onSelect?.(value);
      }
    };

    return (
      <li
        ref={ref}
        role='option'
        aria-disabled={disabled}
        className={clsx(
          styles['option-item'],
          `variant--${variant}`,
          `color--${color}`,
          `size--${size}`,
          className,
        )}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

OptionItem.displayName = 'OptionItem';

export default OptionItem;
