import type { Meta, StoryObj } from '@storybook/react-vite';
import Skeleton from './Skeleton';
import { GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Skeleton** 컴포넌트는 실제 데이터가 로딩되기 전, 콘텐츠의 레이아웃을 미리 보여주는 플레이스홀더(Placeholder)입니다. <br />' +
          '로딩 중 발생하는 레이아웃 흔들림(CLS)을 방지하고, 사용자에게 진행 상태를 시각적으로 전달하여 체감 대기 시간을 줄여줍니다. <br /><br />' +
          '• 텍스트, 원형, 사각형 등 실제 UI 구조에 맞는 형태 지원 <br />' +
          '• 부드러운 애니메이션을 통해 로딩 중임을 직관적으로 인지 <br />' +
          '• 다크모드 테마 컬러에 최적화된 배경 대비 적용',
      },
    },
  },
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
 * 텍스트 형태 (Text)
 * 문장이나 단락의 로딩 상태를 표현할 때 사용합니다.
 * 폰트 크기와 줄 높이에 맞춰 자연스럽게 배치되며, 다크 모드에서는 눈의 피로도를 고려한 저대비 쉬머 효과가 적용됩니다.
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
 * 원형 형태 (Circle)
 * 아바타, 아이콘, 원형 버튼 등 원형 요소의 로딩 상태를 표현합니다.
 * 크기에 관계없이 곡률이 50%로 고정되어 완벽한 원형을 유지합니다.
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
 * 사각형 형태 (Rectangle)
 * 카드 이미지, 썸네일, 배너 등 면적을 가진 콘텐츠 영역에 사용합니다.
 * `radius` 속성을 조절하여 실제 렌더링될 컴포넌트의 곡률과 일치시키는 것이 권장됩니다.
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
 * 복합 레이아웃 예시 (Usage)
 * 프로필, 카드 뉴스, 브레드크럼 등 실제 UI 패턴을 모방한 구성 예시입니다.
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
