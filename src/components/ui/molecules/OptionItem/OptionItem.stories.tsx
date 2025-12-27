import type { Meta, StoryObj } from '@storybook/react-vite';
import OptionItem from './OptionItem';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';

/**
 * [OptionItem]
 * 셀렉트박스나 리스트 내의 개별 선택 항목입니다.
 * - **Accessibility**: `role="option"`을 가지며 `aria-selected`와 `aria-disabled`를 지원합니다.
 * - **Visual Feedback**: 선택 시 체크 아이콘이 나타나며, 활성화(`isActive`) 상태 시 포커스 스타일이 적용됩니다.
 */
const meta = {
  title: 'UI/Molecules/OptionItem',
  component: OptionItem,
  tags: ['autodocs'],
  args: {
    id: 'opt-1',
    value: '2025년',
    variant: 'outline',
    color: 'primary',
    size: 'sm',
    selected: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
    },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    onSelect: { action: 'selected' },
  },
} satisfies Meta<typeof OptionItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Base States]
 * 기본, 선택됨, 비활성화, 활성화(Focus) 상태를 비교합니다.
 */
export const States: Story = {
  render: args => (
    <AnatomyWrapper title='Option Item States' style={{ width: '200px' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <OptionItem {...args} id='base' value='Default Item' />
        <OptionItem {...args} id='selected' value='Selected Item' selected />
        <OptionItem {...args} id='active' value='Active (Focused)' isActive />
        <OptionItem {...args} id='disabled' value='Disabled Item' disabled />
      </ul>
    </AnatomyWrapper>
  ),
};

/**
 * [02. Size Variations]
 * XS부터 XL까지 각 사이즈별 텍스트 및 아이콘 크기를 확인합니다.
 */
export const Sizes: Story = {
  render: args => (
    <SpecimenWrapper>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <SpecimenGroup key={size} title={size.toUpperCase()}>
          <OptionItem {...args} size={size} value={`${size.toUpperCase()} Size`} selected />
        </SpecimenGroup>
      ))}
    </SpecimenWrapper>
  ),
};

/**
 * [03. Color Variations]
 * 디자인 시스템의 시맨틱 컬러가 적용된 항목들을 확인합니다.
 */
export const Colors: Story = {
  render: args => (
    <SpecimenWrapper>
      {(['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const).map(
        color => (
          <SpecimenGroup key={color} title={color.toUpperCase()} direction='row'>
            <div style={{ width: '150px' }}>
              <OptionItem {...args} color={color} value={`${color}`} selected />
              <OptionItem {...args} color={color} variant='ghost' value={`${color} Ghost`} />
            </div>
          </SpecimenGroup>
        ),
      )}
    </SpecimenWrapper>
  ),
};

/**
 * [04. Long Text]
 * 텍스트가 길어질 때 `title` 속성과 말줄임(Ellipsis) 처리를 확인합니다.
 */
export const LongText: Story = {
  args: {
    value: '매우 길어서 말줄임표가 생겨야 하는 연도나 월 옵션 텍스트 예시입니다.',
  },
  render: args => (
    <AnatomyWrapper title='Ellipsis Check' style={{ width: '150px' }}>
      <OptionItem {...args} />
    </AnatomyWrapper>
  ),
};
