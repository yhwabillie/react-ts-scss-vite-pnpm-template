import Styles from './Tag.module.scss';

interface TagProps {
  children: React.ReactNode;
  /** 링크 주소가 있으면 <a> 태그로, 없으면 <span> 태그로 렌더링 */
  href?: string;
  /** 색상 스타일 (디자인 시스템에 따라 정의) */
  color?: 'default' | 'primary' | 'secondary' | 'outline';
  /** 아이콘 추가 (예: 해시태그 아이콘 등) */
  icon?: React.ReactNode;
  /** 추가적인 클래스명 */
  className?: string;
}

const Tag = ({ children, href, color = 'default', icon, className = '' }: TagProps) => {
  const tagProps = {
    className: `${Styles.tag} ${Styles[color]} ${className}`.trim(),
  };

  // 1. 링크가 있는 경우: <a> 태그로 렌더링 (웹 표준)
  if (href) {
    return (
      <a href={href} {...tagProps}>
        {icon && <span className={Styles.icon}>{icon}</span>}
        {children}
      </a>
    );
  }

  // 2. 링크가 없는 경우: <span> 태그로 렌더링
  return (
    <span {...tagProps}>
      {icon && <span className={Styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};

export default Tag;
