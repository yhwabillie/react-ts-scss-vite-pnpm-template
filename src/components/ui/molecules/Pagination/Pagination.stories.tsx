import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Pagination from './Pagination';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
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
 * 💡 Base: 기본적인 페이지네이션 동작을 확인합니다.
 * - 번호 클릭 시 상태 변경 및 onPageChange 액션 호출을 테스트합니다.
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
 * 📏 Sizes: 다양한 크기(SM, MD, LG)에서의 레이아웃을 비교합니다.
 * - 버튼 크기에 따라 내부 텍스트 및 아이콘이 가려지지 않고 적절한 여백을 유지하는지 확인합니다.
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
 * 🟢 Shapes: 버튼의 형태(Square, Rounded, Pill)를 테스트합니다.
 * - 각 형태에서 포커스 라인(Focus Ring)이 인접한 버튼을 가리지(Obscured) 않는지 체크합니다.
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
 * 🎨 Colors: 테마별 컬러셋(Primary, Secondary, Tertiary)을 확인합니다.
 * - 텍스트와 배경색 간의 대비비가 AA 등급(4.5:1)을 충족하여 정보가 명확히 보이는지 검증합니다.
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
 * 🔢 Long Range: 페이지 번호가 만 단위(88,888) 이상인 극한의 상황을 테스트합니다.
 * - [가려짐 방지] 숫자가 길어질 때 버튼 너비가 유연하게 늘어나며 옆 번호를 침범하지 않는지 확인합니다.
 * - 첫 페이지, 마지막 페이지 고정 노출 및 말줄임표(...)의 동작을 검증합니다.
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
 * 📱 Mobile: 모바일 전용 간결 UI(isMobileUI)를 사이즈별로 테스트합니다.
 * - [UX] 좁은 폭에서도 "현재/전체" 텍스트와 내비게이션 버튼이 겹치지 않는지 확인합니다.
 * - 버튼의 터치 영역이 충분히 확보되어 오작동이 없는지 체크합니다.
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
 * 🛠 States: 인터랙션 및 논리적 상태를 시뮬레이션합니다.
 * - [중요] 비활성화(Disabled) 상태의 버튼에 title 속성을 넣지 마세요.
 * 툴팁이 나타나면 현재 페이지 정보를 시각적으로 가려버릴 수 있습니다.
 * - pseudo-class 클래스를 통해 Hover/Active 스타일이 주변 레이아웃에 영향을 주지 않는지 확인합니다.
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
