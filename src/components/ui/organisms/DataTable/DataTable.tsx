import clsx from 'clsx';
import { useId, type ReactNode } from 'react';
import Checkbox from '@/components/ui/atoms/Checkbox/Checkbox';
import Icon from '@/components/ui/atoms/Icon/Icon';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import Styles from '@/components/ui/organisms/DataTable/DataTable.module.scss';

export type SortOrder = 'asc' | 'desc' | 'none';

export interface SortState {
  key: string;
  order: SortOrder;
}

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  minWidth?: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: string | number }> {
  variant?: 'solid' | 'outline';
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  caption: string;
  summary?: string;
  columns: Column<T>[];
  data: T[];
  onSort?: (key: keyof T, order: SortOrder) => void;
  sortState?: SortState;
  showCheckbox?: boolean;
  selectedRows?: Set<number | string>;
  onSelectRow?: (id: number | string) => void;
  onSelectAll?: (isAll: boolean) => void;
  notices?: T[];
}

const DataTable = <T extends { id: string | number }>({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  caption,
  summary,
  columns,
  data,
  onSort,
  sortState,
  showCheckbox,
  selectedRows,
  onSelectRow,
  onSelectAll,
  notices,
}: DataTableProps<T>) => {
  const tableId = useId();
  const summaryId = `${tableId}-summary`;

  // 공평한 너비 분배를 위한 계산 (체크박스 포함 여부 고려)
  const totalCols = showCheckbox ? columns.length + 1 : columns.length;
  const minWidthPercentage = `${100 / totalCols}%`;

  const getSortIcon = (key: string) => {
    if (sortState?.key !== key) return <Icon name='arrow-down-up' strokeWidth={2.5} />;
    if (sortState.order === 'asc') return <Icon name='arrow-up-narrow-wide' strokeWidth={2.5} />;
    if (sortState.order === 'desc') return <Icon name='arrow-down-wide-narrow' strokeWidth={2.5} />;
    return <Icon name='arrow-down-up' strokeWidth={2.5} />;
  };

  // 현재 눈앞의 데이터가 모두 Set에 있는지 확인
  const isAllSelected = data.length > 0 && data.every(row => selectedRows?.has(row.id));

  const getAriaSort = (key: string): 'ascending' | 'descending' | 'none' | undefined => {
    if (sortState?.key !== key) return undefined;
    if (sortState.order === 'asc') return 'ascending';
    if (sortState.order === 'desc') return 'descending';
    return 'none';
  };

  return (
    <div
      className={clsx(`${Styles['data-table']} variant--${variant} color--${color} size--${size}`)}
      role='region'
      aria-labelledby={`${tableId}-caption`}
      tabIndex={0}
    >
      {summary && (
        <span id={summaryId} className='sr-only'>
          {summary}
        </span>
      )}
      <table className='data-table__root' aria-describedby={summary ? summaryId : undefined}>
        <caption id={`${tableId}-caption`} className='data-table__caption'>
          {caption}
          {summary && <span className='sr-only'>: {summary}</span>}
        </caption>
        <colgroup>
          {showCheckbox && <col style={{ width: '60px' }} />}
          {columns.map((col, index) => (
            <col
              key={index}
              style={{
                width: col.width || 'auto',
                minWidth: col.minWidth || (col.width ? 'auto' : minWidthPercentage),
              }}
            />
          ))}
        </colgroup>
        <thead>
          <tr>
            {showCheckbox && (
              <th scope='col'>
                <div className='data-table__checkbox-cell'>
                  <Checkbox
                    as='label'
                    id='chk-all'
                    color={color}
                    size='md'
                    checked={isAllSelected}
                    onChange={e => onSelectAll?.(e.target.checked)}
                    aria-label='전체 행 선택'
                  />
                </div>
              </th>
            )}
            {columns.map(col => (
              <th key={String(col.key)} scope='col' aria-sort={getAriaSort(String(col.key))}>
                <div className='data-table__thead-cell'>
                  {col.header}
                  {col.sortable && onSort && (
                    <IconButton
                      variant='ghost'
                      size='xs'
                      shape='rounded'
                      type='button'
                      onClick={() => {
                        const nextOrder =
                          sortState?.key === col.key
                            ? sortState.order === 'asc'
                              ? 'desc'
                              : sortState.order === 'desc'
                                ? 'none'
                                : 'asc'
                            : 'asc';
                        onSort(col.key as keyof T, nextOrder);
                      }}
                      aria-label={`${col.header} 정렬`}
                      icon={getSortIcon(String(col.key))}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 공지사항 데이터 루프 */}
          {notices &&
            notices.length > 0 &&
            notices.map((notice, index) => (
              <tr key={`notice-${notice.id || index}`} className='data-table__notice-row'>
                <td>
                  <div className='data-table__notice-cell'>
                    <Icon
                      name='megaphone'
                      className='icon'
                      size={size}
                      strokeWidth={2.5}
                      aria-label='공지'
                    />
                  </div>
                </td>

                {columns.map((col, idx) => {
                  // '번호' 컬럼(idx 0)은 이미 위에서 아이콘 td가 자리를 차지했으므로 렌더링하지 않음
                  if (idx === 0) return null;

                  const value = notice[col.key as keyof T];
                  return (
                    <td key={String(col.key)}>
                      {col.render ? col.render(value, notice) : (value as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))}

          {/* 일반 데이터 */}
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {showCheckbox && (
                  <td>
                    <div className='data-table__checkbox-cell'>
                      <Checkbox
                        as='label'
                        color={color}
                        size='md'
                        id={`chk-${row.id}`}
                        checked={selectedRows?.has(row.id) || false}
                        onChange={() => onSelectRow?.(row.id)}
                        aria-label={`${row.id}번 행 선택`}
                      />
                    </div>
                  </td>
                )}
                {columns.map((col, colIndex) => {
                  const value = row[col.key as keyof T];
                  const content = col.render ? col.render(value, row) : (value as ReactNode);

                  return <td key={String(col.key)}>{content}</td>;
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={totalCols}>
                <div className='data-table__empty-state'>데이터가 없습니다.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
