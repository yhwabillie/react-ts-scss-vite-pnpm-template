import type { Meta, StoryObj } from '@storybook/react-vite';
import AutoCarousel from './AutoCarousel';

const meta: Meta<typeof AutoCarousel> = {
  title: 'UI/Organisms/Carousel/AutoCarousel',
  component: AutoCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**AutoCarousel**은 자동 재생, 네비게이션, 분수형 페이지네이션을 제공하는 캐러셀입니다. <br /><br />' +
          '• **Autoplay Control**: 재생/정지 버튼으로 사용자 제어를 제공합니다. <br />' +
          '• **Responsive Layout**: 화면 크기에 따라 `slidesPerView`가 변경됩니다. <br />' +
          '• **Accessibility**: 현재 보이는 슬라이드만 포커스 가능하도록 처리됩니다.',
      },
    },
  },
  argTypes: {
    title: {
      description: '캐러셀 타이틀 텍스트',
      control: { type: 'text' },
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    items: {
      description:
        '슬라이드 데이터 목록입니다. 각 항목은 고유 id와 타이틀을 포함하며, 필요 시 링크를 지정할 수 있습니다.',
      control: { type: 'object' },
      table: {
        category: 'Data',
        type: {
          summary: '{ id: string; title: string; href?: string }[]',
        },
      },
    },
  },
  args: {
    title: '나의 맞춤 정책제도',
    items: [
      { id: 'policy-1', title: '정책1', href: '#' },
      { id: 'policy-2', title: '정책2', href: '#' },
      { id: 'policy-3', title: '정책3', href: '#' },
      { id: 'policy-4', title: '정책4', href: '#' },
      { id: 'policy-5', title: '정책5', href: '#' },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof AutoCarousel>;

export const Base: Story = {
  render: args => (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      <AutoCarousel {...args} />
    </div>
  ),
};
