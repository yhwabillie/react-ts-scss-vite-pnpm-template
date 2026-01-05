import type { Meta, StoryObj } from '@storybook/react-vite';
import Skeleton from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['text', 'circle', 'rect'],
      description: '스켈레톤의 외형 타입을 결정합니다.',
    },
    width: {
      control: 'text',
      description: '너비를 설정합니다. (숫자 또는 단위 포함 문자열)',
    },
    height: {
      control: 'text',
      description: '높이를 설정합니다. (숫자 또는 단위 포함 문자열)',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

/**
 * 💡 Base: 가장 기본적인 텍스트 형태의 스켈레톤입니다.
 */
export const Text: Story = {
  args: {
    variant: 'text',
    width: '100%',
    height: 20,
  },
};

/**
 * 🔵 Circle: 아바타나 원형 아이콘의 로딩 상태를 시뮬레이션합니다.
 */
export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 60,
    height: 60,
  },
};

/**
 * ⬛ Rect: 이미지 카드나 배너의 로딩 상태를 시뮬레이션합니다.
 */
export const Rectangle: Story = {
  args: {
    variant: 'rect',
    width: 300,
    height: 180,
  },
};

/**
 * 🍱 Dashboard (Usage Example): 실제 컴포넌트 구조 내에서 스켈레톤이 어떻게 쓰이는지 확인합니다.
 * - [가려짐 방지] 각 요소 간의 간격이 실제 UI와 동일하게 유지되어 레이아웃이 가려지지 않는지 확인합니다.
 */
export const DashboardExample: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        width: '400px',
      }}
    >
      <Skeleton variant='circle' width={50} height={50} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton variant='text' width='60%' height={16} />
        <Skeleton variant='text' width='90%' height={12} />
      </div>
    </div>
  ),
};
