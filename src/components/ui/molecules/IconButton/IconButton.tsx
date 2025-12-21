import React from 'react';
import styles from '@/components/ui/molecules/IconButton/IconButton.module.scss';
import clsx from 'clsx';

type BaseProps = {
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rounded' | 'square' | 'pill';
  icon?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  href?: string;
  target?: '_blank';
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
  href,
  target,
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
      href={href}
      target={target}
      {...props}
    >
      {icon}
    </Component>
  );
};

export default IconButton;
