import { useMemo } from 'react';
import Styles from '@/components/ui/molecules/Pagination/Pagination.module.scss';
import IconButton from '../IconButton/IconButton';
import Icon from '../../atoms/Icon/Icon';
import Button from '../Button/Button';
import IconFrame from '../IconFrame/IconFrame';
import clsx from 'clsx';

interface PaginationProps {
  shape?: 'square' | 'rounded' | 'pill';
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isMobileUI?: boolean;
  siblingCount?: number;
  className?: string;
}

const DOTS = '...'; // 말줄임 식별자

const Pagination = ({
  shape = 'rounded',
  color = 'primary',
  size = 'md',
  currentPage,
  totalPages,
  onPageChange,
  isMobileUI = false,
  siblingCount = 1,
  className,
}: PaginationProps) => {
  // 페이지 배열 생성 (말줄임 포함)
  const pageRange = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 5;

    if (totalNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    // Case 1: 오른쪽만 말줄임
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 2: 왼쪽만 말줄임
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [1, DOTS, ...rightRange];
    }

    // Case 3: 양쪽 말줄임
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [1, DOTS, ...middleRange, DOTS, totalPages];
    }

    return [];
  }, [totalPages, siblingCount, currentPage]);

  if (totalPages <= 1) return null;

  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);

  // 공통 버튼 속성
  const commonProps = { shape, color, size, type: 'button' as const };

  // storybook 상태 클래스: 일반 클래스만
  const filteredClassName = useMemo(() => {
    if (!className) return '';

    return className
      .split(' ')
      .filter(name => {
        // 1. 'pseudo-'가 아니면 통과
        if (!name.startsWith('pseudo-')) return true;

        // 2. 'pseudo-hover'는 통과
        return name === 'pseudo-hover';
      })
      .join(' ');
  }, [className]);

  // storybook 상태 클래스: pseudo 전용
  const pseudoClassName = useMemo(() => {
    if (!className) return '';

    return className
      .split(' ')
      .filter(name => name.startsWith('pseudo-'))
      .join(' ');
  }, [className]);

  return (
    <nav
      className={clsx(`${Styles['pagination']} color--${color} size--${size}`, filteredClassName)}
      aria-label='페이지 네비게이션'
    >
      {/* 1. 처음/이전 버튼 그룹 */}
      <div className='pagination__btn-group'>
        <IconButton
          {...commonProps}
          variant='outline'
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label='첫 페이지로 이동'
          icon={<Icon name='chevrons-left' strokeWidth={2.5} />}
          className={pseudoClassName}
        />
        <IconButton
          {...commonProps}
          variant='outline'
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label='이전 페이지로 이동'
          icon={<Icon name='chevron-left' strokeWidth={2.5} />}
          className={pseudoClassName}
        />
      </div>

      {/* 2. 페이지 번호 목록 */}
      {!isMobileUI && (
        <ol className='pagination__page-list'>
          {pageRange.map((page, index) => {
            if (page === DOTS) {
              return (
                <li key={`dots-${index}`} className={Styles['pagination__dots']} aria-hidden='true'>
                  <IconFrame size={size} color={color}>
                    <Icon name='ellipsis' className='icon' strokeWidth={2.5} size={size} />
                  </IconFrame>
                </li>
              );
            }

            return (
              <li key={page}>
                <Button
                  {...commonProps}
                  variant={currentPage === page ? 'solid' : 'ghost'}
                  onClick={() => onPageChange(Number(page))}
                  aria-current={currentPage === page ? 'page' : undefined}
                  aria-label={`${page}번 페이지로 이동`}
                  className={pseudoClassName}
                >
                  {page}
                </Button>
              </li>
            );
          })}
        </ol>
      )}

      {/* 3. 모바일 간결 UI */}
      {isMobileUI && (
        <div className='pagination__mobile-info' aria-live='polite'>
          <strong className='pagination__mobile-info-current'>{currentPage} </strong>
          <span className='pagination__mobile-info-total'>/ {totalPages}</span>
        </div>
      )}

      {/* 4. 다음/끝 버튼 그룹 */}
      <div className='pagination__btn-group'>
        <IconButton
          {...commonProps}
          variant='outline'
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label='다음 페이지로 이동'
          icon={<Icon name='chevron-right' strokeWidth={2.5} />}
          className={pseudoClassName}
        />
        <IconButton
          {...commonProps}
          variant='outline'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label='마지막 페이지로 이동'
          icon={<Icon name='chevrons-right' strokeWidth={2.5} />}
          className={pseudoClassName}
        />
      </div>
    </nav>
  );
};

export default Pagination;
