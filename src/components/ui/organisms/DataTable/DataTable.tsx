import { useId, type ReactNode } from 'react';
import Styles from './DataTable.module.scss';
import Checkbox from '../../atoms/Checkbox/Checkbox';

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
}

const DataTable = <T extends { id: string | number }>({
  caption,
  summary,
  columns,
  data,
  onSort,
  sortState,
  showCheckbox, // 추가됨
  selectedRows, // 추가됨
  onSelectRow, // 추가됨
  onSelectAll, // 추가됨
}: DataTableProps<T>) => {
  const tableId = useId();
  const summaryId = `${tableId}-summary`;

  // 1. 공평한 너비 분배를 위한 계산 (체크박스 포함 여부 고려)
  const totalCols = showCheckbox ? columns.length + 1 : columns.length;
  const minWidthPercentage = `${100 / totalCols}%`;

  const getSortIcon = (key: string) => {
    if (sortState?.key !== key) return '↕️';
    if (sortState.order === 'asc') return '↑';
    if (sortState.order === 'desc') return '↓';
    return '↕️';
  };

  const isAllSelected = data.length > 0 && selectedRows?.size === data.length;

  const getAriaSort = (key: string): 'ascending' | 'descending' | 'none' | undefined => {
    if (sortState?.key !== key) return undefined;
    if (sortState.order === 'asc') return 'ascending';
    if (sortState.order === 'desc') return 'descending';
    return 'none';
  };

  return (
    <div
      className={Styles['table-container']}
      role='region'
      aria-labelledby={`${tableId}-caption`}
      tabIndex={0}
    >
      {summary && (
        <span id={summaryId} className='sr-only'>
          {summary}
        </span>
      )}
      <table className={Styles['data-table']} aria-describedby={summary ? summaryId : undefined}>
        <caption id={`${tableId}-caption`} className={Styles['table-caption']}>
          {caption}
          {summary && <span className='sr-only'>: {summary}</span>}
        </caption>

        <colgroup>
          {/* ✅ 업데이트: 체크박스용 col 추가 */}
          {showCheckbox && <col style={{ width: '70px' }} />}
          {columns.map((col, index) => (
            <col
              key={index}
              style={{
                width: col.width || 'auto',
                minWidth: col.minWidth || (col.width ? 'auto' : minWidthPercentage), // ✅ 업데이트: 자동 최소 너비 로직
              }}
            />
          ))}
        </colgroup>
        <thead>
          <tr>
            {/* ✅ 수정: 조건부 렌더링 블록 사이의 공백 제거 (Hydration 에러 방지) */}
            {showCheckbox && (
              <th scope='col'>
                <Checkbox
                  as='label'
                  color='primary'
                  size='md'
                  id='chk-all'
                  checked={isAllSelected}
                  onChange={e => onSelectAll?.(e.target.checked)}
                  aria-label='전체 행 선택'
                />
              </th>
            )}
            {columns.map(col => (
              <th key={String(col.key)} scope='col' aria-sort={getAriaSort(String(col.key))}>
                <div className={Styles['header-cell']}>
                  {col.header}
                  {col.sortable && onSort && (
                    <button
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
                    >
                      {getSortIcon(String(col.key))}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {/* ✅ 수정: 체크박스와 데이터 셀 사이의 공백 텍스트 노드 제거 */}
                {showCheckbox && (
                  <td>
                    <Checkbox
                      as='label'
                      color='primary'
                      size='md'
                      id={`chk-${row.id}`}
                      checked={selectedRows?.has(row.id) || false}
                      onChange={() => onSelectRow?.(row.id)}
                      aria-label={`${row.id}번 행 선택`}
                    />
                  </td>
                )}
                {columns.map((col, colIndex) => {
                  const value = row[col.key as keyof T];
                  // ✅ 해결 2: content가 ReactNode임을 명시하거나, 렌더링 가능한 형태로 변환
                  const content = col.render ? col.render(value, row) : (value as ReactNode);

                  if (colIndex === 0 && !showCheckbox) {
                    return (
                      <th key={String(col.key)} scope='row'>
                        {content}
                      </th>
                    );
                  }
                  return <td key={String(col.key)}>{content}</td>;
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={totalCols} style={{ textAlign: 'center', padding: '2rem' }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
