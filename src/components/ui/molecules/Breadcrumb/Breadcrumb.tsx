import type React from 'react';
import Styles from '@/components/ui/molecules/Breadcrumb/Breadcrumb.module.scss';

export interface BreadcrumbItem {
  label: string;
  href?: string; // 마지막 아이템은 링크가 없을 수 있음
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string | React.ReactNode; // 커스텀 구분자
}

const Breadcrumbs = ({ items, separator = '>' }: BreadcrumbsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      className={Styles['breadcrumbs-nav']}
      aria-label='보조 네비게이션(현재 위치)' // 한국어 접근성 명칭
    >
      <ol className={Styles['breadcrumbs-list']}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={Styles['breadcrumb-item']}>
              {isLast ? (
                // 마지막 아이템은 링크 대신 현재 위치임을 명시
                <span className={Styles['current']} aria-current='page'>
                  {item.icon && <span className={Styles['icon']}>{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <>
                  <a href={item.href} className={Styles['link']}>
                    {item.icon && <span className={Styles['icon']}>{item.icon}</span>}
                    {item.label}
                  </a>
                  {/* 구분자는 보조공학기기가 읽지 않도록 aria-hidden 처리 */}
                  <span className={Styles['separator']} aria-hidden='true'>
                    {separator}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
