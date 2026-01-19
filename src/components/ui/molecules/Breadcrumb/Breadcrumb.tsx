import type React from 'react';
import Styles from '@/components/ui/molecules/Breadcrumb/Breadcrumb.module.scss';
import Icon from '../../atoms/Icon/Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string; // 마지막 아이템은 링크가 없을 수 있음
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  color?: 'primary' | 'secondary' | 'tertiary';
  items: BreadcrumbItem[];
  separator?: string | React.ReactNode; // 커스텀 구분자
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const Breadcrumb = ({
  items,
  size = 'md',
  color = 'primary',
  ariaLabel = '보조 네비게이션(현재 위치)',
  separator = (
    <Icon
      name='chevron-right'
      className='icon'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  ),
}: BreadcrumbProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      className={`${Styles['breadcrumb']} size--${size} color--${color}`}
      aria-label={ariaLabel}
    >
      <ol className='breadcrumb__list'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className='breadcrumb__item'>
              {isLast ? (
                <span className='breadcrumb__current' aria-current='page'>
                  {item.icon}
                  <span className='breadcrumb__label'>{item.label}</span>
                </span>
              ) : (
                <>
                  <a href={item.href} className='breadcrumb__link'>
                    {item.icon}
                    <span className='breadcrumb__label'>{item.label}</span>
                  </a>
                  {separator}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
