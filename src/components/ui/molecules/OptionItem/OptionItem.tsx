import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionItem/OptionItem.module.scss';
import Icon from '../../atoms/Icon/Icon';

type BaseProps = {
  id: string;
  index?: number; // Optional로 추가
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
  onSelect?: (id: string, value: string) => void;
  className?: string;
  onMount?: (el: HTMLLIElement | null, idx: number) => void;
};

export type OptionItemProps = BaseProps &
  Omit<React.LiHTMLAttributes<HTMLLIElement>, keyof BaseProps>;

const OptionItem = forwardRef<HTMLLIElement, OptionItemProps>(
  (
    {
      id,
      variant,
      color,
      size,
      value,
      disabled,
      selected,
      onSelect,
      className,
      onClick,
      index,
      onMount,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onSelect?.(id, value); // id + value 전달
      }
    };

    return (
      <li
        ref={el => {
          onMount?.(el, index ?? 0);
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as any).current = el;
        }}
        role='option'
        aria-disabled={disabled}
        aria-selected={selected}
        tabIndex={-1} // ★ 키보드 포커싱 제어
        className={clsx(
          styles['option-item'],
          `variant--${variant}`,
          `color--${color}`,
          `size--${size}`,
          className,
        )}
        {...rest}
        onClick={handleClick}
        onKeyDown={onKeyDown}
      >
        <span className='label' title={value}>
          {value || '선택해주세요'}
        </span>

        {selected && value !== '' && (
          <Icon name='round-check' className='icon' strokeLinecap='round' strokeLinejoin='round' />
        )}
      </li>
    );
  },
);

OptionItem.displayName = 'OptionItem';

export default OptionItem;
