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

  onOptionSelect?: (value: string) => void;
  selectedValue?: string;
};

export type OptionListProps = BaseProps &
  Omit<React.HTMLAttributes<HTMLUListElement>, keyof BaseProps>;

const OptionList = forwardRef<HTMLUListElement, OptionListProps>(
  ({ variant, color, size, className, children, onOptionSelect, selectedValue, ...rest }, ref) => {
    const clonedChildren = React.Children.map(children, child => {
      if (!React.isValidElement(child)) return child;

      // 🔥 OptionItemProps를 기반으로 element 타입 좁히기
      const element = child as React.ReactElement<OptionItemProps>;

      const value = element.props.value;
      const disabled = element.props['aria-disabled'] === true;

      return React.cloneElement(element, {
        role: 'option',
        'aria-disabled': disabled,

        onClick: (e: React.MouseEvent<HTMLLIElement>) => {
          element.props.onClick?.(e);
          if (!disabled) onOptionSelect?.(value);
        },
      });
    });

    return (
      <ul
        ref={ref}
        role='listbox'
        {...rest}
        className={clsx(
          styles['option-list'],
          `variant--${variant}`,
          `color--${color}`,
          `size--${size}`,
          className,
        )}
      >
        {clonedChildren}
      </ul>
    );
  },
);

OptionList.displayName = 'OptionList';

export default OptionList;
