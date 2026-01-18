import Styles from './Tag.module.scss';
import Icon from '../../atoms/Icon/Icon';
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
    // 공통 클래스 구성
    const tagClassName =
      `${Styles['tag']} variant--${variant} shape--${shape} color--${color} size--${size} ${onDelete ? Styles['tag--deletable'] : ''} ${className}`.trim();

    // 링크 태그 (네비게이션)
    if (href) {
      return (
        <a ref={ref} href={href} className={tagClassName} target={target}>
          {startIcon}
          <span className='tag__label'>{label}</span>
          {endIcon}
        </a>
      );
    }

    // 삭제 가능한 태그 (action)
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

    // 정적 태그
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
