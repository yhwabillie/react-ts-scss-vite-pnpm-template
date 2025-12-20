import { ColorItem } from '@/components/ui/molecules/ColorChip/ColorChip';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundation/Semantic Color',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### 🎨 Color System Strategy
업계 표준 가이드를 준수하여 설계된 시스템 컬러입니다. 모든 컬러 토큰은 **Context-Aware**로 동작하며, 테마와 모드에 따라 값이 동적으로 매핑됩니다.

- **Primary & Accent**: 브랜드의 개성과 핵심 액션을 정의합니다.
- **Surface & Background**: 계층 구조(Elevation)를 형성하며, 라이트/다크 모드에서 반전된 명도를 제공합니다.
- **Feedback (Semantic)**: 성공, 경고, 에러 등 사용자에게 명확한 상태 변화를 전달합니다.
- **Accessibility**: 텍스트 가독성을 보장하기 위해 모든 모드에서 **WCAG 2.1 AA** 수준의 대비를 유지합니다.
        `,
      },
    },
  },
};

export default meta;

export const FullPalette: StoryObj = {
  render: () => (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <section>
        <ColorItem
          title='Outline Button'
          subtitle='버튼'
          colors={{
            'Outline Btn Bg': 'var(--bg-btn-outline)',
            'Outline Btn Text': 'var(--text-btn-outline)',
          }}
        />
      </section>

      {/* 1. Brand & Interaction Section */}
      <section>
        <ColorItem
          title='Brand Interaction'
          subtitle='브랜드 아이덴티티 및 주요 액션 (Primary, Secondary, Tertiary)'
          colors={{
            Primary: 'var(--color-primary)',
            'Primary Low': 'var(--color-primary-low)', // 배경용 연한 톤
            Secondary: 'var(--color-secondary)',
            Tertiary: 'var(--color-tertiary)',
            Accent: 'var(--color-accent)', // 강조 포인트
          }}
        />
      </section>

      {/* 2. Neutral Surface Section (가장 중요한 부분) */}
      <section>
        <ColorItem
          title='Surface & Neutral'
          subtitle='배경, 카드, 구분선 등 화면의 골격을 구성 (Light/Dark 모드 대응)'
          colors={{
            'Bg Base': 'var(--bg-base)', // 최하단 배경
            'Bg Elevated': 'var(--bg-elevated)', // 카드, 모달 등 떠있는 요소
            Border: 'var(--color-border)', // 일반 구분선
            'Border Strong': 'var(--color-border-strong)', // 강한 구분선
            'Text Main': 'var(--text-main)', // 본문 텍스트
            'Text Sub': 'var(--text-sub)', // 부가 설명 텍스트
            'Text Disabled': 'var(--text-disabled)', // 비활성화 텍스트
          }}
        />
      </section>

      {/* 3. Feedback Colors (상태 표시) */}
      <section>
        <ColorItem
          title='Feedback & Status'
          subtitle='시스템 상태를 사용자에게 직관적으로 전달'
          colors={{
            Success: 'var(--color-success)',
            'Success Bg': 'var(--color-success-bg)', // Alert 배경용
            Warning: 'var(--color-warn)',
            Error: 'var(--color-error)',
            Info: 'var(--color-info)',
          }}
        />
      </section>

      {/* 4. Interactive State Colors (선택 사항) */}
      <section>
        <ColorItem
          title='Interactive States'
          subtitle='마우스 오버, 클릭 등 상태 변화에 따른 컬러 가이드'
          colors={{
            'Hover Overlay': 'var(--color-hover-overlay)',
            'Active Overlay': 'var(--color-active-overlay)',
            Selected: 'var(--color-selected)',
          }}
        />
      </section>
    </div>
  ),
};
