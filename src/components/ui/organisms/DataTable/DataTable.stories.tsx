import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTable, {
  type Column,
  type SortOrder,
} from '@/components/ui/organisms/DataTable/DataTable';
import { GuideCell, GuideGroup, GuideWrapper } from '@/components/ui/guide/Guide';
import Badge from '@/components/ui/atoms/Badge/Badge';
import Icon from '@/components/ui/atoms/Icon/Icon';

// 테스트용 데이터 타입 정의
interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface MockDataTableItem {
  [key: string]: string | number | boolean | undefined;
  id: string | number;
  title: string;
  author: string;
  date: string;
  views: number;
  href: string;
  commentCount: number;
  hasFile: boolean;
  isSecret?: boolean;
}

const meta: Meta<typeof DataTable> = {
  title: 'UI/Organisms/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**DataTable**은 대량의 정형 데이터를 체계적으로 나열하고 조작하기 위한 핵심 Organism입니다. <br /><br />' +
          '• **Semantic Structure**: `caption`과 `summary`를 통해 표의 목적을 명확히 전달하며, 표준 HTML table 태그를 준수합니다. <br />' +
          '• **Interaction Logic**: 컬럼 정렬(Sort), 행 선택(Selection), 공지사항 고정(Notices) 등 비즈니스 로직을 수용합니다. <br />' +
          '• **Custom Rendering**: `render` 함수를 통해 각 셀 내부에 배지, 아이콘, 링크 등 다양한 컴포넌트를 주입할 수 있습니다.',
      },
    },
  },
  argTypes: {
    // [Style] 카테고리
    variant: {
      description: '표의 전형적인 외형 스타일을 결정합니다.',
      control: { type: 'inline-radio' },
      options: ['solid', 'outline'],
      table: {
        category: 'Style',
        type: { summary: 'solid | outline' },
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      description: '테마 색상을 적용합니다. (브랜드 아이덴티티 반영)',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      table: {
        category: 'Style',
        type: { summary: 'primary | secondary | tertiary' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: '테이블 내부 요소의 크기와 여백을 설정합니다.',
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Style',
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    // [Data] 카테고리
    caption: {
      description: '표의 제목입니다. 스크린 리더에서 표를 식별하는 데 사용됩니다.',
      control: { type: 'text' },
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    summary: {
      description: '표의 구조나 목적에 대한 요약 설명입니다. (접근성 향상)',
      control: { type: 'text' },
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    columns: {
      description: '열(Column)의 정의입니다. 각 열의 헤더명과 렌더링 방식 등을 설정합니다.',
      control: { type: 'object' },
      table: {
        category: 'Data',
        type: { summary: 'Column<T>[]' },
      },
    },
    data: {
      description: '표에 출력될 실제 데이터 배열입니다.',
      control: { type: 'object' },
      table: {
        category: 'Data',
        type: { summary: 'T[]' },
      },
    },
    notices: {
      description: '표 최상단에 고정되는 공지사항 성격의 데이터입니다.',
      control: { type: 'object' },
      table: {
        category: 'Data',
        type: { summary: 'T[]' },
      },
    },
    // [Selection & State] 카테고리
    showCheckbox: {
      description: '다중 선택을 위한 체크박스 열을 표시할지 여부입니다.',
      control: { type: 'boolean' },
      table: {
        category: 'Selection & State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    selectedRows: {
      description: '현재 선택된 행의 ID들을 담고 있는 Set 객체입니다.',
      control: { type: 'object' },
      table: {
        category: 'Selection & State',
        type: { summary: 'Set<string | number>' },
      },
    },
    sortState: {
      description: '현재 정렬 상태(정렬 키, 정렬 방향) 정보를 담고 있습니다.',
      control: { type: 'object' },
      table: {
        category: 'Selection & State',
        type: { summary: 'SortState' },
      },
    },
    // [Events] 카테고리
    onSort: {
      description: '컬럼 헤더를 클릭하여 정렬을 수행할 때 실행되는 함수입니다.',
      action: 'onSort',
      table: {
        category: 'Events',
        type: { summary: '(key: keyof T, order: SortOrder) => void' },
      },
    },
    onSelectRow: {
      description: '개별 행의 체크박스를 클릭했을 때 실행되는 함수입니다.',
      action: 'onSelectRow',
      table: {
        category: 'Events',
        type: { summary: '(id: string | number) => void' },
      },
    },
    onSelectAll: {
      description: '전체 선택 체크박스를 클릭했을 때 실행되는 함수입니다.',
      action: 'onSelectAll',
      table: {
        category: 'Events',
        type: { summary: '(isAll: boolean) => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<MockUser>>;

// 목업 데이터 정의
const MOCK_USER: MockUser[] = [
  { id: 1, name: 'Gemini', email: 'gemini@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'inactive' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active' },
];

const MOCK_NOTICES: MockDataTableItem[] = [
  {
    id: 'notice-1',
    title: '[공지] 서비스 정기 점검 안내 및 이용 제한 관련 긴급 공지사항입니다 (1/10)',
    author: '관리자',
    date: '2026-01-01',
    views: 1542,
    href: '/notice/1',
    commentCount: 15,
    hasFile: true,
  },
  {
    id: 'notice-2',
    title: '[안내] 2026년 상반기 디자인 시스템 업데이트 로드맵 공유',
    author: '운영자',
    date: '2026-01-02',
    views: 840,
    href: '/notice/2',
    commentCount: 8,
    hasFile: false,
  },
];

const MOCK_BOARD: MockDataTableItem[] = [
  {
    id: 10,
    title:
      '제목이 매우 길어서 한 줄을 넘어가고 다음 칸을 가릴 정도로 길게 작성된 게시글의 제목입니다. 말줄임표 처리가 필요합니다.',
    author: '김철수',
    date: '2026-01-04',
    views: 45,
    href: '/board/10',
    commentCount: 155,
    isSecret: true,
    hasFile: false,
  },
  {
    id: 9,
    title: '디자인 시스템 가이드',
    author: '이영희',
    date: '2026-01-02',
    views: 210,
    href: '/board/9',
    commentCount: 5,
    isSecret: false,
    hasFile: true,
  },
];

// 컬럼 정의
const columns: Column<MockUser>[] = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'name', header: '이름' },
  { key: 'email', header: '이메일' },
  { key: 'role', header: '권한' },
  {
    key: 'status',
    header: '상태',
    render: value => (
      <Badge
        variant='outline'
        size='sm'
        color={value === 'active' ? 'success' : 'danger'}
        label={value.toUpperCase()}
      />
    ),
  },
];

/**
 * 데이터 테이블의 가장 표준적인 형태입니다.
 * - **Checklist**: 열(Column)의 너비 설정과 데이터 매핑이 정확한지 확인합니다.
 */
export const Base: Story = {
  args: {
    caption: '사용자 목록',
    summary: '시스템에 등록된 전체 사용자 정보를 나타내는 표입니다.',
    columns,
    data: MOCK_USER,
  },
};

/**
 * 외형 스타일(Solid, Outline)과 브랜드 테마 컬러를 점검합니다.
 * - **Solid**: 헤더에 배경색을 부여하여 시각적 구분을 강조합니다.
 * - **Outline**: 테두리 위주의 깔끔한 스타일로 데이터 집중도를 높입니다.
 */
export const Variants: Story = {
  render: args => {
    return (
      <GuideWrapper>
        <GuideGroup title='Solid'>
          <GuideCell>
            <DataTable {...args} variant='solid' aria-label='Solid Table' caption='Solid Table' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Outline'>
          <GuideCell>
            <DataTable
              {...args}
              variant='outline'
              aria-label='Outline Table'
              caption='Outline Table'
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
  args: {
    columns,
    data: MOCK_USER,
    color: 'primary',
    size: 'md',
  },
};

/**
 * 테마 색상 적용
 * 시스템 키 컬러(Primary, Secondary, Tertiary)에 따른 색상 변화를 확인합니다.
 */
export const Colors: Story = {
  render: args => (
    <GuideWrapper style={{ gap: '50px' }}>
      <GuideGroup title='primary'>
        <GuideCell>
          <DataTable {...args} color='primary' variant='solid' caption='Primary Solid Table' />
          <DataTable {...args} color='primary' variant='outline' caption='Primary Outline Table' />
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='secondary'>
        <GuideCell>
          <DataTable {...args} color='secondary' variant='solid' caption='Secondary Solid Table' />
          <DataTable
            {...args}
            color='secondary'
            variant='outline'
            caption='secondary Outline Table'
          />
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='tertiary'>
        <GuideCell>
          <DataTable {...args} color='tertiary' variant='solid' caption='tertiary Solid Table' />
          <DataTable
            {...args}
            color='tertiary'
            variant='outline'
            caption='Tertiary Outline Table'
          />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    columns,
    data: MOCK_USER,
    size: 'md',
  },
};

/**
 * 데이터 밀도에 따른 3단계(SM, MD, LG) 크기 변형입니다.
 * - **Checkpoint**: SM 사이즈 사용 시 텍스트가 겹치지 않는지, 모바일 환경에서도 최소 터치 영역이 확보되는지 점검합니다.
 */
export const Sizes: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell caption='SM'>
          <DataTable {...args} size='sm' caption='Small Table' />
        </GuideCell>
        <GuideCell caption='MD'>
          <DataTable {...args} size='md' caption='Medium Table' />
        </GuideCell>
        <GuideCell caption='LG'>
          <DataTable {...args} size='lg' caption='Large Table' />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    columns,
    data: MOCK_USER,
    variant: 'solid',
    color: 'primary',
  },
};

/**
 * 게시판 복합 구성
 * 공지사항 고정, 비밀글, 첨부파일 등 복잡한 비즈니스 로직이 포함된 케이스입니다.
 * [접근성 유의사항]
 * - title 속성 지양: 호버 시 나타나는 툴팁은 하단 행을 가리거나 스크린 리더 중복 읽기 문제를 야기할 수 있습니다.
 * - 시각적으로 숨겨진 텍스트(sr-only)를 통해 아이콘의 의미를 전달합니다.
 */
export const WithNotices: StoryObj<typeof DataTable<MockDataTableItem>> = {
  render: args => {
    // 1. SortState 타입(key: string)과의 호환을 위해 타입을 string으로 지정
    const [sort, setSort] = useState<{
      key: string;
      order: SortOrder;
    }>({
      key: 'id',
      order: 'desc',
    });

    // 2. 정렬 로직 (useMemo로 성능 최적화)
    const sortedData = useMemo(() => {
      if (sort.order === 'none') return MOCK_BOARD;

      return [...MOCK_BOARD].sort((a, b) => {
        // 인덱스 접근을 위해 keyof DataTableItem으로 타입 단언
        const currentKey = sort.key as keyof MockDataTableItem;
        const aValue = a[currentKey];
        const bValue = b[currentKey];

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
        return 0;
      });
    }, [sort]);

    // 3. DataTable의 onSort 인터페이스 대응 핸들러
    const handleSort = (key: string | number | symbol, order: SortOrder) => {
      setSort({ key: String(key), order });
    };

    return (
      <GuideWrapper style={{ gap: '30px', display: 'flex', flexDirection: 'column' }}>
        <DataTable
          {...args}
          variant='solid'
          notices={MOCK_NOTICES}
          data={sortedData}
          sortState={sort}
          onSort={handleSort}
        />
        <DataTable
          {...args}
          variant='outline'
          notices={MOCK_NOTICES}
          data={sortedData}
          sortState={sort}
          onSort={handleSort}
        />
      </GuideWrapper>
    );
  },
  args: {
    caption: '공지사항 및 게시글 목록 예시',
    columns: [
      { key: 'id', header: '번호', width: '80px', sortable: true },
      {
        key: 'title',
        header: '제목',
        minWidth: '400px',
        render: (value, row) => {
          const item = row as MockDataTableItem;
          if (!item.href) return value;
          return (
            <a
              href={item.href}
              className='data-table__link'
              onClick={e => {
                if (!item.href.startsWith('http')) {
                  e.preventDefault();
                  console.log('SPA Routing Log');
                }
              }}
            >
              {/* 제목 텍스트 - CSS에서 ellipsis 처리 권장 */}
              <span className='data-table__link-title'>{value}</span>

              {/* 비밀글 아이콘 */}
              {item.isSecret && (
                <span className='data-table__status-icon'>
                  <Icon
                    name='lock'
                    className='icon'
                    size='md'
                    strokeWidth={2.5}
                    aria-hidden='true'
                  />
                  <span className='sr-only'>비공개 글</span>
                </span>
              )}

              {/* 댓글 개수 */}
              {item.commentCount > 0 && (
                <span className='data-table__comment-count'>
                  <span aria-hidden='true'>[{item.commentCount}]</span>
                  <span className='sr-only'>댓글 {item.commentCount}개</span>
                </span>
              )}
            </a>
          );
        },
      },
      {
        key: 'hasFile',
        header: '파일',
        width: '60px',
        render: (_, row) => {
          const item = row as MockDataTableItem;
          return item.hasFile ? (
            <div className='data-table__status-icon'>
              <Icon
                name='file'
                className='icon'
                size='md'
                strokeWidth={2.5}
                aria-label='첨부파일 있음'
              />
            </div>
          ) : null;
        },
      },
      { key: 'author', header: '작성자', width: '120px' },
      { key: 'date', header: '날짜', width: '150px', sortable: true },
      { key: 'views', header: '조회수', width: '100px', sortable: true },
    ],
  },
};

/**
 * 행 선택 기능
 * 체크박스를 통한 다중 행 선택 기능을 구현합니다.
 */
export const WithCheckboxes: Story = {
  render: args => {
    const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());

    const handleSelectRow = (id: number | string) => {
      const newSet = new Set(selectedRows);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedRows(newSet);
    };

    const handleSelectAll = (isAll: boolean) => {
      if (isAll) setSelectedRows(new Set(MOCK_USER.map(d => d.id)));
      else setSelectedRows(new Set());
    };

    return (
      <DataTable
        {...args}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
      />
    );
  },
  args: {
    caption: '체크박스 선택 가능 표',
    columns,
    data: MOCK_USER,
    showCheckbox: true,
  },
};

/**
 * 데이터 정렬
 * 특정 열의 헤더를 클릭하여 데이터를 오름차순/내림차순으로 정렬합니다.
 */
export const Sortable: Story = {
  render: args => {
    // 1. 정렬 상태 관리
    const [sort, setSort] = useState<{ key: string; order: 'asc' | 'desc' | 'none' }>({
      key: 'id',
      order: 'asc',
    });

    // 2. 정렬 로직 구현 (실제 데이터 정렬)
    const sortedData = [...MOCK_USER].sort((a, b) => {
      if (sort.order === 'none') return 0;

      const aValue = a[sort.key as keyof MockUser];
      const bValue = b[sort.key as keyof MockUser];

      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return (
      <DataTable
        {...args}
        data={sortedData} // 정렬된 데이터 전달
        sortState={sort}
        onSort={(key, order) => setSort({ key: String(key), order })}
      />
    );
  },
  args: {
    caption: '정렬 기능이 활성화된 표',
    // 📌 중요: 각 컬럼 객체에 sortable: true를 추가해야 버튼이 나타납니다.
    columns: columns.map(col => ({
      ...col,
      sortable:
        col.key === 'id' ||
        col.key === 'name' ||
        col.key === 'role' ||
        col.key === 'status' ||
        col.key === 'email',
    })),
  },
};

/**
 * 데이터 없음 상태
 * 출력할 데이터가 존재하지 않을 때의 UI를 확인합니다.
 */
export const Empty: Story = {
  args: {
    caption: '데이터 없음 상태',
    columns,
    data: [],
  },
};
