import { forwardRef } from 'react';
import clsx from 'clsx';
import Style from './FractionIndicator.module.scss';

interface FractionIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'solid' | 'outline';
  color?: 'primary' | 'secondary' | 'tertiary';
}

const FractionIndicator = forwardRef<HTMLSpanElement, FractionIndicatorProps>(
  ({ className, size = 'md', variant = 'solid', color = 'primary', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          `${Style['fraction-indicator']} color--${color} variant--${variant} size--${size}`,
          className,
        )}
        {...props}
      />
    );
  },
);

FractionIndicator.displayName = 'FractionIndicator';

export default FractionIndicator;
