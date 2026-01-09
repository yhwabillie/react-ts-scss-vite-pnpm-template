import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionItem/OptionItem.module.scss';
import Icon from '@/components/ui/atoms/Icon/Icon';
import IconFrame from '../IconFrame/IconFrame';

export interface SearchOptionItemBase {
  id: string;
  value: string;
  label?: string;
  disabled?: boolean;
  selected?: any;
  href?: string;
  target?: string;
}
export interface BaseProps extends SearchOptionItemBase {
  variant: 'solid' | 'ghost';
  color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  index?: number;
  className?: string;
  placeholder?: string;
  onSelect?: (id: string, value: string) => void;
  onMount?: (el: HTMLLIElement | null, idx: number) => void;
  isActive?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLAnchorElement>;
}

export type SearchOptionItemProps = BaseProps &
  Omit<React.LiHTMLAttributes<HTMLLIElement>, keyof BaseProps>;

const SearchOptionItem = forwardRef<HTMLLIElement, SearchOptionItemProps>(
  (
    {
      id,
      variant,
      color,
      size,
      href = '#',
      target = '_self',
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
      isActive,
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      if (href === '#') {
        e.preventDefault();
      }

      onSelect?.(id, value);
      onClick?.(e as unknown as React.MouseEvent<HTMLLIElement>);
    };

    return (
      <li
        ref={el => {
          onMount?.(el, index ?? 0);
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as any).current = el;
        }}
        id={id}
        aria-disabled={disabled}
        aria-selected={id === 'placeholder' ? false : selected}
        tabIndex={tabIndex}
        className={clsx(
          styles['option-item'],
          `variant--${variant}`,
          `color--${color}`,
          `size--${size}`,
          'option-item',
          isActive && 'is-active',
          className,
        )}
      >
        <a href={href} target={target} onClick={handleClick} onKeyDown={onKeyDown}>
          <span className='icon-wrapper'>
            <Icon
              name='arrow-up-right'
              className='icon'
              strokeWidth={3}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </span>
          <span className='label' title={value || undefined}>
            {value || placeholder}
          </span>
        </a>
      </li>
    );
  },
);

SearchOptionItem.displayName = 'SearchOptionItem';

export default SearchOptionItem;
