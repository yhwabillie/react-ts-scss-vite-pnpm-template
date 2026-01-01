import clsx from 'clsx';
import styles from '@/components/ui/atoms/Skeleton/CalendarSkeleton.module.scss';

interface CalendarSkeletonProps {
  className?: string;
}

const CalendarSkeleton = ({ className }: CalendarSkeletonProps) => {
  // 6행 7열 그리드 생성
  const rows = Array.from({ length: 6 });
  const cols = Array.from({ length: 7 });

  return (
    <>
      {rows.map((_, idx) => (
        <tr key={`${idx}-tr`}>
          {cols.map((_, idx) => (
            <td role='presentation' key={`${idx}-td`}>
              <span className={styles['skeleton-cell']}></span>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default CalendarSkeleton;
