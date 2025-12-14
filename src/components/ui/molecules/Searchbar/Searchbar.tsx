import React, { forwardRef } from 'react';
import styles from '@/components/ui/molecules/Searchbar/Searchbar.module.scss';
import clsx from 'clsx';
import type { Size, Variant, Color, Shape } from '@/types/design/design-tokens.types';
import type { InputA11yProps } from '@/types/a11y/a11y-roles.types';
import Icon from '../../atoms/Icon/Icon';
import IconButton from '../IconButton/IconButton';

interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
  shape: Shape;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof InputA11yProps
>;

type SearchbarActionType = 'submit' | 'clear' | 'toggle';

interface SearchbarAction {
  type: SearchbarActionType;
  icon: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface SearchbarProps extends StyleProps, InputA11yProps, NativeDivProps {
  id?: string;
  name?: string;
  labelText?: string;
  placeholder?: string;
  disabled?: boolean;
  actions?: {
    submitAction?: SearchbarAction;
    utilityAction?: SearchbarAction;
  };
}

const defaultAriaLabel: Record<SearchbarActionType, string> = {
  submit: '검색',
  clear: '검색어 지우기',
  toggle: '검색 옵션 열기',
};

const Searchbar = forwardRef<HTMLDivElement, SearchbarProps>(
  (
    { variant, color, size, shape, id, placeholder, disabled, name, role, labelText, actions },
    ref,
  ) => (
    <div
      ref={ref}
      className={clsx(`${styles['searchbar']} variant--${variant} color--${color} size--${size}`)}
    >
      <label htmlFor={id} className='sr-only'>
        {labelText}
      </label>
      <input
        id={id}
        type='search'
        name={name}
        role={role}
        placeholder={placeholder}
        aria-autocomplete='list'
        aria-haspopup='listbox'
        aria-controls='search-listbox'
        aria-expanded={false}
        disabled={disabled}
      />

      {actions?.utilityAction && (
        <IconButton
          variant='ghost'
          color={color}
          size={size}
          shape={shape}
          className='adorned-end'
          type='button'
          aria-label={
            actions.utilityAction.ariaLabel ?? defaultAriaLabel[actions.utilityAction.type]
          }
          disabled={actions.utilityAction.disabled}
          onClick={actions.utilityAction.onClick}
          icon={actions.utilityAction.icon}
        />
      )}

      {actions?.submitAction && (
        <IconButton
          variant='ghost'
          color={color}
          size={size}
          shape={shape}
          className='adorned-end'
          type='submit'
          aria-label={actions.submitAction.ariaLabel ?? defaultAriaLabel[actions.submitAction.type]}
          disabled={actions.submitAction.disabled}
          onClick={actions.submitAction.onClick}
          icon={actions.submitAction.icon}
        />
      )}
    </div>
  ),
);

Searchbar.displayName = 'Searchbar';

export default Searchbar;
