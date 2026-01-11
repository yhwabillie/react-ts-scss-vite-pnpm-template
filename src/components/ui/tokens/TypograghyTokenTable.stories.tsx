import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from '../molecules/Toast/ToastProvider';
import TypographyTokenTable from './TypographyTokenTable';
import { TypographyTokensData } from '@/constants/generated/typography-tokens';

const meta: Meta<typeof TypographyTokenTable> = {
  title: 'Tokens/Common/Typography',
  component: TypographyTokenTable,
  tags: ['autodocs'],
  argTypes: {
    // --- [Category: Table Settings] ---
    title: {
      name: 'Table Title',
      control: 'text',
      table: { category: 'Table Settings' },
    },
    category: {
      name: 'Token Category',
      control: 'inline-radio',
      options: ['System', 'Functional'],
      table: { category: 'Table Settings' },
    },
    // --- [Category: Token Data] ---
    tokens: {
      name: 'Token List',
      control: 'object',
      table: { category: 'Token Data' },
    },
    // --- [Category: Typography Specs] ---
    'tokens[].fontSize': {
      name: 'Font Size',
      description: '글자 크기 (예: 14px)',
      table: { category: 'Typography Specs' },
    },
    'tokens[].weights': {
      name: 'Font Weights',
      description: '지원하는 두께 배열 (예: [600, 700])',
      table: { category: 'Typography Specs' },
    },
    'tokens[].description': {
      name: 'Description',
      description: '사용처 가이드 (btn-4, btn-5 등 구분용)',
      table: { category: 'Typography Specs' },
    },
  } as ArgTypes,
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
        category='Pretendard GOV'
        tokens={getTokensByLang('display', 'ko')}
      />
      <TypographyTokenTable
        title='Display 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('display', 'en')}
      />
      <TypographyTokenTable
        title='Display 일본어'
        category='Noto Sans JP'
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
        category='Pretendard GOV'
        tokens={getTokensByLang('heading', 'ko')}
      />
      <TypographyTokenTable
        title='Heading 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('heading', 'en')}
      />
      <TypographyTokenTable
        title='Heading 일본어'
        category='Noto Sans JP'
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
        category='Pretendard GOV'
        tokens={getTokensByLang('sub-title', 'ko')}
      />
      <TypographyTokenTable
        title='SubTitle 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('sub-title', 'en')}
      />
      <TypographyTokenTable
        title='SubTitle 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('sub-title', 'ja')}
      />
    </div>
  ),
};

export const BodyScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Body 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('body', 'ko')}
      />
      <TypographyTokenTable
        title='Body 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('body', 'en')}
      />
      <TypographyTokenTable
        title='Body 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('body', 'ja')}
      />
    </div>
  ),
};

export const ButtonScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Button 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('btn', 'ko')}
      />
      <TypographyTokenTable
        title='Button 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('btn', 'en')}
      />
      <TypographyTokenTable
        title='Button 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('btn', 'ja')}
      />
    </div>
  ),
};

export const LegendScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Legend 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('legend', 'ko')}
      />
      <TypographyTokenTable
        title='Legend 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('legend', 'en')}
      />
      <TypographyTokenTable
        title='Legend 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('legend', 'ja')}
      />
    </div>
  ),
};

export const LabelScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Label 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('label', 'ko')}
      />
      <TypographyTokenTable
        title='Label 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('label', 'en')}
      />
      <TypographyTokenTable
        title='Label 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('label', 'ja')}
      />
    </div>
  ),
};

export const InputScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Input 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('input', 'ko')}
      />
      <TypographyTokenTable
        title='Input 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('input', 'en')}
      />
      <TypographyTokenTable
        title='Input 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('input', 'ja')}
      />
    </div>
  ),
};

export const HelperScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Helper 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('helper', 'ko')}
      />
      <TypographyTokenTable
        title='Helper 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('helper', 'en')}
      />
      <TypographyTokenTable
        title='Helper 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('helper', 'ja')}
      />
    </div>
  ),
};

export const CalendarScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Calendar 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('calendar', 'ko')}
      />
      <TypographyTokenTable
        title='Calendar 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('calendar', 'en')}
      />
      <TypographyTokenTable
        title='Calendar 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('calendar', 'ja')}
      />
    </div>
  ),
};

export const ToastMsgScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Toast Msg 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('toast-msg', 'ko')}
      />
      <TypographyTokenTable
        title='Toast Msg 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('toast-msg', 'en')}
      />
      <TypographyTokenTable
        title='Toast Msg 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('toast-msg', 'ja')}
      />
    </div>
  ),
};

export const ModalScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Modal 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('modal', 'ko')}
      />
      <TypographyTokenTable
        title='Modal 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('modal', 'en')}
      />
      <TypographyTokenTable
        title='Modal 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('modal', 'ja')}
      />
    </div>
  ),
};

export const FilePickerScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='FilePicker 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('file-picker', 'ko')}
      />
      <TypographyTokenTable
        title='FilePicker 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('file-picker', 'en')}
      />
      <TypographyTokenTable
        title='FilePicker 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('file-picker', 'ja')}
      />
    </div>
  ),
};

export const DataTableScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='DataTable 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('data-table', 'ko')}
      />
      <TypographyTokenTable
        title='DataTable 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('data-table', 'en')}
      />
      <TypographyTokenTable
        title='DataTable 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('data-table', 'ja')}
      />
    </div>
  ),
};

export const BadgeScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Badge 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('badge', 'ko')}
      />
      <TypographyTokenTable
        title='Badge 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('badge', 'en')}
      />
      <TypographyTokenTable
        title='Badge 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('badge', 'ja')}
      />
    </div>
  ),
};

export const PaginationScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Pagination 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('pagination', 'ko')}
      />
      <TypographyTokenTable
        title='Pagination 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('pagination', 'en')}
      />
      <TypographyTokenTable
        title='Pagination 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('pagination', 'ja')}
      />
    </div>
  ),
};

export const AccordionScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Accordion 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('accordion', 'ko')}
      />
      <TypographyTokenTable
        title='Accordion 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('accordion', 'en')}
      />
      <TypographyTokenTable
        title='Accordion 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('accordion', 'ja')}
      />
    </div>
  ),
};

export const ChipScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Chip 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('chip', 'ko')}
      />
      <TypographyTokenTable
        title='Chip 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('chip', 'en')}
      />
      <TypographyTokenTable
        title='Chip 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('chip', 'ja')}
      />
    </div>
  ),
};

export const TagScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Tag 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('tag', 'ko')}
      />
      <TypographyTokenTable
        title='Tag 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('tag', 'en')}
      />
      <TypographyTokenTable
        title='Tag 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('tag', 'ja')}
      />
    </div>
  ),
};

export const TooltipScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Tooltip 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('tooltip', 'ko')}
      />
      <TypographyTokenTable
        title='Tooltip 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('tooltip', 'en')}
      />
      <TypographyTokenTable
        title='Tooltip 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('tooltip', 'ja')}
      />
    </div>
  ),
};

export const AvatarScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Avatar 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('avatar', 'ko')}
      />
      <TypographyTokenTable
        title='Avatar 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('avatar', 'en')}
      />
      <TypographyTokenTable
        title='Avatar 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('avatar', 'ja')}
      />
    </div>
  ),
};

export const BreadcrumbScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Breadcrumb 한국어'
        category='Pretendard GOV'
        tokens={getTokensByLang('breadcrumb', 'ko')}
      />
      <TypographyTokenTable
        title='Breadcrumb 영어'
        category='NanumSquare Neo'
        tokens={getTokensByLang('breadcrumb', 'en')}
      />
      <TypographyTokenTable
        title='Breadcrumb 일본어'
        category='Noto Sans JP'
        tokens={getTokensByLang('breadcrumb', 'ja')}
      />
    </div>
  ),
};

export const CodeScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <TypographyTokenTable
        title='Code'
        category='Fira Code'
        tokens={[
          {
            id: 'typo-code',
            fontSize: '14px',
            weights: [400],
            lineHeight: '1.5',
            usage: 'Code',
            description: '인라인 코드 또는 코드 블록용 고정폭 텍스트',
          },
        ]}
      />
    </div>
  ),
};
