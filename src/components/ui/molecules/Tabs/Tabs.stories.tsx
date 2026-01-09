import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from './Tabs';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
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
 * [Base]
 * Tabs 컴포넌트의 가장 기본적인 형태입니다.
 * - 체크포인트: 기본적인 탭 전환 기능과 활성화 상태의 스타일을 확인합니다.
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
 * [Variant]
 * 탭의 시각적 테마를 'Underline', 'Solid(Index)', 'Outline'으로 구분하여 확인합니다.
 * - Underline: 가장 범용적인 스타일.
 * - Solid: 포스트잇처럼 하단 보더를 뚫어 본문 패널과 연결되는 인덱스 스타일.
 * - Outline: 테두리가 강조된 독립적인 버튼 형태.
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
 * [Sizes]
 * sm, md, lg 각 사이즈별 패딩과 폰트 크기 조절을 점검합니다.
 * - 체크포인트: sm 사이즈에서도 모바일 최소 터치 영역(44px)이 확보되는지 확인.
 * - 접근성: 사이즈가 작아져도 텍스트 명도 대비가 깨지지 않는지 확인하세요.
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
 * [Colors]
 * 디자인 시스템의 Key 컬러인 Primary, Secondary, Tertiary 테마를 확인합니다.
 * - 체크포인트: 활성화(Active) 상태에서 텍스트와 배경의 명도 대비(4.5:1) 준수 여부.
 * - Tertiary: 다크모드 등 특정 환경에서 가독성이 떨어지지 않는지 중점적으로 확인합니다.
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
 * [States]
 * 컴포넌트의 가상 클래스 상태(Hover, Focus)를 강제로 활성화하여 시각적 피드백을 검수합니다.
 * - Hover: .pseudo-hover 클래스를 통해 마우스를 올렸을 때의 변화를 확인합니다.
 * 비활성 탭이 사용자에게 클릭 가능하다는 시각적 힌트를 충분히 주는지 점검하세요.
 * - Focus: .pseudo-focus-visible 클래스를 통해 키보드 접근 시의 포커스 링(Outline)을 확인합니다.
 * 모든 variant에서 포커스 링이 탭의 경계선이나 배경색과 겹쳐 보이지 않는지 확인하는 것이 핵심입니다.
 * - ⚠️ Partially Obscured 주의 (사용자 가이드):
 * 상태 검수를 위해 가상 상태를 고정할 때, 'title' 속성을 통한 브라우저 툴팁이 함께 노출되지 않도록 하세요.
 * 고정된 상태에서 툴팁이 계속 떠 있으면 인접한 다른 variant의 디자인 확인을 방해(Partially Obscured)합니다.
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
 * [ScrollableVariants]
 * 다량의 탭(15개 이상)이 있을 때의 가로 스크롤 및 그라데이션 마스크 효과를 확인합니다.
 * - 기능: 드래그/스크롤 시 양 끝의 Linear Gradient Mask가 자연스럽게 동작하는지 점검.
 * - ⚠️ Partially Obscured 주의: 탭 제목이 잘린다고 해서 'title' 속성을 사용하지 마세요.
 * 툴팁이 인접 탭을 가려 사용자 탐색을 방해할 수 있습니다.
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
 * [InitialSelection]
 * 초기 렌더링 시 특정 인덱스가 활성화된 상태와 그에 따른 자동 스크롤 동작을 확인합니다.
 * - 기능: defaultIndex 설정에 따라 scrollToTab 로직이 해당 탭을 중앙으로 호출하는지 점검.
 * - 인터랙션: onMouseDown을 통한 즉각적인 상태 변경 피드백을 확인하기 좋은 테스트 케이스입니다.
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
