import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from '../molecules/Toast/ToastProvider';
import TypographyTokenTable from './TypographyTokenTable';
import { TypographyTokensData } from '@/constants/generated/typography-tokens';

const meta: Meta<typeof TypographyTokenTable> = {
  title: 'Tokens/Common/Typography',
  component: TypographyTokenTable,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ToastProvider position='bottom-right'>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TypographyTokenTable>;

// 공통 필터링 함수
const getTokensByLang = (category: string, lang: string) => {
  const prefix = `typo-${category.toLowerCase()}`; // 예: typo-display

  return TypographyTokensData.filter(
    t =>
      // 1. 해당 카테고리로 명확하게 시작하는지 확인 (중복 방지)
      t.id.startsWith(prefix) &&
      // 2. 해당 언어로 끝나는지 확인
      t.id.endsWith(lang),
  );
};

export const DisplayScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Display 한국어'
        category='System'
        tokens={getTokensByLang('display', 'ko')}
      />
      <TypographyTokenTable
        title='Display 영어'
        category='System'
        tokens={getTokensByLang('display', 'en')}
      />
      <TypographyTokenTable
        title='Display 일본어'
        category='System'
        tokens={getTokensByLang('display', 'ja')}
      />
    </div>
  ),
};

export const HeadingScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Heading 한국어'
        category='System'
        tokens={getTokensByLang('heading', 'ko')}
      />
      <TypographyTokenTable
        title='Heading 영어'
        category='System'
        tokens={getTokensByLang('heading', 'en')}
      />
      <TypographyTokenTable
        title='Heading 일본어'
        category='System'
        tokens={getTokensByLang('heading', 'ja')}
      />
    </div>
  ),
};

export const SubTitleScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='SubTitle 한국어'
        category='System'
        tokens={getTokensByLang('sub-title', 'ko')}
      />
      <TypographyTokenTable
        title='SubTitle 영어'
        category='System'
        tokens={getTokensByLang('sub-title', 'en')}
      />
      <TypographyTokenTable
        title='SubTitle 일본어'
        category='System'
        tokens={getTokensByLang('sub-title', 'ja')}
      />
    </div>
  ),
};
