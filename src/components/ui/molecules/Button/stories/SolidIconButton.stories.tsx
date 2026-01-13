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
        component:
          '**Solid IconButton**은 배경색이 채워진 고대비 버튼으로, 화면 내에서 가장 중요한 단일 액션을 수행할 때 사용합니다. <br /><br />' +
          '• 주요 실행 버튼(검색, 저장 등)에 적합한 높은 시각적 위계 <br />' +
          '• 텍스트가 없는 특성을 고려하여 `ariaLabel` 설정을 강제하며, 충분한 터치 타겟 확보 <br />',
      },
    },
  },
  argTypes: {
    // --- Appearance ---
    variant: {
      name: 'Variant',
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '버튼의 시각적 테마를 설정합니다.',
      table: {
        category: 'Appearance',
        type: { summary: "'solid' | 'outline' | 'ghost'" },
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      name: 'Color',
      control: 'select',
      options: COLOR_OPTIONS,
      description: '의미론적 색상 시스템을 적용합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
      },
    },

    // --- Layout ---
    size: {
      name: 'Size',
      control: 'inline-radio',
      options: SIZE_OPTIONS,
      description: '높이 및 내부 패딩 규격을 설정합니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'md' },
      },
    },
    shape: {
      name: 'Shape',
      control: 'inline-radio',
      options: SHAPE_OPTIONS,
      description: '모서리 곡률 타입을 결정합니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'rounded' },
      },
    },
    className: {
      name: 'Custom Class',
      control: 'text',
      description: '외부 스타일 주입을 위한 클래스명입니다.',
      table: { category: 'Layout' },
    },

    // --- Behavior & Actions ---
    as: {
      name: 'Component Tag',
      control: 'select',
      options: ['button', 'a', 'div', 'span'],
      description: '실제 렌더링될 HTML 태그를 지정합니다.',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'button' },
      },
    },
    href: {
      name: 'Link URL',
      control: 'text',
      description: '`as="a"`일 경우 이동할 경로입니다.',
      table: { category: 'Behavior' },
    },
    target: {
      name: 'Target',
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
      description: '링크 이동 시 브라우저 컨텍스트를 지정합니다.',
      table: { category: 'Behavior' },
    },
    onClick: {
      name: 'On Click',
      action: 'clicked',
      description: '버튼 클릭 시 실행되는 핸들러입니다.',
      table: { category: 'Behavior' },
    },

    // --- Data & Refs ---
    icon: {
      name: 'Icon',
      control: false,
      description: '렌더링될 아이콘 요소입니다.',
      table: { category: 'Data' },
    },
    ref: {
      name: 'Ref',
      control: false,
      description: '버튼 하위 요소에 접근하기 위한 참조 객체입니다.',
      table: { category: 'Data' },
    },

    // --- Accessibility ---
    ariaLabel: {
      name: 'Aria Label',
      control: 'text',
      description: '스크린 리더 사용자를 위한 대체 텍스트입니다. (필수)',
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
 * 컴포넌트의 기본 명세입니다.
 * 인터랙션 패널을 통해 프로퍼티 변화에 따른 실시간 렌더링 상태를 확인합니다.
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
 * 브랜드 식별 및 상태 전달(성공, 위험 등)을 위한 컬러 시스템입니다.
 * 각 컬러는 디자인 시스템의 시멘틱 위계를 따르며 명도 대비 가이드를 준수합니다.
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
 * 사용자 상호작용에 따른 시각적 피드백(Hover, Focus, Active, Disabled)을 검수합니다.
 * 모든 의사 클래스 상태에서 일관된 스타일이 유지되는지 확인합니다.
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
 * 레이아웃 밀도에 대응하는 5단계 크기 시스템입니다.
 * XS, SM 사이즈의 경우 아이콘 가독성을 위해 선 두께(Stroke)가 2.0으로 자동 보정됩니다.
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
 * UI 컨텍스트에 따른 모서리 곡률 옵션입니다.
 * - Square/Rounded: 정교한 제어 도구 및 툴바 UI
 * - Pill: 강조가 필요한 독립적 액션 UI
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
 * 디자인은 유지하되 HTML 태그를 `<a>`로 변경하여 내비게이션 역할을 수행합니다.
 * 접근성(aria-label)과 보안 속성(rel)이 포함된 시나리오를 테스트합니다.
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
