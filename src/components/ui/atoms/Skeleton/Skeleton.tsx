import Styles from '@/components/ui/atoms/Skeleton/Skeleton.module.scss';
import type { CSSProperties } from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
  style?: CSSProperties; // 외부에서 주입받는 스타일
}

const Skeleton = ({
  variant = 'text',
  width,
  height,
  radius,
  className = '',
  style: propsStyle, // 충돌 방지를 위해 이름을 propsStyle로 변경
}: SkeletonProps) => {
  // 기본 레이아웃 스타일과 외부 스타일 병합
  const skeletonStyle: CSSProperties = {
    width,
    height,
    // 원형(circle)일 경우 사용자가 radius를 넣어도 50%가 우선되도록 설계
    borderRadius: variant === 'circle' ? '50%' : radius,
    ...propsStyle, // 외부 스타일이 가장 나중에 오도록 하여 우선순위 보장
  };

  return (
    <div
      className={`${Styles.skeleton} ${Styles[variant]} ${className}`}
      style={skeletonStyle}
      aria-hidden='true' // 스켈레톤은 장식 요소이므로 스크린 리더에서 제외
    />
  );
};

export default Skeleton;
