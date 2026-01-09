import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/OptionList/OptionList.module.scss';
import type { OptionBase, OptionItemProps } from '../OptionItem/OptionItem';

export interface BaseProps extends Pick<OptionBase, 'id'> {
  variant: 'solid' | 'soft' | 'outline' | 'ghost';
  color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  selectedId?: string;
  className?: string;
  children: React.ReactNode;
  onOptionSelect?: (id: string, value: string) => void;
}

export type OptionListProps = BaseProps &
  Omit<React.HTMLAttributes<HTMLUListElement>, keyof BaseProps>;

const OptionList = forwardRef<HTMLUListElement, OptionListProps>(
  ({ id, variant, color, size, className, children, ...rest }, ref) => {
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
        <ul ref={ref} id={id} role='listbox' {...{ 'aria-label': rest['aria-label'] }}>
          {children}
        </ul>
      </div>
    );
  },
);

OptionList.displayName = 'OptionList';

export default OptionList;
