import type { Meta, StoryObj } from '@storybook/react-vite';
import FractionIndicator from './FractionIndicator';

const meta: Meta<typeof FractionIndicator> = {
  title: 'UI/Atoms/FractionIndicator',
  component: FractionIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**FractionIndicator**는 캐러셀 페이지네이션의 분수형 표시를 위한 컴포넌트입니다. <br /><br />' +
          '• **Visual Token**: 색상/크기/스타일 변형을 제공합니다. <br />' +
          '• **Composable**: Swiper 등 외부 라이브러리의 pagination 엘리먼트로 전달하여 사용합니다.',
      },
    },
  },
  argTypes: {
    size: {
      description: '표시 크기',
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      table: {
        category: 'Style',
        type: { summary: 'sm | md' },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      description: '표시 스타일',
      control: { type: 'inline-radio' },
      options: ['solid', 'outline'],
      table: {
        category: 'Style',
        type: { summary: 'solid | outline' },
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      description: '컬러 톤',
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'tertiary'],
      table: {
        category: 'Style',
        type: { summary: 'primary | secondary | tertiary' },
        defaultValue: { summary: 'primary' },
      },
    },
    className: {
      description: '커스텀 클래스',
      control: { type: 'text' },
      table: {
        category: 'Style',
        type: { summary: 'string' },
      },
    },
    children: {
      description: '표시할 분수 텍스트 (ex: 1/5)',
      control: { type: 'text' },
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
  },
  args: {
    size: 'md',
    variant: 'solid',
    color: 'primary',
    children: (
      <>
        <span className='swiper-pagination-current'>1</span> /{' '}
        <span className='swiper-pagination-total'>5</span>
      </>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof FractionIndicator>;

export const Base: Story = {
  render: args => (
    <div style={{ padding: '24px' }}>
      <FractionIndicator {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: args => (
    <div style={{ padding: '24px', display: 'grid', gap: '12px' }}>
      <FractionIndicator {...args} variant='solid' />
      <FractionIndicator {...args} variant='outline' />
    </div>
  ),
};

export const Colors: Story = {
  render: args => (
    <div style={{ padding: '24px', display: 'grid', gap: '12px' }}>
      <FractionIndicator {...args} color='primary' />
      <FractionIndicator {...args} color='secondary' />
      <FractionIndicator {...args} color='tertiary' />
    </div>
  ),
};
