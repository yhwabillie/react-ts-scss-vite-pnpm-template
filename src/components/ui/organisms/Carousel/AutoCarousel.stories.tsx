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
      description: '캐러셀 상단에 표시되는 타이틀 텍스트입니다.',
      control: { type: 'text' },
      table: {
        category: 'Data',
        type: { summary: 'string' },
        defaultValue: { summary: '자동 캐러샐 타이틀' },
      },
    },
    items: {
      description:
        '슬라이드 데이터 목록입니다. 각 항목은 고유 id/타이틀을 포함하며, 설명/이미지/링크를 지정할 수 있습니다.',
      control: { type: 'object' },
      table: {
        category: 'Data',
        type: {
          summary:
            '{ id: string; title: string; desc?: string; imgSrc?: string; imgAlt?: string; href?: string }[]',
        },
        defaultValue: {
          summary: '기본 5개 슬라이드',
        },
      },
    },
  },
  args: {
    title: '자동 캐러샐 타이틀',
    items: [
      {
        id: 'policy-1',
        title: '슬라이드 아이템 타이틀 1',
        desc: '슬라이드 아이템 자세한 설명입니다. 슬라이드 아이템 자세한 설명입니다.',
        imgSrc:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23E8F0FE"/><circle cx="36" cy="40" r="16" fill="%234F7FFF"/><rect x="58" y="30" width="38" height="20" fill="%2399B5FF"/></svg>',
        imgAlt: '정책1 이미지',
        href: '#',
      },
      {
        id: 'policy-2',
        title: '슬라이드 아이템 타이틀 2',
        desc: '슬라이드 아이템 자세한 설명입니다. 슬라이드 아이템 자세한 설명입니다.',
        imgSrc:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23FFF4E6"/><rect x="20" y="24" width="32" height="32" fill="%23FF9F43"/><path d="M68 28h32v8H68zM68 44h24v8H68z" fill="%23FFC48A"/></svg>',
        imgAlt: '정책2 이미지',
        href: '#',
      },
      {
        id: 'policy-3',
        title: '슬라이드 아이템 타이틀 3',
        desc: '슬라이드 아이템 자세한 설명입니다. 슬라이드 아이템 자세한 설명입니다.',
        imgSrc:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23EAF7EF"/><path d="M24 52l16-24 16 24H24z" fill="%232ECC71"/><rect x="62" y="28" width="34" height="24" fill="%239BE7B3"/></svg>',
        imgAlt: '정책3 이미지',
        href: '#',
      },
      {
        id: 'policy-4',
        title: '슬라이드 아이템 타이틀 4',
        desc: '슬라이드 아이템 자세한 설명입니다. 슬라이드 아이템 자세한 설명입니다.',
        imgSrc:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23F3E8FF"/><circle cx="40" cy="40" r="14" fill="%238E44AD"/><path d="M62 28h34v24H62z" fill="%23C9A6E8"/></svg>',
        imgAlt: '정책4 이미지',
        href: '#',
      },
      {
        id: 'policy-5',
        title: '슬라이드 아이템 타이틀 5',
        desc: '슬라이드 아이템 자세한 설명입니다. 슬라이드 아이템 자세한 설명입니다.',
        imgSrc:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23FFE8EC"/><rect x="22" y="22" width="28" height="36" fill="%23E74C3C"/><circle cx="78" cy="40" r="16" fill="%23F5B7B1"/></svg>',
        imgAlt: '정책5 이미지',
        href: '#',
      },
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
