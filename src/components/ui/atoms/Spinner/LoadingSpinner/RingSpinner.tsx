import React from 'react';
import styles from '@/components/ui/atoms/Spinner/Spinner.module.scss';

export type RingSpinnerBaseProps = {
  variant: 'open-ring' | 'closed-ring';
  color:
    | 'primary'
    | 'primary-solid'
    | 'primary-soft'
    | 'secondary'
    | 'secondary-solid'
    | 'secondary-soft'
    | 'tertiary'
    | 'tertiary-solid'
    | 'tertiary-soft';

  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type RingSpinnerProps = RingSpinnerBaseProps;

const RingSpinner: React.FC<RingSpinnerProps> = ({ variant, color, size, ...props }) => {
  const ringSpinnerProps = props as RingSpinnerProps;

  return (
    <div
      className={`${styles['spinner']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`}`}
      role='status'
      {...ringSpinnerProps}
    >
      <span className='sr-only'>로딩 중</span>
      <svg viewBox='0 0 50 50'>
        {/* 트랙 배경 */}
        <circle className='track' cx='25' cy='25' r='20'></circle>
        {/* 회전 색상 */}
        <circle className='path' cx='25' cy='25' r='20'></circle>
      </svg>
    </div>
  );
};

export default RingSpinner;
