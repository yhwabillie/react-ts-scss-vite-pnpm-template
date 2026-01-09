import React, { type RefObject } from 'react';
import styles from '@/components/ui/molecules/IconButton/IconButton.module.scss';
import clsx from 'clsx';

export type IconButtonBaseProps = {
  ref?: RefObject<HTMLButtonElement | null>;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rounded' | 'square' | 'pill';
  icon?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  href?: string;
  target?: '_blank';
  ariaLabel?: string;
};

type ButtonProps = IconButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton: React.FC<ButtonProps> = ({
  as: Component = 'button',
  variant,
  color,
  size,
  shape,
  icon,
  className,
  href,
  target,
  ariaLabel,
  ...props
}) => {
  return (
    <Component
      className={clsx(
        styles['btn'],
        `variant--${variant}`,
        `color--${color}`,
        `size--${size}`,
        `shape--${shape}`,
        className,
      )}
      aria-label={ariaLabel}
      href={href}
      target={target}
      {...props}
    >
      {icon}
    </Component>
  );
};

export default IconButton;
