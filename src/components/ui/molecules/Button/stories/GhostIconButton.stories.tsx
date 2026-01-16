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
import Input from '@/components/ui/atoms/Input/Input';

/**
 * [Constants]
 */
const COLOR_OPTIONS = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const;
const SIZE_OPTIONS = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
const SHAPE_OPTIONS = ['square', 'rounded', 'pill'] as const;

const meta: Meta<typeof IconButton> = {
  title: 'UI/Molecules/Button/IconButton/Ghost',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Ghost IconButton**은 평상시에는 배경과 보더가 노출되지 않다가 인터랙션(Hover/Focus) 시에만 시각적 피드백이 나타나는 스타일입니다. 
가장 낮은 위계(Low Emphasis)를 가지며 인터페이스의 복잡도를 낮추는 데 유용합니다.
        `,
      },
    },
  },
  argTypes: {
    // --- 🎨 Appearance (시각적 스타일) ---
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '버튼의 시각적 테마를 결정합니다.',
      table: {
        category: 'Appearance',
        type: { summary: "'solid' | 'outline' | 'ghost'" },
        defaultValue: { summary: 'ghost' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      description: '디자인 시스템의 시멘틱 컬러 시스템을 적용합니다.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },

    // --- 📐 Layout (구조 및 크기) ---
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '아이콘의 크기와 버튼의 전체 클릭 영역을 결정합니다.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    shape: {
      control: 'inline-radio',
      options: ['rounded', 'square', 'pill'],
      description: '버튼 모서리의 곡률(Border Radius)을 조절합니다.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'rounded' },
      },
    },

    // --- ⚙️ Behavior & Etc (동작 및 기타) ---
    ref: {
      description: 'HTML 버튼(또는 지정된 태그) 요소에 직접 접근하기 위한 ref 객체입니다.',
      control: false, // 사용자가 직접 스토리북 패널에서 ref를 입력할 수 없으므로 비활성화
      table: {
        category: 'Behavior',
        type: { summary: 'RefObject<HTMLButtonElement | null>' },
      },
    },

    // --- 🧩 Content (내부 요소) ---
    icon: {
      control: false,
      description: '중심에 배치될 아이콘 요소입니다.',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },

    // --- ♿ Accessibility (접근성) ---
    ariaLabel: {
      name: 'aria-label',
      control: 'text',
      description: `텍스트가 없는 버튼에서는 이 값이 없으면 버튼의 목적을 알 수 없습니다.`,
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
      },
      type: { name: 'string', required: true }, // 필수 값 강제
    },

    // --- ⚙️ Behavior & Etc (동작 및 기타) ---
    as: {
      control: 'select',
      options: ['button', 'a', 'div', 'span'],
      description: '컴포넌트가 실제로 렌더링될 HTML 태그를 지정합니다.',
      table: {
        category: 'Behavior',
        type: { summary: 'ElementType' },
        defaultValue: { summary: 'button' },
      },
    },
    href: {
      control: 'text',
      description: '\`as="a"\`일 경우 연결될 목적지 주소입니다.',
      table: { category: 'Behavior' },
    },
    target: {
      control: 'inline-radio',
      options: ['_blank'],
      description: '링크 클릭 시 열릴 창의 형태입니다.',
      table: { category: 'Behavior' },
    },
    className: {
      control: 'text',
      description: '추가적인 커스텀 스타일링 클래스입니다.',
      table: { category: 'Etc' },
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 발생하는 이벤트 핸들러입니다.',
      table: { category: 'Behavior' },
    },
  },
  args: {
    variant: 'ghost',
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
 * * 가장 표준적인 단일 아이콘 버튼의 형태입니다.
 * 클릭 영역(Hit Area)이 사용자의 조작에 충분한지 확인하세요.
 */
export const Base: Story = {
  render: args => <IconButton {...args} />,
};

/**
 * * Ghost 스타일은 배경이 투명하므로 아이콘 자체의 색상으로 상태(성공, 경고 등)를 전달합니다.
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
 * Ghost 버튼은 인터랙션이 발생하기 전까지 투명한 상태를 유지하여 시각적 노이즈를 줄입니다.
 * 가상 클래스(`.pseudo-*`)를 통해 Hover, Focus, Active 시 배경이 채워지는 피드백을 검수합니다.
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
 * 아이콘의 크기(`Icon Size`)와 버튼의 전체 클릭 영역(`Hit Area`)이 정해진 규격에 맞게 변하는지 확인합니다.
 * - **접근성 팁**: 최소 클릭 영역은 보통 44x44px(또는 48x48px) 이상을 권장하며, 'xs' 사이즈 사용 시 주변 요소와의 간격에 주의하세요.
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
 * Input 컴포넌트의 내부 슬롯(`adornedStart`, `adornedEnd`)에 배치된 형태를 검수합니다.
 * - 반드시 명확한 `ariaLabel`을 부여하고, 추가 설명이 필요하다면 별도의 툴팁 컴포넌트나 텍스트를 활용하세요.
 * 2. **클릭 영역**: 슬롯 내부에서도 버튼의 클릭 영역이 겹치거나 잘리지 않는지 확인이 필요합니다.
 */
export const Composition: Story = {
  render: args => {
    const baseId = useId();
    return (
      <GuideGroup>
        <GuideRow direction='column'>
          <GuideCell caption='Input with Left Ghost Icon'>
            <Input
              id={`${baseId}-left`}
              size='md'
              className='adorned-start'
              placeholder='정보를 입력해 주세요'
              adornedStart={
                <IconButton
                  {...args}
                  size='md'
                  ariaLabel='검색 버튼'
                  icon={<Icon name='search' strokeWidth={2.5} />}
                />
              }
            />
          </GuideCell>
          <GuideCell caption='Input with Right Ghost Icon'>
            <Input
              id={`${baseId}-right`}
              size='md'
              className='adorned-end'
              placeholder='정보를 입력해 주세요'
              adornedEnd={
                <IconButton
                  {...args}
                  size='md'
                  ariaLabel='검색 버튼'
                  icon={<Icon name='search' strokeWidth={2.5} />}
                />
              }
            />
          </GuideCell>
        </GuideRow>
      </GuideGroup>
    );
  },
};
