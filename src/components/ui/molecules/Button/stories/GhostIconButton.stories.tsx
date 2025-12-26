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
### 💡 컴포넌트 개요
**Ghost IconButton**은 평상시에는 배경과 보더가 노출되지 않다가 인터랙션(Hover/Focus) 시에만 시각적 피드백이 나타나는 스타일입니다. 가장 낮은 위계(Low Emphasis)를 가지며 인터페이스의 복잡도를 낮추는 데 유용합니다.

### 📝 디자인 가이드 (Designer's Note)
- **사용 처**: 복잡한 데이터 테이블의 액션 버튼, 툴바, 혹은 **Input 컴포넌트 내부의 보조 액션**에 주로 사용합니다.
- **레이아웃 전략**: 배경이 없으므로 주변 요소와의 간격(Gap) 배치가 중요하며, 여러 개 나열되어도 시각적 부담이 적습니다.
- **컴포지션**: Input의 \`adornedStart\`, \`adornedEnd\` 슬롯에 배치하여 검색, 비밀번호 보기 등의 기능을 제공할 때 최적입니다.

### ♿ 접근성 가이드 (A11y)
- **인지 가능성**: 평상시 배경이 없으므로 아이콘의 형태가 명확해야 하며, 충분한 여백을 두어 클릭 영역임을 암시해야 합니다.
- **상태 피드백**: Hover 시 나타나는 배경색이 배경과 충분히 대비되어야 합니다.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link'],
      description: '버튼의 시각적 테마',
      table: { category: 'Appearance', defaultValue: { summary: 'ghost' } },
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
 * [01. Base]
 * 가장 기본이 되는 단일 컴포넌트 명세입니다.
 */
export const Base: Story = {
  render: args => <IconButton {...args} />,
};

/**
 * [02. Colors]
 * Ghost 스타일은 배경이 투명하므로 아이콘 자체의 색상으로 의미를 전달합니다.
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
 * Ghost 버튼은 인터랙션이 발생하기 전까지 투명한 상태를 유지합니다.
 * 인터랙션 시 배경이 살짝 채워지는 피드백을 확인합니다.
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
 * [05. Composition]
 * 내부 슬롯(adornedStart, adornedEnd)에 Ghost IconButton이 배치된 결합 형태입니다.
 * 요소 간의 간격(Gap)과 클릭 영역이 충분히 확보되었는지 레이아웃을 검수합니다.
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
              size={args.size}
              className='adorned-start'
              adornedStart={
                <IconButton
                  {...args}
                  ariaLabel='검색 버튼'
                  icon={<Icon name='search' strokeWidth={2.5} />}
                />
              }
            />
          </GuideCell>
          <GuideCell caption='Input with Right Ghost Icon'>
            <Input
              id={`${baseId}-right`}
              size={args.size}
              className='adorned-end'
              adornedEnd={
                <IconButton
                  {...args}
                  ariaLabel='검색 삭제'
                  icon={<Icon name='x' strokeWidth={2.5} />}
                />
              }
            />
          </GuideCell>
        </GuideRow>
      </GuideGroup>
    );
  },
};
