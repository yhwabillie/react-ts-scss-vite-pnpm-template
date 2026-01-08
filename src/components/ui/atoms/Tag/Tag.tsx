import Styles from './Tag.module.scss';
import Icon from '../../atoms/Icon/Icon'; // Icon 컴포넌트 가정
import { forwardRef } from 'react';

interface TagProps {
  href?: string;
  variant?: 'solid' | 'outline';
  shape?: 'square' | 'rounded' | 'pill';
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  label: string;
  target?: '_blank';
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Tag = forwardRef<HTMLAnchorElement & HTMLDivElement & HTMLButtonElement, TagProps>(
  (
    {
      href,
      variant = 'solid',
      shape = 'rounded',
      color = 'primary',
      size = 'md',
      startIcon,
      endIcon,
      className = '',
      label,
      onDelete,
      target = '_blank',
    },
    ref,
  ) => {
    // 공통 클래스 및 데이터 속성
    const tagClassName =
      `${Styles['tag']} variant--${variant} shape--${shape} color--${color} size--${size} ${onDelete ? Styles['tag--deletable'] : ''} ${className}`.trim();

    // 1. 네비게이션용 (Link)
    if (href) {
      return (
        <a ref={ref} href={href} className={tagClassName} target={target}>
          {startIcon}
          <span className='tag__label'>{label}</span>
          {endIcon}
        </a>
      );
    }

    // 2. 삭제 가능한 태그 (Action/Deletable)
    if (onDelete) {
      return (
        <button
          ref={ref}
          type='button'
          className={tagClassName}
          aria-label={`삭제 ${label} 태그`}
          onClick={onDelete}
        >
          {startIcon}
          <span className='tag__label'>{label}</span>
          {endIcon}
        </button>
      );
    }

    // 3. 정적 표시용 (Static)
    return (
      <div ref={ref} className={tagClassName}>
        {startIcon}
        <span className='tag__label'>{label}</span>
        {endIcon}
      </div>
    );
  },
);

export default Tag;
