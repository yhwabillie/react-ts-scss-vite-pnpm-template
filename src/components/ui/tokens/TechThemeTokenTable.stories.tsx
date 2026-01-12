import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { TokenData as TechTokens } from '../../../constants/generated/tech-tokens';
import ColorTokenTable from './ColorTokenTable';

const meta: Meta<typeof ColorTokenTable> = {
  title: 'Tokens/Colors/Theme/Tech',
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
    // 1. 접두사 제거 (--color- 제거)
    const cleanId = token.id.replace(/^--color-/, '');

    let groupKey = 'etc';

    // ✅ 1. 복합어(하이픈 포함) 우선 매칭
    // ID의 어느 위치에 있든 해당 키워드가 포함되면 해당 그룹으로 분류
    if (cleanId.includes('data-table')) groupKey = 'data-table';
    else if (cleanId.includes('icon-frame')) groupKey = 'icon-frame';
    else if (cleanId.includes('filepicker')) groupKey = 'filepicker';
    else if (cleanId.includes('required-asterisk')) groupKey = 'required-asterisk';
    else if (cleanId.includes('custom-modal')) groupKey = 'custom-modal';
    else if (cleanId.includes('alert-modal')) groupKey = 'alert-modal';
    else if (cleanId.includes('option-list')) groupKey = 'option-list';
    else if (cleanId.includes('option-item')) groupKey = 'option-item';
    else if (cleanId.includes('outline-btn')) groupKey = 'outline-btn';
    else if (cleanId.includes('validation-msg')) groupKey = 'validation-msg';
    else if (cleanId.includes('segmented-control')) groupKey = 'segmented-control';
    // ✅ 2. 그 외 단일 단어 기반 매핑 (primary/secondary 건너뛰기 로직 포함)
    else {
      const parts = cleanId.split('-');
      const skipWords = ['primary', 'secondary', 'tertiary'];

      // 첫 번째 단어가 primary/secondary면 두 번째 단어를 사용, 아니면 첫 번째 단어 사용
      groupKey = skipWords.includes(parts[0]) ? parts[1] || 'etc' : parts[0];
    }

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
