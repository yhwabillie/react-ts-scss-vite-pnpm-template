import DataTable, { type Column } from '../organisms/DataTable/DataTable';
import Style from './GuideTable.module.scss';

interface GuideTableProps<T extends { id: string | number }> {
  id?: string;
  title?: string;
  columns: Column<T>[];
  data: T[];
}

// 컴포넌트 선언부에서도 동일하게 제약 조건을 추가합니다.
const GuideTable = <T extends { id: string | number }>({
  id,
  title,
  columns,
  data,
}: GuideTableProps<T>) => {
  return (
    <section id={id} className={Style['guide-table']}>
      <h2 className='guide-table__title'>{title}</h2>

      <DataTable
        size='sm'
        caption={title || '가이드 데이터 표'}
        summary='시스템 정보를 나타내는 표입니다.'
        columns={columns}
        data={data}
      />
    </section>
  );
};

export default GuideTable;
