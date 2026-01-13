import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { ColorTokensData } from '../../../constants/generated/color-tokens';
import ColorTokenTable from './ColorTokenTable';

const meta: Meta<typeof ColorTokenTable> = {
  title: 'Tokens/Colors/Semantic',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**시맨틱 토큰**은 디자인의 "의미"를 담은 컬러 명세입니다. <br />' +
          '원색(Primitive) 토큰을 목적에 맞게 재정의하여 테마 확장성과 유지보수 효율을 극대화합니다. <br /><br />' +
          '• **System**: 배경, 텍스트 등 인터페이스 공통 요소 <br />' +
          '• **Functional**: 상태 알림, 정보 구분 등 기능적 요소 <br />' +
          '• **Component**: 개별 UI 컴포넌트 전용 상세 제어',
      },
    },
  },
  component: ColorTokenTable,
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
    else if (cleanId.startsWith('option-item')) suffix = 'option-item';
    else if (cleanId.startsWith('required-asterisk')) suffix = 'required-asterisk';
    else if (cleanId.startsWith('outline-btn')) suffix = 'outline-btn';
    else if (cleanId.startsWith('icon-frame')) suffix = 'icon-frame';
    else if (cleanId.startsWith('validation-msg')) suffix = 'validation-msg';
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

export const Text: Story = {
  args: {
    title: 'Text Tokens',
    category: 'System',
    tokens: groupedTokens['text'] || [],
  },
};

export const Interaction: Story = {
  args: {
    title: 'Interaction Tokens',
    category: 'System',
    tokens: groupedTokens['interaction'] || [],
  },
};

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

// Avatar
export const Label: Story = {
  args: {
    title: 'Label Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['label'] || [])],
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
export const IconFrame: Story = {
  args: {
    title: 'IconFrame Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['icon-frame'] || [])],
  },
};
export const OptionList: Story = {
  args: {
    title: 'OptionList Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['option-list'] || [])],
  },
};
export const OptionItem: Story = {
  args: {
    title: 'OptionItem Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['option-item'] || [])],
  },
};
export const ValidationMsg: Story = {
  args: {
    title: 'ValidationMsg Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['validation-msg'] || [])],
  },
};
export const Slider: Story = {
  args: {
    title: 'Slider Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['slider'] || [])],
  },
};
export const Badge: Story = {
  args: {
    title: 'Badge Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['badge'] || [])],
  },
};
export const Datepicker: Story = {
  args: {
    title: 'BadDatepickerge Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['datepicker'] || [])],
  },
};
export const Btn: Story = {
  args: {
    title: 'Btn Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['btn'] || [])],
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
export const Combobox: Story = {
  args: {
    title: 'Combobox Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['combobox'] || [])],
  },
};
export const Selectbox: Story = {
  args: {
    title: 'Selectbox Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['selectbox'] || [])],
  },
};
export const Input: Story = {
  args: {
    title: 'Input Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['input'] || [])],
  },
};
export const Textarea: Story = {
  args: {
    title: 'Textarea Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['textarea'] || [])],
  },
};
export const Switch: Story = {
  args: {
    title: 'Switch Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['switch'] || [])],
  },
};
