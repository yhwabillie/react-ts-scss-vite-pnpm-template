import React from 'react';
import styles from '@/components/ui/atoms/Spinner/Spinner.module.scss';

type BaseProps = {
  variant: 'open-ring' | 'closed-ring';
  color: 'primary' | 'secondary' | 'tertiary';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type SpinnerProps = BaseProps;

const Spinner: React.FC<SpinnerProps> = ({
  variant = 'closed-ring',
  color = 'primary',
  size = 'md',
  ...props
}) => {
  const spinnerProps = props as SpinnerProps;

  return (
    <div
      className={`${styles['spinner']} ${`variant--${variant}`} ${`color--${color}`} ${`size--${size}`}`}
      role='status'
      {...spinnerProps}
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

export default Spinner;
