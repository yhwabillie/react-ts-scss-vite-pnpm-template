import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionItem/OptionItem.module.scss';
import Icon from '@/components/ui/atoms/Icon/Icon';

export interface OptionBase {
  id: string;
  value: string;
  label?: string;
  disabled?: boolean;
  selected: boolean;
}
interface BaseProps extends OptionBase {
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
  index?: number; // Optional로 추가
  className?: string;
  placeholder?: string;
  onSelect?: (id: string, value: string) => void;
  onMount?: (el: HTMLLIElement | null, idx: number) => void;
}

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
      placeholder,
      disabled,
      selected,
      onSelect,
      className,
      onClick,
      index,
      onMount,
      onKeyDown,
      tabIndex,
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
        id={id}
        role={id === 'placeholder' ? 'note' : 'option'}
        aria-disabled={disabled}
        aria-selected={id === 'placeholder' ? false : selected}
        tabIndex={tabIndex}
        className={clsx(
          styles['option-item'],
          `variant--${variant}`,
          `color--${color}`,
          `size--${size}`,
          className,
        )}
        onClick={handleClick}
        onKeyDown={onKeyDown}
      >
        <span className='label' title={value}>
          {value || placeholder}
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
