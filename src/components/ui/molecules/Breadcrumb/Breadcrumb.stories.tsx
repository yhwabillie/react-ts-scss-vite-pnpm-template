import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from '../../atoms/Icon/Icon'; // 프로젝트 내 아이콘 컴포넌트 가정

import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import Breadcrumb from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Molecules/Breadcrumbs',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    // --- Appearance 카테고리 ---
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '텍스트 및 아이콘의 색상 테마를 결정합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '글자 크기와 간격을 조절합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },

    // --- Content 카테고리 ---
    items: {
      control: 'object',
      description:
        '경로 정보를 담은 배열입니다. 각 아이템은 label, href(선택), icon(선택)을 가집니다.',
      table: {
        category: 'Content',
        type: { summary: 'BreadcrumbItem[]' },
      },
    },
    separator: {
      control: 'text',
      description: '아이템 사이의 구분자입니다. 문자열이나 Icon 컴포넌트를 전달할 수 있습니다.',
      table: {
        category: 'Content',
        type: { summary: 'string | ReactNode' },
        defaultValue: { summary: '<Icon name="chevron-right" />' },
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

/**
 * [Base] 가장 기본적인 브레드크럼 형태입니다.
 * - 첫 번째 아이템에 아이콘을 배치하여 홈(Home)의 시인성을 높였습니다.
 * - 마지막 아이템은 링크가 없는 현재 페이지 상태를 나타냅니다.
 */
export const Base: Story = {
  args: {
    items: [
      {
        label: '홈',
        href: '/',
        icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
      },
      {
        label: '제품 목록',
        href: '/products',
      },
      { label: '상세 페이지' },
    ],
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb {...args} />
      </GuideWrapper>
    );
  },
};

/**
 * [WithIcon] 모든 경로 아이템에 아이콘이 포함된 형태입니다.
 * - 시각적으로 풍부한 내비게이션을 제공할 때 사용합니다.
 * - 다크모드(#121212)에서는 아이콘의 명도 대비를 3:1 이상 유지하도록 설계되었습니다.
 */
export const WithIcon: Story = {
  args: {
    items: [
      {
        label: '홈',
        href: '/',
        icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
      },
      {
        label: '제품 목록',
        href: '/products',
        icon: <Icon name='list' className='icon' strokeWidth={1.8} />,
      },
      { label: '상세 페이지', icon: <Icon name='file' className='icon' strokeWidth={1.8} /> },
    ],
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb {...args} />
      </GuideWrapper>
    );
  },
};

/**
 * [WithoutIcon] 아이콘 없이 텍스트로만 구성된 브레드크럼입니다.
 * - UI가 복잡한 페이지에서 내비게이션의 시각적 비중을 낮추고 싶을 때 적합합니다.
 */
export const WithoutIcon: Story = {
  args: {
    items: [
      {
        label: '홈',
        href: '/',
      },
      {
        label: '제품 목록',
        href: '/products',
      },
      { label: '상세 페이지' },
    ],
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb {...args} />
      </GuideWrapper>
    );
  },
};

/**
 * [Colors] 디자인 시스템의 컬러 테마별 적용 예시입니다.
 * - Primary, Secondary, Tertiary 각 테마에 따른 텍스트 및 구분자 색상 변화를 확인합니다.
 * - 호버(Hover) 시의 인터랙션 컬러 변화를 함께 검토할 수 있습니다.
 */
export const Colors: Story = {
  args: {
    items: [
      {
        label: '홈',
        href: '/',
        icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
      },
      {
        label: '제품 목록',
        href: '/products',
      },
      { label: '상세 페이지' },
    ],
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
        <GuideCell caption='Primary'>
          <Breadcrumb {...args} color='primary' />
        </GuideCell>
        <GuideCell caption='Secondary'>
          <Breadcrumb {...args} color='secondary' />
        </GuideCell>
        <GuideCell caption='Tertiary'>
          <Breadcrumb {...args} color='tertiary' />
        </GuideCell>
      </GuideWrapper>
    );
  },
};

/**
 * [Sizes] 브레드크럼의 크기별(SM, MD, LG) 예시입니다.
 * - 레이아웃의 비중이나 타이포그래피 계층에 맞춰 적절한 크기를 선택합니다.
 * - 크기에 따라 내부 간격(Gap)과 아이콘 크기가 자동으로 조정됩니다.
 */
export const sizes: Story = {
  args: {
    items: [
      {
        label: '홈',
        href: '/',
        icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
      },
      {
        label: '제품 목록',
        href: '/products',
      },
      { label: '상세 페이지' },
    ],
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
        <GuideCell caption='SM'>
          <Breadcrumb {...args} size='sm' />
        </GuideCell>
        <GuideCell caption='MD'>
          <Breadcrumb {...args} size='md' />
        </GuideCell>
        <GuideCell caption='LG'>
          <Breadcrumb {...args} size='lg' />
        </GuideCell>
      </GuideWrapper>
    );
  },
};

/**
 * [LongPath] 경로가 매우 길어지는 상황을 테스트하는 스토리입니다.
 * - 가로 폭이 제한된 환경에서의 말줄임(Ellipsis) 처리나 레이아웃 깨짐 여부를 검토합니다.
 * - 중요: 제목이 길어지더라도 `title` 속성으로 툴팁을 띄우는 대신,
 * 필요 시 Popover 등을 활용하여 'partially obscured' 접근성 이슈를 방지하세요.
 */
export const LongPath: Story = {
  args: {
    items: [
      { label: 'Depth 1', href: '#' },
      { label: 'Depth 2', href: '#' },
      { label: 'Depth 3', href: '#' },
      { label: 'Depth 4', href: '#' },
      { label: 'Depth 5', href: '#' },
      { label: '매우 길어서 가로 길이를 많이 차지하는 마지막 페이지 제목' },
    ],
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb {...args} />
      </GuideWrapper>
    );
  },
};
