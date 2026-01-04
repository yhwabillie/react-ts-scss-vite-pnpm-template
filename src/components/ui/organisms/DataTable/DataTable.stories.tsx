import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import DataTable, { type Column, type SortOrder } from './DataTable';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import Icon from '../../atoms/Icon/Icon';
import IconFrame from '../../molecules/IconFrame/IconFrame';

// 테스트용 데이터 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const meta: Meta<typeof DataTable> = {
  title: 'UI/Organisms/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    // 🎨 [Style] 카테고리: 시각적 외형 결정
    variant: {
      control: { type: 'inline-radio' },
      options: ['solid', 'outline'],
      table: {
        category: 'Style',
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      table: {
        category: 'Style',
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Style',
        defaultValue: { summary: 'md' },
      },
    },

    // 📊 [Data] 카테고리: 표의 내용과 구조
    caption: {
      control: { type: 'text' },
      table: { category: 'Data' },
    },
    summary: {
      control: { type: 'text' },
      table: { category: 'Data' },
    },
    columns: {
      control: { type: 'object' },
      table: { category: 'Data' },
    },
    data: {
      control: { type: 'object' },
      table: { category: 'Data' },
    },

    // ⚙️ [Selection & State] 카테고리: 상태값 제어
    showCheckbox: {
      control: { type: 'boolean' },
      table: {
        category: 'Selection & State',
        // defaultValue: { summary: false },
      },
    },
    selectedRows: {
      control: { type: 'object' },
      table: { category: 'Selection & State' },
    },
    sortState: {
      control: { type: 'object' },
      table: { category: 'Selection & State' },
    },

    // ⚡ [Events] 카테고리: 인터랙션 핸들러
    onSort: {
      action: 'sorted',
      table: { category: 'Events' },
    },
    onSelectRow: {
      action: 'rowSelected',
      table: { category: 'Events' },
    },
    onSelectAll: {
      action: 'allSelected',
      table: { category: 'Events' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<User>>;

// 모의 데이터
const mockData: User[] = [
  { id: 1, name: 'Gemini', email: 'gemini@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'inactive' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active' },
];

// 컬럼 정의
const columns: Column<User>[] = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'name', header: '이름' },
  { key: 'email', header: '이메일' },
  { key: 'role', header: '권한' },
  {
    key: 'status',
    header: '상태',
    render: value => (
      <span
        style={{
          color: value === 'active' ? 'green' : 'red',
          fontWeight: 'bold',
        }}
      >
        {value.toUpperCase()}
      </span>
    ),
  },
];

export const Base: Story = {
  args: {
    caption: '사용자 목록',
    summary: '시스템에 등록된 전체 사용자 정보를 나타내는 표입니다.',
    columns,
    data: mockData,
  },
};

/**
 * 🎨 Variants: 테이블의 외형적 스타일(Solid/Outline)을 비교합니다.
 * Solid: 배경색이 채워진 헤더 스타일
 * Outline: 테두리 중심의 정갈한 스타일
 */
export const Variants: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup title='Solid'>
        <GuideCell>
          <DataTable {...args} variant='solid' />
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Outline'>
        <GuideCell>
          <DataTable {...args} variant='outline' />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    columns,
    data: mockData,
    color: 'primary',
    size: 'md',
    caption: 'Variant Comparison Table',
  },
};

/**
 * 🌈 Colors: 시스템 키 컬러(Primary, Secondary, Tertiary)에 따른 테마 변화를 확인합니다.
 * 각 컬러 틴트는 웹 접근성(WCAG 2.1) 가독성 대비비를 준수하도록 설계되었습니다.
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
    data: mockData,
    size: 'md', // 일관된 비교를 위해 중간 사이즈 고정
  },
};

/**
 * 📏 Sizes: 다양한 행 높이(sm, md, lg)를 확인합니다.
 * 데이터의 밀도에 따라 적절한 사이즈를 선택하여 시각적 피로도를 조절할 수 있습니다.
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
    data: mockData,
    variant: 'solid',
    color: 'primary',
  },
};

/**
 * 📌 WithNotices: 공지사항 고정 행, 비밀글, 파일 아이콘, 긴 제목 처리 등
 * 실제 게시판에서 발생할 수 있는 복합적인 케이스를 다룹니다.
 * * [접근성 포인트]
 * 1. visually-hidden: 댓글 개수나 아이콘의 의미를 스크린 리더에게 텍스트로 전달합니다.
 * 2. 가려짐 방지: 긴 제목은 CSS 말줄임표(...)를 통해 인접 셀을 가리지 않도록 처리합니다.
 * 3. title 속성 지양: 호버 시 툴팁이 하단 행을 가리는 이슈를 방지하기 위해 사용하지 않습니다.
 */
export const WithNotices: Story = {
  render: args => {
    const [sort, setSort] = useState<{ key: string; order: SortOrder }>({
      key: 'id',
      order: 'desc',
    });

    const notices: any[] = [
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
        hasFile: false, // 파일 없음 케이스
      },
    ];

    const boardData: any[] = [
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

    const sortedData = [...boardData].sort((a, b) => {
      if (sort.order === 'none') return 0;
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return (
      <DataTable
        {...args}
        notices={notices}
        data={sortedData}
        sortState={sort}
        onSort={(key, order) => setSort({ key: String(key), order })}
      />
    );
  },
  args: {
    caption: '다양한 게시글 상태 예시',
    columns: [
      { key: 'id', header: '번호', width: '80px', sortable: true },
      {
        key: 'title',
        header: '제목',
        minWidth: '400px',
        render: (value, row: any) => {
          if (!row.href) return value;
          return (
            <a
              href={row.href}
              className='data-table__link'
              onClick={e => {
                if (!row.href.startsWith('http')) {
                  e.preventDefault();
                  console.log('SPA 라우팅');
                }
              }}
            >
              {/* 1. 제목 텍스트 (길어질 경우 말줄임 처리 대상) */}
              <span className='data-table__link-title'>{value}</span>

              {/* 2. 비밀글 아이콘 (조건부) */}
              {row.isSecret && (
                <span className='data-table__status-icon'>
                  <Icon
                    name='lock'
                    size='md'
                    strokeWidth={2.5}
                    className='icon'
                    aria-hidden='true'
                  />
                  <span className='sr-only'>비공개 글</span>
                </span>
              )}

              {/* 3. 댓글 개수 (조건부) */}
              {row.commentCount > 0 && (
                <span className='data-table__comment-count'>
                  <span aria-hidden='true'>[{row.commentCount}]</span>
                  <span className='sr-only'>댓글 {row.commentCount}개</span>
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
        render: (value, row: any) =>
          row.hasFile ? (
            <div className='data-table__status-icon'>
              <Icon
                name='file'
                size='md'
                className='icon'
                strokeWidth={2.5}
                aria-label='첨부파일 있음'
              />
            </div>
          ) : null,
      },
      { key: 'author', header: '작성자', width: '120px' },
      { key: 'date', header: '날짜', width: '150px', sortable: true },
      { key: 'views', header: '조회수', width: '100px', sortable: true },
    ],
  },
};

/**
 * ✅ WithCheckboxes: 다중 선택 기능을 확인합니다.
 * Set 객체를 사용하여 선택된 행의 ID를 고유하게 관리합니다.
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
      if (isAll) setSelectedRows(new Set(mockData.map(d => d.id)));
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
    data: mockData,
    showCheckbox: true,
  },
};

/**
 * 🔼 Sortable: 헤더 클릭을 통한 데이터 정렬 인터페이스를 확인합니다.
 * 'asc' (오름차순), 'desc' (내림차순), 'none' (기본값) 상태를 순환합니다.
 */
export const Sortable: Story = {
  render: args => {
    // 1. 정렬 상태 관리
    const [sort, setSort] = useState<{ key: string; order: 'asc' | 'desc' | 'none' }>({
      key: 'id',
      order: 'asc',
    });

    // 2. 정렬 로직 구현 (실제 데이터 정렬)
    const sortedData = [...mockData].sort((a, b) => {
      if (sort.order === 'none') return 0;

      const aValue = a[sort.key as keyof User];
      const bValue = b[sort.key as keyof User];

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
 * 📭 Empty: 데이터가 없을 때의 UI를 확인합니다.
 * 사용자에게 데이터가 없음을 명확히 알리고 테이블 구조를 유지합니다.
 */
export const Empty: Story = {
  args: {
    caption: '데이터 없음 상태',
    columns,
    data: [],
  },
};
