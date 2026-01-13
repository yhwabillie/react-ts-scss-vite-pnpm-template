import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from './Tabs';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Tabs**는 동일한 맥락 내에서 연관된 콘텐츠를 그룹화하고, 사용자가 원하는 섹션으로 빠르게 전환할 수 있게 돕는 컴포넌트입니다. <br /><br />' +
          '• **Semantic Hierarchy**: 탭 버튼 영역과 콘텐츠 패널 영역을 명확히 분리하여 구조적 일관성을 제공합니다. <br />' +
          '• **Visual Flexibility**: `underline`, `solid`, `outline` 등 프로젝트 무드에 맞는 3가지 테마를 지원합니다. <br />' +
          '• **Advanced Scrolling**: 탭 항목이 컨테이너 폭을 초과할 경우, 자동으로 가로 스크롤과 그라데이션 마스크를 적용하여 탐색 편의성을 유지합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // --- Appearance ---
    variant: {
      control: 'inline-radio',
      options: ['underline', 'outline', 'solid'],
      description: '탭의 시각적 스타일 테마를 설정합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'underline' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '탭의 크기(여백, 폰트 사이즈)를 조절합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '탭의 강조 색상을 선택합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
      },
    },

    // --- Content ---
    items: {
      description: '탭 제목과 표시할 콘텐츠를 담은 배열입니다.',
      table: {
        type: { summary: 'TabItem[]' },
        category: 'Content',
      },
      control: 'object',
    },

    // --- State ---
    defaultIndex: {
      control: { type: 'number', min: 0 },
      description: '초기 렌더링 시 활성화될 탭의 인덱스입니다.',
      table: {
        type: { summary: 'number' },
        category: 'State',
        defaultValue: { summary: '0' },
      },
    },
    className: {
      control: 'text',
      description:
        '컴포넌트 최상단 요소에 추가될 커스텀 클래스명입니다. 외부 레이아웃 조절 시 사용합니다.',
      table: {
        category: 'Appearance',
      },
    },
  },
  args: {
    variant: 'underline',
    size: 'md',
    color: 'primary',
    items: [
      { title: '카테고리 탭 1', content: '첫 번째 탭의 콘텐츠입니다.' },
      { title: '테고리 탭 2', content: '두 번째 탭의 콘텐츠입니다.' },
      { title: '테고리 탭 3', content: '세 번째 탭의 콘텐츠입니다.' },
      { title: '테고리 탭 4', content: '네 번째 탭의 콘텐츠입니다.' },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

/**
 * Tabs 컴포넌트의 가장 기본적인 형태입니다.
 * - **Checkpoint**: 기본적인 탭 전환 기능과 활성화 상태의 스타일을 확인합니다.
 * - **Extensibility**: `className`을 통해 외부에서 전달된 스타일이 최상단 컨테이너에 올바르게 주입되는지 점검합니다.
 */
export const Base: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell>
          <Tabs {...args} />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 탭의 시각적 테마를 'Underline', 'Solid(Index)', 'Outline'으로 구분하여 확인합니다.
 * - **Underline**: 가장 범용적인 스타일로, 하단 보더를 통해 상태를 표시합니다.
 * - **Solid**: 인덱스(색인) 스타일로, 활성화된 탭이 본문 패널과 시각적으로 연결됩니다.
 * - **Outline**: 독립된 버튼 형태로 테두리가 강조된 스타일입니다.
 */
export const Variant: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: 'fit-content', margin: 'auto' }}>
      <SpecimenGroup title='Underline'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
      <SpecimenGroup title='Solid'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='solid' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
      <SpecimenGroup title='Outline'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='outline' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};

/**
 * 각 사이즈별(SM, MD, LG) 타이포그래피와 패딩 밸런스를 점검합니다.
 * - **검증**: SM 사이즈에서 모바일 최소 터치 영역(44px) 확보 여부.
 * - **접근성**: 사이즈 축소 시에도 텍스트 가독성 및 명도 대비 유지 확인.
 */
export const Sizes: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: 'fit-content', margin: 'auto', gap: '80px' }}>
      <SpecimenGroup title='SM'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' size='sm' />
            <Tabs {...args} variant='solid' size='sm' />
            <Tabs {...args} variant='outline' size='sm' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
      <SpecimenGroup title='MD'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' size='md' />
            <Tabs {...args} variant='solid' size='md' />
            <Tabs {...args} variant='outline' size='md' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
      <SpecimenGroup title='LG'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' size='lg' />
            <Tabs {...args} variant='solid' size='lg' />
            <Tabs {...args} variant='outline' size='lg' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};

/**
 * 테마 컬러(Primary, Secondary, Tertiary) 적용 시 시각적 일관성을 확인합니다.
 * - **명도 대비**: 활성(Active) 상태에서 배경과 텍스트 대비비(4.5:1) 준수 여부.
 * - **환경 대응**: 다크모드 또는 특정 배경에서 Tertiary 컬러의 시인성 중점 확인.
 */
export const Colors: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: 'fit-content', margin: 'auto', gap: '80px' }}>
      <SpecimenGroup title='Primary'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' color='primary' />
            <Tabs {...args} variant='solid' color='primary' />
            <Tabs {...args} variant='outline' color='primary' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
      <SpecimenGroup title='Secondary'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' color='secondary' />
            <Tabs {...args} variant='solid' color='secondary' />
            <Tabs {...args} variant='outline' color='secondary' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
      <SpecimenGroup title='Tertiary'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' color='tertiary' />
            <Tabs {...args} variant='solid' color='tertiary' />
            <Tabs {...args} variant='outline' color='tertiary' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};

/**
 * 인터랙션 상태(Hover, Focus)의 시각적 피드백을 검수합니다.
 * - **Focus Ring**: 모든 테마에서 포커스 라인이 인접 요소와 겹치지 않는지 확인.
 */
export const States: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: 'fit-content', margin: 'auto' }}>
      <SpecimenGroup title='Hover'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' className='pseudo-hover' />
            <Tabs {...args} variant='solid' className='pseudo-hover' />
            <Tabs {...args} variant='outline' className='pseudo-hover' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
      <SpecimenGroup title='Focus'>
        <SpecimenRow>
          <GuideCell>
            <Tabs {...args} variant='underline' className='pseudo-focus-visible' />
            <Tabs {...args} variant='solid' className='pseudo-focus-visible' />
            <Tabs {...args} variant='outline' className='pseudo-focus-visible' />
          </GuideCell>
        </SpecimenRow>
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};

/**
 * [06. Scrollable Variants]
 * 다량의 탭 노출 시 가로 탐색 및 시각적 힌트를 확인합니다.
 * - **UX**: 스크롤 시 양 끝의 그라데이션 마스크가 자연스럽게 동작하는지 점검.
 */
export const ScrollableVariants: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        {/* Underline Variant */}
        <GuideCell caption='Underline Variant (Default)' style={{ width: '100%' }}>
          <Tabs {...args} variant='underline' />
        </GuideCell>

        {/* Solid / Index Variant (인덱스 스타일) */}
        <GuideCell caption='Solid Variant (Index Type)' style={{ width: '100%' }}>
          <Tabs {...args} variant='solid' />
        </GuideCell>

        {/* Outline Variant */}
        <GuideCell caption='Outline Variant' style={{ width: '100%' }}>
          <Tabs {...args} variant='outline' />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    size: 'md',
    color: 'primary',
    items: Array.from({ length: 15 }, (_, i) => ({
      title: `카테고리 탭 ${i + 1}`,
      content: `${i + 1}번째 섹션의 상세 내용입니다.`,
    })),
  },
};

/**
 * `defaultIndex` 설정에 따른 초기 활성 상태와 자동 스크롤을 확인합니다.
 * - **기능**: 활성 탭이 화면 밖에 있을 경우 중앙으로 자동 이동(Scroll-to-tab)하는지 점검.
 * - **반응성**: 클릭 시 상태 변경과 콘텐츠 전환의 즉각적인 피드백 확인.
 */
export const InitialSelection: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell caption='Index 0 (Default Initial)'>
          <Tabs {...args} />
        </GuideCell>

        <GuideCell caption='Index 1 (Pre-selected)'>
          <Tabs {...args} defaultIndex={1} />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    ...Base.args,
  },
};
