import DataTable, { type Column } from '../organisms/DataTable/DataTable';
import Style from './ComponentInventoryProps.module.scss';

// 1. itemsType에 T 전달
interface ItemsType<T extends { id: string | number }> {
  subtitle: string;
  columns: Column<T>[];
  data: T[];
}

// 2. Props에서도 T를 받아 ItemsType에 넘겨줌
interface ComponentInventoryProps<T extends { id: string | number }> {
  title?: string;
  items: ItemsType<T>[];
}

const ComponentInventory = <T extends { id: string | number }>({
  title,
  items,
}: ComponentInventoryProps<T>) => {
  return (
    <section className={Style['component-inventory']}>
      <h2 className='component-inventory__title'>{title}</h2>

      {items.map((item, idx) => (
        <div
          key={idx}
          id={idx === 0 ? 'component-inventory' : undefined}
          className='component-inventory__item'
        >
          <h3 className='component-inventory__item-title'>{item.subtitle}</h3>
          <DataTable
            size='md'
            caption='사용자 목록'
            summary='시스템에 등록된 전체 사용자 정보를 나타내는 표입니다.'
            columns={item.columns}
            data={item.data}
          />
        </div>
      ))}
    </section>
  );
};

export default ComponentInventory;
