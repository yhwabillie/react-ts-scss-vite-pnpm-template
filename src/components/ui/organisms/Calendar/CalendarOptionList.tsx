import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/organisms/Calendar/CalendarOptionList.module.scss';
import type { OptionBase } from '../../molecules/OptionItem/OptionItem';

export interface BaseProps extends Pick<OptionBase, 'id'> {
  variant: 'solid' | 'outline';
  color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  selectedId?: string;
  className?: string;
  children: React.ReactNode;
  onOptionSelect?: (id: string, value: string) => void;
}

export type OptionListProps = BaseProps &
  Omit<React.HTMLAttributes<HTMLUListElement>, keyof BaseProps>;

const CalendarOptionList = forwardRef<HTMLUListElement, OptionListProps>(
  ({ id, variant, color, className, children, ...rest }, ref) => {
    return (
      <div
        className={clsx(
          styles['option-list'],
          `variant--${variant}`,
          `color--${color}`,
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

CalendarOptionList.displayName = 'CalendarOptionList';

export default CalendarOptionList;
