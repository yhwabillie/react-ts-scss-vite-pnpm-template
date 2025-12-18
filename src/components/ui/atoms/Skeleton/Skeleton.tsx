import React from 'react';
import Styles from '@/components/ui/atoms/Skeleton/Skeleton.module.scss';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton = ({ variant = 'text', width, height, className = '' }: SkeletonProps) => {
  const style = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${Styles.skeleton} ${Styles[variant]} ${className}`}
      style={style}
      /* ✅ 웹 접근성 포인트: 
         스켈레톤 자체는 시각적 보조 장치이므로 스크린 리더가 읽지 않게 함 */
      aria-hidden='true'
    />
  );
};

export default Skeleton;
