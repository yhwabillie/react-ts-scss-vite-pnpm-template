import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Pagination from './Pagination';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Pagination**은 콘텐츠를 여러 페이지로 나누어 표시할 때, 원하는 페이지로 이동할 수 있도록 돕는 인터페이스입니다. <br /><br />' +
          '• **Smart Range Logic**: 전체 페이지 수에 따라 현재 페이지 주변 번호를 지능적으로 노출하고, 범위를 벗어나면 말줄임표(...)를 사용하여 효율적으로 공간을 관리합니다. <br />' +
          '• **Adaptive UI**: 데스크톱의 번호 리스트 방식과 모바일의 텍스트 스위처 방식(`isMobileUI`)을 모두 지원하여 최적의 UX를 제공합니다. <br />' +
          '• **Accessibility Focus**: 현재 머물고 있는 페이지를 시각적뿐만 아니라 `aria-current="page"`를 통해 보조 공학 기기에도 명확히 전달합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // --- Style 카테고리 ---
    shape: {
      control: 'inline-radio',
      options: ['square', 'rounded', 'pill'],
      description: '버튼의 모서리 곡률을 설정합니다.',
      table: {
        category: 'Style',
        defaultValue: { summary: 'rounded' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '활성화된 페이지와 버튼의 강조 색상을 결정합니다.',
      table: {
        category: 'Style',
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '버튼 및 텍스트의 크기를 조절합니다.',
      table: {
        category: 'Style',
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      control: 'text',
      description: '컴포넌트 최상단 nav 요소에 추가될 커스텀 클래스입니다.',
      table: {
        category: 'Style',
      },
    },

    // --- State 카테고리 ---
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '현재 머물고 있는 페이지 번호입니다.',
      table: {
        category: 'State',
      },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '전체 페이지의 총합입니다.',
      table: {
        category: 'State',
      },
    },

    // --- Layout 카테고리 ---
    isMobileUI: {
      control: 'boolean',
      description: 'true일 경우 번호 목록을 숨기고 `현재/전체` 텍스트만 표시합니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'false' },
      },
    },
    siblingCount: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description:
        '현재 페이지를 기준으로 좌우에 노출할 번호 개수입니다. 이 범위를 벗어나면 말줄임표(...)가 나타납니다.',
      table: {
        category: 'Layout',
        // defaultValue: { summary: 1 },
      },
    },

    // --- Events 카테고리 ---
    onPageChange: {
      action: 'paged',
      description: '페이지 클릭 시 호출되는 함수로, 변경된 페이지 번호를 인자로 받습니다.',
      table: {
        category: 'Events',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof Pagination>;

/**
 * 페이지네이션의 표준적인 동작을 시뮬레이션합니다.
 * - **State Management**: 번호 클릭 시 현재 페이지 상태가 변경되며, `onPageChange` 액션을 통해 외부 로직과 동기화됩니다.
 */
export const Base: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={page => {
          setCurrentPage(page);
          args.onPageChange(page);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
  },
};

/**
 * SM, MD, LG의 3단계 크기 옵션을 비교합니다.
 * - **Visual Balance**: 크기가 변하더라도 버튼 내부의 숫자 가독성과 화살표 아이콘의 비율이 일정하게 유지되는지 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return (
      <GuideWrapper>
        <GuideGroup title='SM'>
          <GuideCell>
            <Pagination
              {...args}
              size='sm'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='MD'>
          <GuideCell>
            <Pagination
              {...args}
              size='md'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='LG'>
          <GuideCell>
            <Pagination
              {...args}
              size='lg'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
  },
};

/**
 * 서비스의 디자인 무드에 따른 버튼 형태(Square, Rounded, Pill)를 검증합니다.
 * - **Focus Integrity**: 각 형태에서 키보드 포커스 링이 인접한 버튼과 겹쳐서 'Partially Obscured(부분적 가림)' 현상이 발생하지 않는지 체크합니다.
 */
export const Shapes: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return (
      <GuideWrapper>
        <GuideGroup title='Square'>
          <GuideCell>
            <Pagination
              {...args}
              shape='square'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Rounded'>
          <GuideCell>
            <Pagination
              {...args}
              shape='rounded'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Pill'>
          <GuideCell>
            <Pagination
              {...args}
              shape='pill'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
  },
};

/**
 * 브랜드 테마별(Primary, Secondary, Tertiary) 강조 색상을 확인합니다.
 * - **Contrast Check**: 활성화된 페이지 번호의 배경색과 흰색 텍스트 간의 명도 대비가 WCAG AA 기준을 충족하는지 검토합니다.
 */
export const Colors: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return (
      <GuideWrapper>
        <GuideGroup title='Primary'>
          <GuideCell>
            <Pagination
              {...args}
              color='primary'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Secondary'>
          <GuideCell>
            <Pagination
              {...args}
              color='secondary'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Tertiary'>
          <GuideCell>
            <Pagination
              {...args}
              color='tertiary'
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
                args.onPageChange(page);
              }}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
  },
};

/**
 * 페이지 번호가 만 단위(예: 88,888)를 넘어가는 극한의 데이터 환경을 테스트합니다.
 * - **Flexibility**: 숫자가 길어져도 버튼 너비가 유연하게 확장되어 텍스트가 잘리거나 인접 요소와 겹치지 않는지 점검합니다.
 */
export const LongRange: Story = {
  render: args => {
    // 초기값을 args에서 가져오거나, 테스트를 위해 큰 숫자로 시작합니다.
    const [currentPage, setCurrentPage] = useState(88888);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      args.onPageChange(page);
    };

    return (
      <GuideWrapper>
        <GuideGroup title='Square'>
          <GuideCell>
            <Pagination
              {...args}
              shape='square'
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Rounded'>
          <GuideCell>
            <Pagination
              {...args}
              shape='rounded'
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Pill'>
          <GuideCell>
            <Pagination
              {...args}
              shape='pill'
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
  args: {
    totalPages: 99999,
    siblingCount: 1,
  },
};

/**
 * 좁은 폭을 위한 간결 UI(`isMobileUI`) 모드입니다.
 * - **Simplification**: 번호 목록 대신 '현재/전체' 텍스트만 표시하여 모바일 기기에서의 터치 실수를 줄이고 공간 효율을 극대화합니다.
 */
export const Mobile: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      args.onPageChange(page);
    };

    return (
      <GuideWrapper>
        <GuideGroup title='SM'>
          <GuideCell>
            <Pagination
              {...args}
              size='sm'
              isMobileUI={true}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </GuideCell>
        </GuideGroup>

        <GuideGroup title='MD'>
          <GuideCell>
            <Pagination
              {...args}
              size='md'
              isMobileUI={true}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </GuideCell>
        </GuideGroup>

        <GuideGroup title='LG'>
          <GuideCell>
            <Pagination
              {...args}
              size='lg'
              isMobileUI={true}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
  args: {
    ...Base.args,
    isMobileUI: true,
    totalPages: 99,
  },
};

/**
 * 인터랙션 상태와 논리적 예외 상황을 검증합니다.
 * - **Edge Case**: 첫 페이지에서는 '이전' 버튼이, 마지막 페이지에서는 '다음' 버튼이 비활성화(Disabled) 처리되는지 확인합니다.
 * - **A11y Reminder**: 저장된 지침에 따라, 비활성 버튼에 `title` 속성을 사용하여 툴팁이 현재 위치 정보를 가리는 상황을 방지합니다.
 */
export const States: Story = {
  render: args => (
    <GuideWrapper>
      {/* 1. 기본 인터랙션 상태 (Pseudo 클래스 활용) */}
      <GuideGroup direction='column'>
        <GuideCell caption='Normal'>
          <Pagination {...args} currentPage={2} />
        </GuideCell>
        <GuideCell caption='Hover'>
          <Pagination {...args} className='pseudo-hover' currentPage={2} />
        </GuideCell>
        <GuideCell caption='Active'>
          <Pagination {...args} className='pseudo-active' currentPage={2} />
        </GuideCell>
      </GuideGroup>

      {/* 2. 논리적 상태 (Disabled / Active Page) */}
      <GuideGroup direction='column'>
        <GuideCell caption='First Page (Prev Disabled)'>
          <Pagination {...args} currentPage={1} totalPages={10} />
        </GuideCell>
        <GuideCell caption='Last Page (Next Disabled)'>
          <Pagination {...args} currentPage={10} totalPages={10} />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    ...Base.args,
  },
};
