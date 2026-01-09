import type { Meta, StoryObj } from '@storybook/react-vite';
import Skeleton from './Skeleton';
import { GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    // --- Appearance: 외형 및 형태 ---
    variant: {
      control: 'inline-radio',
      options: ['text', 'circle', 'rect'],
      description: '스켈레톤의 기본 형태를 결정합니다. `circle`은 강제로 원형(50%)이 적용됩니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'text' },
      },
    },

    // --- Layout: 크기 및 곡률 ---
    width: {
      control: 'text',
      description: '너비를 설정합니다. 숫자(px) 또는 단위를 포함한 문자열(%, rem 등)이 가능합니다.',
      table: {
        category: 'Layout',
      },
    },
    height: {
      control: 'text',
      description: '높이를 설정합니다. `text` 타입은 폰트 크기에 비례하여 자동 조절을 권장합니다.',
      table: {
        category: 'Layout',
      },
    },
    radius: {
      control: 'text',
      description:
        '모서리 곡률을 설정합니다. `variant="rect"`에서 커스텀 곡률이 필요할 때 사용합니다.',
      table: {
        category: 'Layout',
      },
    },

    // --- Utility & Customization ---
    className: {
      control: 'text',
      description: '추가적인 커스텀 CSS 클래스입니다.',
      table: {
        category: 'Utility',
      },
    },
    style: {
      control: 'object',
      description: '인라인 스타일을 통해 세부적인 스타일을 직접 조정합니다.',
      table: {
        category: 'Utility',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

/**
 * [Text] 가장 일반적인 텍스트 형태의 스켈레톤입니다.
 * - 글꼴 크기나 줄 높이에 맞춰 자연스러운 로딩 상태를 연출합니다.
 * - 다크모드(#121212)에서는 배경과의 명도 대비를 낮춘 은은한 쉬머(Shimmer) 효과가 적용됩니다.
 */
export const Text: Story = {
  args: {
    variant: 'text',
    width: '400px',
    height: 20,
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Skeleton {...args} />
      </GuideWrapper>
    );
  },
};

/**
 * [Circle] 프로필 이미지나 아이콘 로딩에 최적화된 원형 스켈레톤입니다.
 * - `variant="circle"` 설정 시 `borderRadius`는 강제로 50%로 고정됩니다.
 * - 우리가 앞서 작업했던 Avatar 컴포넌트의 로딩 상태로 주로 활용됩니다.
 */
export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 60,
    height: 60,
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Skeleton {...args} />
      </GuideWrapper>
    );
  },
};

/**
 * [Rectangle] 이미지 카드, 배너, 버튼 등 사각형 콘텐츠를 위한 스켈레톤입니다.
 * - `radius` 속성을 통해 실제 콘텐츠의 곡률과 일치시켜 로딩 시 이질감을 최소화합니다.
 */
export const Rectangle: Story = {
  args: {
    variant: 'rect',
    width: 300,
    height: 180,
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <Skeleton {...args} />
      </GuideWrapper>
    );
  },
};

/**
 * [Usage] 실제 UI 레이아웃을 모방한 스켈레톤의 복합 사용 예시입니다.
 * - Profile: Avatar + 상세 설명 텍스트 구조 재현
 * - Card: 이미지 영역 + 제목 및 본문 텍스트 구조 재현
 * - Navigation: 브레드크럼(Breadcrumb) 스타일의 경로 로딩 재현
 * * [웹 표준 및 접근성 가이드]
 * 1. CLS(Cumulative Layout Shift) 방지: 실제 렌더링될 요소와 동일한 크기를 지정하여 레이아웃 흔들림을 방지하세요.
 * 2. 2025-12-31 약속 준수: 스켈레톤은 정보가 없는 상태이므로 `title` 속성 사용을 금지합니다.
 * 3. Accessibility: 컨테이너 레벨에서 `aria-busy="true"`를 설정하여 스크린 리더 사용자에게 로딩 중임을 알리세요.
 * 4. Dark Mode: 배경(#121212) 위에서 쉬머 투명도를 0.05로 낮춰 시각적 피로도를 최소화했습니다.
 */
export const Usage: Story = {
  render: () => (
    <GuideWrapper
      style={{
        width: 'fit-content',
        margin: 'auto',
        gap: '60px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '400px' }}>
        <Skeleton variant='circle' width={48} height={48} style={{ flex: '0 0 auto' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 auto' }}>
          <Skeleton variant='text' width='100%' height={20} />
          <Skeleton variant='text' width='60%' height={14} />
        </div>
      </div>

      <div
        style={{
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Skeleton variant='rect' width='100%' height={160} style={{ borderRadius: '8px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton variant='text' width='90%' height={24} />
          <Skeleton variant='text' width='100%' height={16} />
          <Skeleton variant='text' width='60%' height={16} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', width: '400px' }}>
        <Skeleton variant='text' width={40} height={16} />
        <span style={{ color: 'var(--stroke-color-avatar)', opacity: 0.3 }}>/</span>
        <Skeleton variant='text' width={60} height={16} />
        <span style={{ color: 'var(--stroke-color-avatar)', opacity: 0.3 }}>/</span>
        <Skeleton variant='text' width={80} height={16} />
      </div>
    </GuideWrapper>
  ),
};
