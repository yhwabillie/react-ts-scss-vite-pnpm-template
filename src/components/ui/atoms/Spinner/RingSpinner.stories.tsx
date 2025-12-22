import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from './Spinner';
import RingSpinner from './LoadingSpinner/RingSpinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Atoms/Spinner/RingSpinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '',
      },
    },
  },
  args: {
    variant: 'closed-ring',
    color: 'primary',
    size: 'xl',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ClosedRing: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  args: {
    variant: 'closed-ring',
  },
  render: args => {
    return <RingSpinner {...args} />;
  },
};

export const OpenRing: Story = {
  args: {
    variant: 'open-ring',
  },
  render: args => {
    return <RingSpinner {...args} />;
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '다섯 가지 표준 사이즈(XS ~ XL)에 따른 버튼의 크기 변화와 내부 요소의 비율을 확인합니다.',
      },
    },
  },
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    return (
      <div style={{ display: 'inline-flex', gap: '15px', alignItems: 'end' }}>
        {sizeOptions.map(size => (
          <div
            key={size}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 'bold',
              }}
            >
              {size.toUpperCase()}
            </span>
            <RingSpinner {...args} size={size} />
          </div>
        ))}
      </div>
    );
  },
};
