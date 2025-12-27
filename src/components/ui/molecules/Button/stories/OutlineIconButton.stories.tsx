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
  title: 'UI/Molecules/Button/IconButton/Outline',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 💡 컴포넌트 개요
**Outline IconButton**은 배경색 없이 보더(Border)로 영역을 구분하는 스타일입니다. Solid 타입보다 시각적 강조도가 낮아 보조적인 동작에 주로 사용됩니다.

### 📝 디자인 가이드 (Designer's Note)
- **사용 처**: '취소', '이전', '상세보기' 등 보조적 액션(Secondary Action)에 사용합니다.
- **시각적 조화**: Solid 버튼 옆에 나열하여 액션의 우선순위를 구분할 때 효과적입니다.
- **가독성 주의**: 복잡한 배경 이미지 위에서는 보더가 묻힐 수 있으므로, 대비가 명확한 배경 위에서 사용을 권장합니다.

### ♿ 접근성 가이드 (A11y)
- **보더 대비**: 보더 컬러와 배경색의 대비(Contrast Ratio)가 최소 3:1 이상이어야 요소의 형태를 인지할 수 있습니다.
- **상태 변화**: Hover/Focus 시 보더의 두께나 색상 변화가 뚜렷하여 사용자에게 피드백을 주어야 합니다.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link'],
      description: '버튼의 시각적 테마',
      table: { category: 'Appearance', defaultValue: { summary: 'outline' } },
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
    variant: 'outline', // Outline 스토리이므로 기본값 변경
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
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
  render: args => <IconButton {...args} />,
};

/**
 * [02. Colors]
 * Outline 스타일에서의 컬러 시스템 적용 예시입니다.
 * 배경색이 아닌 보더와 아이콘/텍스트 컬러에 시멘틱 컬러가 적용됩니다.
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
 * Outline 버튼은 인터랙션 시 배경색이 옅게 채워지거나 보더가 강조되는 등의 피드백을 제공합니다.
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
 * 각 사이즈별 보더 두께와 아이콘 크기의 조화를 확인합니다.
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
 * Outline 스타일에서는 보더의 곡률이 시각적으로 더 뚜렷하게 느껴집니다.
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
 * '자세히 보기'와 같은 내비게이션 링크를 Outline 스타일의 버튼으로 구성할 때 사용합니다.
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
