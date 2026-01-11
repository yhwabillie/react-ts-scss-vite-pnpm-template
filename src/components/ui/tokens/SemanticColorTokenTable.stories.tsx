import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { ColorTokensData } from '../../../constants/generated/color-tokens';
import ColorTokenTable from './ColorTokenTable';

const meta: Meta<typeof ColorTokenTable> = {
  title: 'Tokens/Common/Colors/Semantic',
  component: ColorTokenTable,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ToastProvider position='bottom-right'>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ColorTokenTable>;

/**
 * 1. Suffix 매핑 정의
 * ID에서 추출한 첫 단어가 실제 어떤 그룹(Suffix)에 속해야 하는지 정의합니다.
 */
const SUFFIX_MAP: Record<string, string> = {
  bg: 'docs',
  stroke: 'docs',
  hover: 'docs',
  text: 'text',
  surface: 'surface',
  skeleton: 'skeleton',
  scrollbar: 'scrollbar',
  'focus-ring': 'focus-ring',
};

/**
 * 2. 그룹화 로직 (개선된 자동 매핑)
 */
const groupedTokens = ColorTokensData.reduce(
  (acc, token) => {
    const cleanId = token.id.replace(/^--color-(color-)?/, '');

    let suffix = 'etc';

    // ✅ 1. 복합어(하이픈 포함) 우선 매칭
    // data-table, focus-ring, scrollbar 등 2단어 이상인 컴포넌트 처리
    if (cleanId.startsWith('focus-ring')) suffix = 'focus-ring';
    else if (cleanId.startsWith('scrollbar')) suffix = 'scrollbar';
    else if (cleanId.startsWith('custom-modal')) suffix = 'custom-modal';
    else if (cleanId.startsWith('alert-modal')) suffix = 'alert-modal';
    else if (cleanId.startsWith('option-list')) suffix = 'option-list';
    else if (cleanId.startsWith('validation-guide')) suffix = 'validation-guide';
    else if (cleanId.startsWith('required-asterisk')) suffix = 'required-asterisk';
    else if (cleanId.startsWith('outline-btn')) suffix = 'outline-btn';
    // ✅ 2. 그 외 단일 단어 기반 매핑
    else {
      const firstWord = cleanId.split('-')[0];
      suffix = SUFFIX_MAP[firstWord] || firstWord;
    }

    if (!acc[suffix]) acc[suffix] = [];
    acc[suffix].push(token);
    return acc;
  },
  {} as Record<string, typeof ColorTokensData>,
);

// Surface 그룹
export const Surface: Story = {
  args: {
    title: 'Surface Tokens',
    category: 'System',
    tokens: groupedTokens['surface'] || [],
  },
};

// Text 그룹
export const Text: Story = {
  args: {
    title: 'Text Tokens',
    category: 'System',
    tokens: groupedTokens['text'] || [],
  },
};

// Interaction 그룹
export const Interaction: Story = {
  args: {
    title: 'Interaction Tokens',
    category: 'System',
    tokens: groupedTokens['interaction'] || [],
  },
};

// Scrollbar 그룹
export const Scrollbar: Story = {
  args: {
    title: 'Scrollbar Tokens',
    category: 'System',
    tokens: groupedTokens['scrollbar'] || [],
  },
};

export const Documentation: Story = {
  args: {
    title: 'Documentation Tokens',
    category: 'Functional', // 서비스 공통이 아닌 기능성 토큰
    tokens: groupedTokens['docs'] || [],
  },
};

export const Feedback: Story = {
  args: {
    title: 'Feedback Tokens',
    category: 'Functional',
    tokens: [...(groupedTokens['feedback'] || [])],
  },
};

export const Avatar: Story = {
  args: {
    title: 'Avatar Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['avatar'] || [])],
  },
};

export const Tooltip: Story = {
  args: {
    title: 'Tooltip Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['tooltip'] || [])],
  },
};

export const Accordion: Story = {
  args: {
    title: 'Accordion Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['accordion'] || [])],
  },
};

export const FilePicker: Story = {
  args: {
    title: 'FilePicker Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['filepicker'] || [])],
  },
};

export const CustomModal: Story = {
  args: {
    title: 'CustomModal Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['custom-modal'] || [])],
  },
};

export const AlertModal: Story = {
  args: {
    title: 'AlertModal Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['alert-modal'] || [])],
  },
};

export const Toast: Story = {
  args: {
    title: 'Toast Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['toast'] || [])],
  },
};

export const Calendar: Story = {
  args: {
    title: 'Calendar Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['calendar'] || [])],
  },
};

export const Searchbar: Story = {
  args: {
    title: 'Searchbar Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['searchbar'] || [])],
  },
};

export const OptionList: Story = {
  args: {
    title: 'OptionList Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['option-list'] || [])],
  },
};

export const ValidationMsg: Story = {
  args: {
    title: 'ValidationMsg Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['validation-guide'] || [])],
  },
};

export const Slider: Story = {
  args: {
    title: 'Slider Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['slider'] || [])],
  },
};

export const Label: Story = {
  args: {
    title: 'Label Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['label'] || [])],
  },
};

export const Required: Story = {
  args: {
    title: 'Required Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['required-asterisk'] || [])],
  },
};

export const Radio: Story = {
  args: {
    title: 'Radio Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['radio'] || [])],
  },
};

export const Checkbox: Story = {
  args: {
    title: 'Checkbox Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['checkbox'] || [])],
  },
};

export const OutlineBtn: Story = {
  args: {
    title: 'OutlineBtn Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['outline-btn'] || [])],
  },
};

// Interaction 그룹 (복수 접미사 합치기 예시)
// export const Interaction: Story = {
//   args: {
//     title: 'Interaction & Utility',
//     category: 'System',
//     tokens: [...(groupedTokens['focus-ring'] || []), ...(groupedTokens['scrollbar'] || [])],
//   },
// };
