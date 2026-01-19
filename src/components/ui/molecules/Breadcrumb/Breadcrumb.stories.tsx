import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from '../../atoms/Icon/Icon'; // 프로젝트 내 아이콘 컴포넌트 가정

import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import Breadcrumb from './Breadcrumb';
import { useTranslation } from 'react-i18next';

const getBreadcrumbCopy = (t: (key: string) => string) => ({
  default: {
    depth1: t('breadcrumb.default.depth_1'),
    depth2: t('breadcrumb.default.depth_2'),
    depth3: t('breadcrumb.default.depth_3'),
  },
  long: {
    depth1: t('breadcrumb.long.depth_1'),
    depth2: t('breadcrumb.long.depth_2'),
    depth3: t('breadcrumb.long.depth_3'),
    depth4: t('breadcrumb.long.depth_4'),
    depth5: t('breadcrumb.long.depth_5'),
    depth6: t('breadcrumb.long.depth_6'),
  },
});

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Molecules/Breadcrumbs',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Breadcrumb**는 사이트 내 계층 구조에서 사용자의 현재 위치를 시각화하고, 상위 페이지로의 빠른 이동을 지원하는 내비게이션 컴포넌트입니다. <br /><br />' +
          '• **Hierarchy Visualization**: 현재 위치와 상위 경로를 구분자(Separator)로 연결하여 직관적인 구조 정보를 제공합니다. <br />' +
          '• **A11y Navigation**: `nav` 요소와 `aria-label`을 사용하여 스크린 리더 사용자에게 내비게이션 영역임을 명확히 알립니다. <br />' +
          '• **Customizable Separator**: 텍스트 형태의 슬래시(/)뿐만 아니라 프로젝트 아이콘 세트를 구분자로 유연하게 사용할 수 있습니다.',
      },
    },
  },
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
 * 브레드크럼의 가장 표준적인 구성입니다.
 * - **UX Tip**: 첫 번째 아이템에 홈 아이콘을 배치하여 사용자가 언제든 최상위 루트로 돌아갈 수 있음을 시각적으로 강조합니다.
 * - **Current Page**: 마지막 아이템은 링크를 제외하여 현재 머무르고 있는 페이지임을 나타냅니다.
 */
export const Base: Story = {
  render: args => {
    const { t } = useTranslation();
    const copy = getBreadcrumbCopy(t);
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb
          {...args}
          items={[
            {
              label: copy.default.depth1,
              href: '/',
              icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
            },
            {
              label: copy.default.depth2,
              href: '/products',
            },
            { label: copy.default.depth3 },
          ]}
        />
      </GuideWrapper>
    );
  },
};

/**
 * 모든 경로 단계에 아이콘을 동반한 형태입니다.
 * - **Contextual Clues**: 각 단계의 성격에 맞는 아이콘을 부여하여 텍스트를 읽기 전 직관적인 정보 식별을 돕습니다.
 * - **Design Integrity**: 다크모드 등 다양한 배경에서도 아이콘과 텍스트의 명도 대비를 3:1 이상 유지하도록 설계되었습니다.
 */
export const WithIcon: Story = {
  render: args => {
    const { t } = useTranslation();
    const copy = getBreadcrumbCopy(t);
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb
          {...args}
          items={[
            {
              label: copy.default.depth1,
              href: '/',
              icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
            },
            {
              label: copy.default.depth2,
              href: '/products',
              icon: <Icon name='list' className='icon' strokeWidth={1.8} />,
            },
            {
              label: copy.default.depth3,
              icon: <Icon name='file' className='icon' strokeWidth={1.8} />,
            },
          ]}
        />
      </GuideWrapper>
    );
  },
};

/**
 * 텍스트와 구분자로만 이루어진 미니멀한 구성입니다.
 * - **Minimalism**: 정보 밀도가 높은 복잡한 대시보드 환경에서 내비게이션의 시각적 피로도를 낮추고 싶을 때 사용합니다.
 */
export const WithoutIcon: Story = {
  render: args => {
    const { t } = useTranslation();
    const copy = getBreadcrumbCopy(t);
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb
          {...args}
          items={[
            { label: copy.default.depth1, href: '/' },
            { label: copy.default.depth2, href: '/products' },
            { label: copy.default.depth3 },
          ]}
        />
      </GuideWrapper>
    );
  },
};

/**
 * 디자인 시스템에 정의된 의미론적(Semantic) 테마를 적용합니다.
 * - **Consistency**: Primary, Secondary, Tertiary 컬러 톤을 사용하여 다른 내비게이션 요소들과의 일관성을 맞춥니다.
 * - **Interaction**: 링크가 포함된 아이템의 호버(Hover) 상태 시각 피드백을 검증합니다.
 */
export const Colors: Story = {
  render: args => {
    const { t } = useTranslation();
    const copy = getBreadcrumbCopy(t);
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
        <GuideCell caption='Primary'>
          <Breadcrumb
            {...args}
            color='primary'
            ariaLabel='보조 네비게이션(Primary)'
            items={[
              {
                label: copy.default.depth1,
                href: '/',
                icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
              },
              { label: copy.default.depth2, href: '/products' },
              { label: copy.default.depth3 },
            ]}
          />
        </GuideCell>
        <GuideCell caption='Secondary'>
          <Breadcrumb
            {...args}
            color='secondary'
            ariaLabel='보조 네비게이션(Secondary)'
            items={[
              {
                label: copy.default.depth1,
                href: '/',
                icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
              },
              { label: copy.default.depth2, href: '/products' },
              { label: copy.default.depth3 },
            ]}
          />
        </GuideCell>
        <GuideCell caption='Tertiary'>
          <Breadcrumb
            {...args}
            color='tertiary'
            ariaLabel='보조 네비게이션(Tertiary)'
            items={[
              {
                label: copy.default.depth1,
                href: '/',
                icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
              },
              { label: copy.default.depth2, href: '/products' },
              { label: copy.default.depth3 },
            ]}
          />
        </GuideCell>
      </GuideWrapper>
    );
  },
};

/**
 * UI의 비중과 타이포그래피 계층에 따른 3단계 크기 옵션을 제공합니다.
 * - **Scale Logic**: 크기에 따라 글자 크기, 아이콘 크기, 그리고 아이템 간의 간격(Gap)이 비례적으로 조정됩니다.
 */
export const sizes: Story = {
  render: args => {
    const { t } = useTranslation();
    const copy = getBreadcrumbCopy(t);
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
        <GuideCell caption='SM'>
          <Breadcrumb
            {...args}
            size='sm'
            ariaLabel='보조 네비게이션(SM)'
            items={[
              {
                label: copy.default.depth1,
                href: '/',
                icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
              },
              { label: copy.default.depth2, href: '/products' },
              { label: copy.default.depth3 },
            ]}
          />
        </GuideCell>
        <GuideCell caption='MD'>
          <Breadcrumb
            {...args}
            size='md'
            ariaLabel='보조 네비게이션(MD)'
            items={[
              {
                label: copy.default.depth1,
                href: '/',
                icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
              },
              { label: copy.default.depth2, href: '/products' },
              { label: copy.default.depth3 },
            ]}
          />
        </GuideCell>
        <GuideCell caption='LG'>
          <Breadcrumb
            {...args}
            size='lg'
            ariaLabel='보조 네비게이션(LG)'
            items={[
              {
                label: copy.default.depth1,
                href: '/',
                icon: <Icon name='house' className='icon' strokeWidth={1.8} />,
              },
              { label: copy.default.depth2, href: '/products' },
              { label: copy.default.depth3 },
            ]}
          />
        </GuideCell>
      </GuideWrapper>
    );
  },
};

/**
 * 경로가 길어지거나 특정 단계의 텍스트가 매우 길 때의 레이아웃 안정성을 테스트합니다.
 * - **A11y Warning**: 저장된 정보에 따라, 긴 제목이 주변 요소를 가리는 'partially obscured' 이슈를 방지하기 위해 Native `title` 속성 사용을 금합니다.
 * - **UX Guide**: 공간이 부족할 경우 말줄임(Ellipsis)을 적용하거나 중간 경로를 생략하는 방식의 고려가 필요합니다.
 */
export const LongPath: Story = {
  render: args => {
    const { t } = useTranslation();
    const copy = getBreadcrumbCopy(t);
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Breadcrumb
          {...args}
          items={[
            { label: copy.long.depth1, href: '#' },
            { label: copy.long.depth2, href: '#' },
            { label: copy.long.depth3, href: '#' },
            { label: copy.long.depth4, href: '#' },
            { label: copy.long.depth5, href: '#' },
            { label: copy.long.depth6 },
          ]}
        />
      </GuideWrapper>
    );
  },
};
