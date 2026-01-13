import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from '@/components/ui/atoms/Spinner/Spinner';
import RingSpinner from '@/components/ui/atoms/Spinner/Spinner';
import { SpecimenCell, SpecimenRow } from '@/components/ui/guide/Specimen';

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

/**
 * 닫힌 고리 형태 (Closed Ring)
 * 끊김이 없는 원형 선이 회전하며 로딩 상태를 나타내는 기본 변형입니다.
 */
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

/**
 * 열린 고리 형태 (Open Ring)
 * 선의 일부가 뚫려 있는 형태로, 회전 시 속도감과 방향성을 더 강조한 변형입니다.
 */
export const OpenRing: Story = {
  parameters: {
    docs: {
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

/**
 * 테마 색상 적용
 * 브랜드 식별을 위한 Primary 컬러와 보조적인 용도의 Secondary, Tertiary 컬러 적용 모습을 확인합니다.
 */
export const Colors: Story = {
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

/**
 * 규격 변주
 * 아주 작은 요소 내부(XS)부터 화면 전체의 로딩(XL)까지, 다양한 맥락에 대응하는 5가지 크기를 제공합니다.
 */
export const Sizes: Story = {
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
