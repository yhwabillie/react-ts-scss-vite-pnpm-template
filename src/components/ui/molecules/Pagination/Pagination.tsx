import { useMemo } from 'react';
import Styles from '@/components/ui/molecules/Pagination/Pagination.module.scss';

interface PaginationProps {
  currentPage: number; // 현재 페이지
  totalPages: number; // 전체 페이지 수
  onPageChange: (page: number) => void; // 페이지 변경 핸들러
  isMobileUI?: boolean; // 모바일 전용 간결 UI 여부
  siblingCount?: number; // 현재 페이지 주변에 보여줄 번호 개수
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isMobileUI = false,
  siblingCount = 1,
}: PaginationProps) => {
  // 페이지 번호 배열 생성 로직
  const pageRange = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3; // 시작, 끝, 현재 주변
    if (totalNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return Array.from({ length: leftItemCount }, (_, i) => i + 1);
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
    }

    return Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
  }, [totalPages, siblingCount, currentPage]);

  if (totalPages <= 1) return null;

  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);

  return (
    <nav className={Styles['pagination-container']} aria-label='페이지 네비게이션'>
      {/* 1. 처음/이전 버튼 그룹 */}
      <div className={Styles['button-group']}>
        <button
          type='button'
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label='첫 페이지로 이동'
          className={Styles['nav-button']}
        >
          &laquo;
        </button>
        <button
          type='button'
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label='이전 페이지로 이동'
          className={Styles['nav-button']}
        >
          &lt;
        </button>
      </div>

      {/* 2. 페이지 번호 목록 (isMobileUI가 true면 숨김) */}
      {!isMobileUI && (
        <ol className={Styles['page-list']}>
          {pageRange.map(page => (
            <li key={page}>
              <button
                type='button'
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={currentPage === page ? Styles['active'] : ''}
                aria-label={`${page}번 페이지로 이동`}
              >
                {page}
              </button>
            </li>
          ))}
        </ol>
      )}

      {/* 3. 모바일 간결 UI (현재/전체 표시) */}
      {isMobileUI && (
        <div className={Styles['mobile-info']} aria-live='polite'>
          <strong>{currentPage}</strong> / {totalPages}
        </div>
      )}

      {/* 4. 다음/끝 버튼 그룹 */}
      <div className={Styles['button-group']}>
        <button
          type='button'
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label='다음 페이지로 이동'
          className={Styles['nav-button']}
        >
          &gt;
        </button>
        <button
          type='button'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label='마지막 페이지로 이동'
          className={Styles['nav-button']}
        >
          &raquo;
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
