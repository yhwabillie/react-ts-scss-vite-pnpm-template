import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { TokenData as TechTokens } from '../../../constants/generated/tech-tokens';
import ColorTokenTable from './ColorTokenTable';

const meta: Meta<typeof ColorTokenTable> = {
  title: 'Tokens/Themes/Tech',
  component: ColorTokenTable,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ToastProvider position='bottom-right'>
        {/* 테마 확인을 위해 data-theme 주입 */}
        <div data-theme='tech' style={{ padding: '1rem' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ColorTokenTable>;

/**
 * 1. 테마 전용 그룹화 로직
 * ID 패턴: --color-primary-breadcrumb-current-text
 */
const groupedTechTokens = TechTokens.reduce(
  (acc, token) => {
    // --color- 제거
    const cleanId = token.id.replace(/^--color-/, '');

    // 경로 분석 (primary-breadcrumb-current-text)
    // 보통 두 번째 단어가 컴포넌트 이름이 되는 경우가 많습니다.
    const parts = cleanId.split('-');

    // 'primary' 다음의 핵심 키워드(예: breadcrumb, button 등)를 그룹 키로 사용
    // 만약 형식이 다르면 index를 조정하거나 명시적인 매핑을 추가하세요.
    const groupKey = parts[1] || 'etc';

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(token);
    return acc;
  },
  {} as Record<string, typeof TechTokens>,
);

export const Breadcrumb: Story = {
  args: {
    title: 'Breadcrumb Tokens',
    category: 'Component',
    tokens: groupedTechTokens['breadcrumb'] || [],
  },
};

export const Avatar: Story = {
  args: {
    title: 'Avatar Tokens',
    category: 'Component',
    tokens: groupedTechTokens['avatar'] || [],
  },
};
