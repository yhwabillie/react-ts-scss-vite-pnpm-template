import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/Switch/Switch.module.scss';
import Icon from '../../atoms/Icon/Icon';

type BaseProps = {
  variant:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  defaultChecked?: boolean;
  disabled?: boolean;
  id: string;
  className?: string;
  children?: React.ReactNode;
};

type SwitchProps = BaseProps & Omit<React.HTMLAttributes<HTMLLabelElement>, keyof BaseProps>;

const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ variant, size, defaultChecked, disabled, id, className, children }, ref) => {
    const [checked, setChecked] = useState(defaultChecked);

    return (
      <label
        ref={ref}
        className={clsx(
          `${styles['switch']} ${`variant--${variant}`} ${`size--${size}`}`,
          className,
        )}
        htmlFor={id}
      >
        <input
          type='checkbox'
          id={id}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={e => setChecked(e.target.checked)}
        />

        <div className='label'>
          <span className='track'>
            <span className='handle'>
              <Icon
                name={checked ? 'check' : 'x'}
                className='icon'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </span>
          </span>
          {children}
        </div>
      </label>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
