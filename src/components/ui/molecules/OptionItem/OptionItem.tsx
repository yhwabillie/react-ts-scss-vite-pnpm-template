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
  selected?: boolean; // ★ 현재 선택 여부
  onSelect?: (value: string) => void; // OptionList → OptionItem 선택 콜백
  className?: string;
  children: React.ReactNode;
};

export type OptionItemProps = BaseProps &
  Omit<React.LiHTMLAttributes<HTMLLIElement>, keyof BaseProps>;

const OptionItem = forwardRef<HTMLLIElement, OptionItemProps>(
  (
    {
      variant,
      color,
      size,
      value,
      disabled,
      selected,
      onSelect,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
      onClick?.(e);
      if (!disabled) onSelect?.(value);
    };

    return (
      <li
        ref={ref}
        role='option'
        aria-disabled={disabled}
        aria-selected={selected}
        tabIndex={-1} // ★ 키보드 포커싱 제어
        className={clsx(
          styles['option-item'],
          `variant--${variant}`,
          `color--${color}`,
          `size--${size}`,
          selected && 'is-selected', // ★ 선택 시 스타일
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
