import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionList/OptionList.module.scss';
import type { OptionItemProps } from '../OptionItem/OptionItem';

type BaseProps = {
  variant: 'solid' | 'soft' | 'outline' | 'ghost';
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
  className?: string;
  children: React.ReactNode;

  onOptionSelect?: (id: string, value: string) => void;
  selectedId?: string;
};

export type OptionListProps = BaseProps &
  Omit<React.HTMLAttributes<HTMLUListElement>, keyof BaseProps>;

const OptionList = forwardRef<HTMLUListElement, OptionListProps>(
  ({ variant, color, size, className, children, onOptionSelect, selectedId, ...rest }, ref) => {
    const clonedChildren = React.Children.map(children, child => {
      if (!React.isValidElement(child)) return child;

      // 🔥 OptionItemProps를 기반으로 element 타입 좁히기
      const element = child as React.ReactElement<OptionItemProps>;

      const value = element.props.value;
      const disabled = element.props['aria-disabled'] === true;
      const id = element.props.id; // id 확보

      return React.cloneElement(element, {
        key: id,
        role: 'option',
        value,
        disabled,
        selected: selectedId === id,
        'aria-disabled': disabled,
        onClick: (e: React.MouseEvent<HTMLLIElement>) => {
          element.props.onClick?.(e);
          if (!disabled) onOptionSelect?.(id, value); // id + value
        },
      });
    });

    return (
      <div
        className={clsx(
          styles['option-list'],
          `variant--${variant}`,
          `color--${color}`,
          `size--${size}`,
          `option-list`,
          className,
        )}
      >
        <ul ref={ref} role='listbox' {...rest}>
          {clonedChildren}
        </ul>
      </div>
    );
  },
);

OptionList.displayName = 'OptionList';

export default OptionList;
