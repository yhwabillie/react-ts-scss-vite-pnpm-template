import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from '@/components/ui/molecules/Toast/ToastProvider';
import { TokenData as TechTokens } from '@/constants/generated/tech-tokens';
import ColorTokenTable from '@/components/ui/tokens/ColorTokenTable';

const meta: Meta<typeof ColorTokenTable> = {
  title: 'Tokens/Colors/Theme/Tech',
  component: ColorTokenTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Tech Theme 토큰**은 신뢰감 있는 푸른 계열(Blue-based)의 색상을 중심으로 설계된 테마 시스템입니다. <br />' +
          '공통 시맨틱 구조 위에 테크 테마만의 청색조 컬러셋을 매핑하여, 각 컴포넌트에서 일관된 톤앤매너를 유지합니다. <br /><br />' +
          '`data-theme="tech"` 속성을 통해 활성화되는 전용 컬러셋 <br />',
      },
    },
  },
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

// 하이픈 복합 키를 우선 매칭해 그룹 오분류를 방지합니다.
const COMPLEX_KEYS = [
  'data-table',
  'icon-frame',
  'filepicker',
  'required-asterisk',
  'custom-modal',
  'alert-modal',
  'option-list',
  'option-item',
  'outline-btn',
  'validation-msg',
  'segmented-control',
];

// 테마 접두어는 그룹 계산에서 제외합니다.
const SKIP_WORDS = new Set(['primary', 'secondary', 'tertiary']);

/**
 * 테마 토큰을 컴포넌트 단위로 그룹화합니다.
 * ID 패턴 예시: --color-primary-breadcrumb-current-text
 */
const groupedTechTokens = TechTokens.reduce(
  (acc, token) => {
    // 1. 접두사 제거 (--color- 제거)
    const cleanId = token.id.replace(/^--color-/, '');

    const complexKey = COMPLEX_KEYS.find(key => cleanId.includes(key));
    const groupKey = complexKey
      ? complexKey
      : (() => {
          const [first, second] = cleanId.split('-');
          return SKIP_WORDS.has(first) ? second || 'etc' : first || 'etc';
        })();

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

export const Tag: Story = {
  args: {
    title: 'Tag Tokens',
    category: 'Component',
    tokens: groupedTechTokens['tag'] || [],
  },
};

export const Chip: Story = {
  args: {
    title: 'Chip Tokens',
    category: 'Component',
    tokens: groupedTechTokens['chip'] || [],
  },
};

export const Tabs: Story = {
  args: {
    title: 'Tabs Tokens',
    category: 'Component',
    tokens: groupedTechTokens['tabs'] || [],
  },
};

export const Accordion: Story = {
  args: {
    title: 'Accordion Tokens',
    category: 'Component',
    tokens: groupedTechTokens['accordion'] || [],
  },
};

export const Pagination: Story = {
  args: {
    title: 'Pagination Tokens',
    category: 'Component',
    tokens: groupedTechTokens['pagination'] || [],
  },
};

export const Badge: Story = {
  args: {
    title: 'Badge Tokens',
    category: 'Component',
    tokens: groupedTechTokens['badge'] || [],
  },
};

export const DataTable: Story = {
  args: {
    title: 'DataTable Tokens',
    category: 'Component',
    tokens: groupedTechTokens['data-table'] || [],
  },
};

export const IconFrame: Story = {
  args: {
    title: 'DataTable Tokens',
    category: 'Component',
    tokens: groupedTechTokens['icon-frame'] || [],
  },
};

export const FilePicker: Story = {
  args: {
    title: 'FilePicker Tokens',
    category: 'Component',
    tokens: groupedTechTokens['filepicker'] || [],
  },
};

export const Calendar: Story = {
  args: {
    title: 'Calendar Tokens',
    category: 'Component',
    tokens: groupedTechTokens['calendar'] || [],
  },
};

export const Searchbar: Story = {
  args: {
    title: 'Searchbar Tokens',
    category: 'Component',
    tokens: groupedTechTokens['searchbar'] || [],
  },
};

export const Datepicker: Story = {
  args: {
    title: 'Datepicker Tokens',
    category: 'Component',
    tokens: groupedTechTokens['datepicker'] || [],
  },
};

export const Combobox: Story = {
  args: {
    title: 'Combobox Tokens',
    category: 'Component',
    tokens: groupedTechTokens['combobox'] || [],
  },
};

export const Selectbox: Story = {
  args: {
    title: 'Selectbox Tokens',
    category: 'Component',
    tokens: groupedTechTokens['selectbox'] || [],
  },
};

export const OptionList: Story = {
  args: {
    title: 'OptionList Tokens',
    category: 'Component',
    tokens: groupedTechTokens['option-list'] || [],
  },
};

export const OptionItem: Story = {
  args: {
    title: 'OptionItem Tokens',
    category: 'Component',
    tokens: groupedTechTokens['option-item'] || [],
  },
};

export const SegmentedControl: Story = {
  args: {
    title: 'SegmentedControl Tokens',
    category: 'Component',
    tokens: groupedTechTokens['segmented-control'] || [],
  },
};

export const Slider: Story = {
  args: {
    title: 'Slider Tokens',
    category: 'Component',
    tokens: groupedTechTokens['slider'] || [],
  },
};

export const Input: Story = {
  args: {
    title: 'Input Tokens',
    category: 'Component',
    tokens: groupedTechTokens['input'] || [],
  },
};

export const Switch: Story = {
  args: {
    title: 'Switch Tokens',
    category: 'Component',
    tokens: groupedTechTokens['switch'] || [],
  },
};

export const Textarea: Story = {
  args: {
    title: 'Textarea Tokens',
    category: 'Component',
    tokens: groupedTechTokens['textarea'] || [],
  },
};

export const Radio: Story = {
  args: {
    title: 'Radio Tokens',
    category: 'Component',
    tokens: groupedTechTokens['radio'] || [],
  },
};

export const Checkbox: Story = {
  args: {
    title: 'Checkbox Tokens',
    category: 'Component',
    tokens: groupedTechTokens['checkbox'] || [],
  },
};

export const Button: Story = {
  args: {
    title: 'Button Tokens',
    category: 'Component',
    tokens: groupedTechTokens['btn'] || [],
  },
};

export const Spinner: Story = {
  args: {
    title: 'Spinner Tokens',
    category: 'Component',
    tokens: groupedTechTokens['spinner'] || [],
  },
};
