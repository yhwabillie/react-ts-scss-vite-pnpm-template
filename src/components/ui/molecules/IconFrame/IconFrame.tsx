import clsx from 'clsx';
import type React from 'react';
import styles from '@/components/ui/molecules/IconFrame/IconFrame.module.scss';

interface IconFrameProps {
  shape?: 'rounded' | 'square' | 'pill';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const IconFrame = ({ shape, color, size, children, className }: IconFrameProps) => {
  return (
    <div
      className={clsx(
        styles['icon-frame'],
        `color--${color}`,
        `size--${size}`,
        `shape--${shape}`,
        className,
      )}
      aria-hidden={true}
    >
      {children}
    </div>
  );
};

export default IconFrame;
