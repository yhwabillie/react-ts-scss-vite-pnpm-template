import type { Meta, StoryObj } from '@storybook/react-vite';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Molecules/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '아바타의 크기를 설정합니다.',
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square'],
      description: '아바타의 외형을 설정합니다.',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy', undefined],
      description: '사용자의 현재 접속 상태를 나타냅니다.',
    },
    src: { control: 'text', description: '이미지 경로입니다.' },
    alt: { control: 'text', description: '이미지 설명을 제공합니다.' },
    name: { control: 'text', description: '이미지 부재 시 표시할 이름입니다.' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

/**
 * 💡 Base: 이미지가 정상적으로 로드된 기본적인 아바타입니다.
 */
export const Base: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
    alt: '사용자 프로필 이미지',
    size: 'md',
    shape: 'circle',
  },
};

/**
 * 🔠 Fallback: 이미지 경로가 없거나 로드에 실패했을 때 이름의 이니셜을 표시합니다.
 * - [가려짐 방지] 이니셜 텍스트가 아바타 영역 내에서 중앙에 위치하고 잘리지 않는지 확인합니다.
 */
export const FallbackName: Story = {
  args: {
    alt: '홍길동님 프로필',
    name: '홍길동',
    size: 'md',
  },
};

/**
 * 🟢 Status: 온라인, 오프라인 등 사용자의 상태를 표시합니다.
 * - [가려짐 방지] 상태 아이콘이 아바타 본체를 너무 많이 가리지(Obscured) 않는지 체크합니다.
 */
export const WithStatus: Story = {
  render: args => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
      <Avatar {...args} status='online' />
      <Avatar {...args} status='busy' />
      <Avatar {...args} status='away' />
      <Avatar {...args} status='offline' />
    </div>
  ),
  args: {
    ...Base.args,
    size: 'lg',
  },
};

/**
 * 📏 Sizes & Shapes: 모든 크기와 모양 변형을 한눈에 비교합니다.
 */
export const Variants: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Avatar {...args} size='sm' />
        <Avatar {...args} size='md' />
        <Avatar {...args} size='lg' />
        <Avatar {...args} size='xl' />
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Avatar {...args} shape='square' size='sm' />
        <Avatar {...args} shape='square' size='md' />
        <Avatar {...args} shape='square' size='lg' />
        <Avatar {...args} shape='square' size='xl' />
      </div>
    </div>
  ),
  args: {
    ...Base.args,
  },
};
