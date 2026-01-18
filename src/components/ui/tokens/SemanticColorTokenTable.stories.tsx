import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToastProvider } from '../molecules/Toast/ToastProvider';
import { ColorTokensData } from '../../../constants/generated/color-tokens';
import semanticColors from '../../../../tokens/color/colors.json';
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

const buildGuideTokens = (
  node: Record<string, any>,
  prefix: string[] = [],
): typeof ColorTokensData => {
  const tokens: typeof ColorTokensData = [];

  Object.entries(node).forEach(([key, value]) => {
    if (value && typeof value === 'object' && 'value' in value) {
      const id = `--color-guide-${[...prefix, key].join('-')}`;
      tokens.push({
        id,
        lightValue: value.value,
        darkValue: value.value,
      });
      return;
    }

    if (value && typeof value === 'object') {
      tokens.push(...buildGuideTokens(value as Record<string, any>, [...prefix, key]));
    }
  });

  return tokens;
};

const guideTokens = buildGuideTokens(
  (semanticColors as { color?: { guide?: Record<string, any> } }).color?.guide || {},
);

const mergedTokens = [
  ...ColorTokensData,
  ...guideTokens.filter(
    token => !ColorTokensData.some(existing => existing.id === token.id),
  ),
];

/**
 * 2. 그룹화 로직 (정밀 매핑 및 구조 정제)
 */
const groupedTokens = mergedTokens.reduce(
  (acc, token) => {
    // 1. 접두사 제거 로직 강화
    // --color-color- 로 시작하는 경우와 --color- 로 시작하는 경우 모두 대응
    const cleanId = token.id.replace(/^--color-/, '').replace(/^color-/, '');

    // 2. 그룹(suffix) 결정 알고리즘
    let groupKey = 'etc';

    // ✅ 1. 복합 컴포넌트 우선순위 매칭 (기존 리스트 최적화)
    // 좀 더 확장성 있게 배열의 .some()이나 .find()를 사용할 수도 있습니다.
    const complexComponents = [
      'focus-ring',
      'scrollbar',
      'custom-modal',
      'alert-modal',
      'option-list',
      'option-item',
      'required-asterisk',
      'outline-btn',
      'icon-frame',
      'validation-msg',
      'data-table',
    ];

    const matchedComplex = complexComponents.find(comp => cleanId.startsWith(comp));

    if (matchedComplex) {
      groupKey = matchedComplex;
    }
    // ✅ 2. 의미론적 그룹핑 (Semantic Grouping)
    else if (cleanId.startsWith('surface') || cleanId.startsWith('bg')) {
      groupKey = 'surface';
    } else if (cleanId.startsWith('text') || cleanId.startsWith('typo')) {
      groupKey = 'text';
    } else if (cleanId.startsWith('border') || cleanId.startsWith('line')) {
      groupKey = 'border';
    }
    // ✅ 3. 그 외 단일 단어 기반 매핑
    else {
      const firstWord = cleanId.split('-')[0];
      groupKey = SUFFIX_MAP[firstWord] || firstWord;
    }

    if (!acc[groupKey]) acc[groupKey] = [];

    // ✅ 3. 데이터 보정: organize-semantic.mjs에서 옮겨진 description(comment) 재검증
    // 만약 description이 비어있다면 id에서 이름을 유추하여 기본값 부여
    const refinedToken = {
      ...token,
    };

    acc[groupKey].push(refinedToken);
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
export const Spinner: Story = {
  args: {
    title: 'Spinner Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['spinner'] || [])],
  },
};
export const Chip: Story = {
  args: {
    title: 'Chip Tokens',
    category: 'Component',
    tokens: [...(groupedTokens['chip'] || [])],
  },
};
// Guide 그룹
export const Guide: Story = {
  args: {
    title: 'Guide Tokens',
    category: 'System',
    tokens: groupedTokens['guide'] || [],
  },
};
