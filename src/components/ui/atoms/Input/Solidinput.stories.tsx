import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';
import Icon from '../Icon/Icon'; // 아이콘 컴포넌트 가정

const meta = {
  title: 'UI/Molecules/Input/Solid',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // 1. Identification
    id: { table: { category: 'Identification' } },
    as: { table: { category: 'Identification' } },

    // 2. Behavioral
    type: {
      control: 'select',
      options: ['text', 'number', 'email'],
      table: { category: 'Behavioral' },
    },
    value: { control: 'text', table: { category: 'Behavioral' } },

    // 3. Styles
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'soft'],
      table: { category: 'Styles' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },
    shape: {
      control: 'inline-radio',
      options: ['rounded', 'square', 'pill'],
      table: { category: 'Styles' },
    },

    // 4. Contents (Adornments)
    adornedStart: { table: { category: 'Contents' } },
    adornedEnd: { table: { category: 'Contents' } },
  },
  args: {
    variant: 'outline',
    color: 'tertiary',
    size: 'md',
    shape: 'rounded',
    type: 'text',
    placeholder: '내용을 입력하세요',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 가장 기본적인 텍스트 입력창 형태입니다.
 */
export const Default: Story = {};

/**
 * 아이콘이나 버튼이 포함된 입력창 형태입니다. (Adornments)
 */
export const WithAdornments: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      {/* 시작 부분 장식 */}
      <Input
        {...args}
        adornedStart={<Icon name='search' style={{ color: '#999', marginLeft: '8px' }} />}
        placeholder='검색어를 입력하세요'
      />

      {/* 끝 부분 장식 */}
      <Input
        {...args}
        type='email'
        adornedEnd={
          <span style={{ marginRight: '8px', fontSize: '12px', color: '#666' }}>@gmail.com</span>
        }
        placeholder='아이디'
      />
    </div>
  ),
};

/**
 * 모든 변형(Variant) 상태를 확인합니다.
 */
export const Variants: Story = {
  render: args => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <Input {...args} variant='solid' placeholder='Solid' />
      <Input {...args} variant='outline' placeholder='Outline' />
      <Input {...args} variant='soft' placeholder='Soft' />
      <Input {...args} variant='ghost' placeholder='Ghost' />
    </div>
  ),
};

/**
 * 모양(Shape)에 따른 시각적 변화를 확인합니다.
 */
export const Shapes: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input {...args} shape='square' placeholder='Square' />
      <Input {...args} shape='rounded' placeholder='Rounded' />
      <Input {...args} shape='pill' placeholder='Pill' />
    </div>
  ),
};
