import Styles from '@/components/ui/atoms/Skeleton/Skeleton.module.scss';
import type { CSSProperties } from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
  style?: CSSProperties;
}

const Skeleton = ({
  variant = 'text',
  width,
  height,
  radius,
  className = '',
  style: propsStyle,
}: SkeletonProps) => {
  // 기본 레이아웃 + 외부 스타일 병합
  const skeletonStyle: CSSProperties = {
    width,
    height,
    // 원형은 radius보다 50% 우선
    borderRadius: variant === 'circle' ? '50%' : radius,
    ...propsStyle,
  };

  return (
    <div
      className={`${Styles.skeleton} ${Styles[variant]} ${className}`}
      style={skeletonStyle}
      aria-hidden='true'
    />
  );
};

export default Skeleton;
