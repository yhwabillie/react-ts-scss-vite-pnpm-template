import Styles from '@/components/ui/atoms/Badge/Badge.module.scss';

interface BadgeProps {
  children: React.ReactNode;
  /** 'status': 텍스트 기반 상태 표시, 'count': 숫자 기반 알림 표시 */
  variant?: 'status' | 'count';
  /** 색상 테마: 프로젝트의 디자인 시스템에 따라 확장 가능 */
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'gray';
  /** 접근성을 위한 추가 설명 (특히 숫자만 있는 count형에서 중요) */
  ariaLabel?: string;
  /** 아이콘이나 텍스트 옆에 겹쳐서 표시할지 여부 (count형에 주로 사용) */
  overlap?: boolean;
}

const Badge = ({
  children,
  variant = 'status',
  color = 'primary',
  ariaLabel,
  overlap = false,
}: BadgeProps) => {
  const badgeClassName = `
    ${Styles.badge} 
    ${Styles[variant]} 
    ${Styles[color]} 
    ${overlap ? Styles.overlap : ''}
  `.trim();

  return (
    <span
      className={badgeClassName}
      // 보조공학기기에 정보의 성격을 전달
      aria-label={ariaLabel}
      // 배지 자체가 텍스트 정보를 포함하고 ariaLabel이 없다면 스크린 리더가 children을 읽음
    >
      {children}
    </span>
  );
};

export default Badge;
