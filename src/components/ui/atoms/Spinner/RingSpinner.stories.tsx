import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from './Spinner';
import RingSpinner from './LoadingSpinner/RingSpinner';
import { SpecimenCell, SpecimenRow } from '../../guide/Specimen';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Atoms/Spinner/RingSpinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '프로세스의 진행 상태를 나타내는 회전형 로딩 컴포넌트입니다. 작업의 경중이나 배치되는 위치에 따라 스타일과 크기를 자유롭게 조절할 수 있습니다.',
      },
    },
  },
  args: {
    variant: 'closed-ring',
    color: 'primary',
    size: 'xl',
  },
  argTypes: {
    // Variant
    variant: {
      control: 'select',
      options: ['open-ring', 'closed-ring'],
      table: { category: 'Styles' },
    },

    // Styles
    color: {
      control: 'select',
      description: '디자인 시스템에 정의된 테마 색상을 적용합니다.',
      options: ['primary', 'secondary', 'tertiary'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      description: 'Spinner 의 크기를 조절합니다.',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ClosedRing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '끊김이 없는 원형 선의 굵기 차이를 이용하여 회전 효과를 주는 기본 스타일입니다. 안정적이고 묵직한 로딩감을 줄 때 적합합니다.',
      },
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
  parameters: {
    docs: {
      description: {
        story:
          '한쪽 끝이 트여있는 형태의 스피너입니다. 가볍고 경쾌한 느낌을 주며, 버튼 내부나 좁은 공간에서 간결하게 로딩 상태를 표시하기 좋습니다.',
      },
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  args: {
    variant: 'open-ring',
  },
  render: args => {
    return <RingSpinner {...args} />;
  },
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '디자인 시스템의 시멘틱 컬러 시스템을 적용한 스피너입니다. 성공(success), 경고(warning), 에러(danger) 등 각 상황의 맥락에 맞는 컬러를 선택하여 사용합니다.',
      },
    },
  },
  render: args => {
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SpecimenRow>
          {colorOptions.map(color => (
            <SpecimenCell key={color} caption={color}>
              <RingSpinner {...args} color={color} />
            </SpecimenCell>
          ))}
        </SpecimenRow>
      </div>
    );
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
      <SpecimenRow>
        {sizeOptions.map(size => (
          <SpecimenCell key={size} caption={size}>
            <RingSpinner {...args} size={size} />
          </SpecimenCell>
        ))}
      </SpecimenRow>
    );
  },
};
