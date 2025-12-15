import React from 'react';
import styles from '@/components/ui/molecules/IconButton/IconButton.module.scss';
import clsx from 'clsx';

type BaseProps = {
  variant: 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape: 'rounded' | 'square' | 'pill';
  icon: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton: React.FC<ButtonProps> = ({
  as: Component = 'button',
  variant,
  color,
  size,
  shape,
  icon,
  className,
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
      {...props}
    >
      {icon}
    </Component>
  );
};

export default IconButton;
