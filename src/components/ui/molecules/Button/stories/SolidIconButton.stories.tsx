import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { expect, fn, within } from 'storybook/test';

import Icon from '../../../atoms/Icon/Icon';
import IconButton from '../../IconButton/IconButton';

// UI Specimen Components
import {
  SpecimenCell,
  SpecimenGroup,
  SpecimenRow,
  SpecimenWrapper,
} from '@/components/ui/guide/Specimen';
import { GuideCell, GuideGroup, GuideRow } from '@/components/ui/guide/Guide';

/**
 * [Constants]
 * 렌더링 성능 최적화 및 타입 안정성을 위해 상수를 render 함수 외부로 추출합니다.
 */
const COLOR_OPTIONS = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const;
const SIZE_OPTIONS = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
const SHAPE_OPTIONS = ['square', 'rounded', 'pill'] as const;
const SAMPLE_COUNT = [1, 2, 3];

const meta: Meta<typeof IconButton> = {
  title: 'UI/Molecules/Button/IconButton/Solid',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 💡 컴포넌트 개요
**Solid IconButton**은 배경색이 채워진 형태로, 인터페이스 내에서 가장 높은 시각적 위계(High Emphasis)를 가집니다.

### 📝 디자인 가이드 (Designer's Note)
- **사용 처**: 주요 실행 버튼(검색, 저장, 전송 등)에 사용합니다.
- **제한 사항**: 인지적 과부하를 방지하기 위해 한 화면(View)에 2개 이상의 Solid 버튼 배치를 지양합니다.
- **컬러 전략**: 의미론적 컬러(Success, Danger 등)는 반드시 해당 상태를 대변할 때만 사용합니다.

### ♿ 접근성 가이드 (A11y)
- **명칭 제공**: 텍스트가 없는 버튼이므로 \`ariaLabel\`은 **필수**입니다.
- **터치 영역**: XS, SM 사이즈 사용 시 주변 여백을 포함하여 최소 44px 이상의 터치 타겟을 확보해야 합니다.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link'],
      description: '버튼의 시각적 테마',
      table: { category: 'Appearance', defaultValue: { summary: 'solid' } },
    },
    color: {
      control: 'select',
      options: [...COLOR_OPTIONS],
      description: '의미론적 색상 시스템 적용',
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'inline-radio',
      options: [...SIZE_OPTIONS],
      description: '높이 및 내부 패딩 규격',
      table: { category: 'Layout', defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'inline-radio',
      options: [...SHAPE_OPTIONS],
      description: '모서리 곡률 타입',
      table: { category: 'Layout', defaultValue: { summary: 'rounded' } },
    },
    as: {
      control: 'select',
      options: ['button', 'a', 'div', 'span'],
      description: '렌더링될 HTML 태그',
      table: { category: 'Behavior', defaultValue: { summary: 'button' } },
    },
    ariaLabel: {
      control: 'text',
      description: '스크린 리더용 설명 (필수)',
      table: { category: 'Accessibility' },
    },
  },
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'xl',
    shape: 'pill',
    ariaLabel: '아이콘 버튼',
    onClick: fn(),
    icon: (
      <Icon
        name='chevron-left'
        strokeWidth={2.5}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='icon'
      />
    ),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * [01. Base]
 * 가장 기본이 되는 단일 컴포넌트 명세입니다.
 * 인터랙션 패널을 통해 클릭 이벤트와 렌더링 상태를 자동 검증합니다.
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  render: args => <IconButton {...args} />,
};

/**
 * [02. Colors]
 * 브랜드 아이덴티티 및 상태 전달을 위한 컬러 시스템입니다.
 * - **Primary/Secondary**: 일반적인 액션 위계
 * - **Semantic**: 성공, 경고, 위험 등의 상태 피드백
 */
export const Colors: Story = {
  render: args => {
    const baseId = useId();
    return (
      <SpecimenWrapper>
        {COLOR_OPTIONS.map(color => (
          <SpecimenGroup key={`${baseId}-${color}`} title={color.toUpperCase()}>
            <SpecimenRow>
              <SpecimenCell>
                <IconButton {...args} color={color} />
              </SpecimenCell>
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * [03. States]
 * 사용자 인터랙션에 따른 5가지 핵심 상태 피드백을 확인합니다.
 * `:hover`, `:focus`, `:active` 등 의사 클래스가 시스템 전반에서 일관되게 작동하는지 검수합니다.
 */
export const States: Story = {
  render: args => {
    const baseId = useId();
    const states = [
      { label: 'Normal', className: '' },
      { label: 'Hover', className: 'pseudo-hover' },
      { label: 'Focus', className: 'pseudo-focus-visible' },
      { label: 'Active', className: 'pseudo-active' },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => (
          <SpecimenGroup key={`${baseId}-${state.label}`} title={state.label}>
            <SpecimenRow>
              <SpecimenCell>
                <IconButton {...args} {...state.props} className={state.className} />
              </SpecimenCell>
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * [04. Sizes]
 * 다양한 레이아웃 밀도에 대응하는 5가지 사이즈 규격입니다.
 * 작은 사이즈(XS, SM)에서는 가독성을 위해 아이콘의 선 두께(strokeWidth)가 2.0으로 자동 조정됩니다.
 */
export const Sizes: Story = {
  render: args => {
    const baseId = useId();
    return (
      <GuideGroup>
        <GuideRow direction='row'>
          {SIZE_OPTIONS.map(size => (
            <GuideCell key={`${baseId}-${size}`} caption={size.toUpperCase()}>
              <IconButton {...args} size={size} />
            </GuideCell>
          ))}
        </GuideRow>
      </GuideGroup>
    );
  },
};

/**
 * [05. Shapes]
 * 모서리 곡률 변화를 통한 디자인 톤앤매너 조정입니다.
 * 원형(Pill)은 주로 독립적인 액션에, 사각형(Square)은 툴바나 그리드 내부에 권장됩니다.
 */
export const Shapes: Story = {
  render: args => {
    const baseId = useId();
    const strokeWidth = args.size === 'xs' || args.size === 'sm' ? 2 : 2.5;

    return (
      <GuideGroup direction='row'>
        {SHAPE_OPTIONS.map(shape => (
          <GuideRow key={`${baseId}-${shape}`} direction='column'>
            {SAMPLE_COUNT.map(idx => (
              <GuideCell
                key={`${baseId}-${shape}-${idx}`}
                caption={idx === 1 ? shape.toUpperCase() : undefined}
              >
                <IconButton
                  {...args}
                  shape={shape}
                  icon={<Icon name='chevron-left' strokeWidth={strokeWidth} />}
                />
              </GuideCell>
            ))}
          </GuideRow>
        ))}
      </GuideGroup>
    );
  },
};

/**
 * [06. Polymorphic Link]
 * 디자인은 버튼이지만 실제 태그는 `<a>`로 작동하여 SEO와 내비게이션 성능을 챙깁니다.
 * 외부 링크 연결 시 보안 속성(`rel='noopener`)이 적용되어 있는지 확인하십시오.
 */
export const PolymorphicLink: Story = {
  args: {
    as: 'a',
    href: 'https://www.google.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    ariaLabel: '구글로 이동 (새 창)',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');
    await step('태그 및 속성 검증', async () => {
      await expect(link.tagName).toBe('A');
      await expect(link).toHaveAttribute('href', 'https://www.google.com');
    });
  },
  render: args => <IconButton {...args} />,
};
