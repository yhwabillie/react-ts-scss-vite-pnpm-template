import { forwardRef } from 'react';
import clsx from 'clsx';
import Style from './FractionIndicator.module.scss';

interface FractionIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const FractionIndicator = forwardRef<HTMLSpanElement, FractionIndicatorProps>(
  ({ className, ...props }, ref) => {
    return <span ref={ref} className={clsx(Style['fraction-indicator'], className)} {...props} />;
  },
);

FractionIndicator.displayName = 'FractionIndicator';

export default FractionIndicator;
