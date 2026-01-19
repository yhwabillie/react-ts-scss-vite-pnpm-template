import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react'; // 💡 외부 패키지 대신 리액트 기본 훅 사용
import SegmentedControl from './SegmentedControl';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { GuideCell, GuideGroup, GuideRow } from '../../guide/Guide';
import { useTranslation } from 'react-i18next';

const SEGMENTED_CONTROL_ITEM_KEYS = ['label_a', 'label_b', 'label_c'];

const localizeSegmentedOptions = (
  t: (key: string) => string,
  options: Array<{ label: string; value: string }>,
) =>
  options.map((option, index) => {
    const key = SEGMENTED_CONTROL_ITEM_KEYS[index];
    if (!key) return option;

    return {
      ...option,
      label: t(`segmented-control.items.${key}`),
    };
  });

const meta = {
  title: 'UI/Molecules/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**SegmentedControl**은 상호 배타적인 옵션 세트 중에서 하나를 선택할 때 사용하며, 탭과 버튼의 하이브리드 형태를 가집니다. <br /><br />' +
          '• 선택값이 바뀔 때마다 부드럽게 이동하는 인디케이터를 통해 직관적인 시각적 피드백을 제공합니다. <br />' +
          '• 내부적으로 라디오 그룹(Radio Group) 패턴을 사용하여 표준 폼 접근성을 준수합니다. <br />' +
          '• 주로 뷰 모드 전환(리스트/그리드), 정렬 기준 변경 등 즉각적인 반응이 필요한 UI에 적합합니다.',
      },
    },
  },
  argTypes: {
    // 🏷️ Data & Logic
    options: {
      description: '세그먼트 컨트롤에 표시할 옵션 배열입니다.',
      table: {
        category: 'Data',
        type: { summary: 'SegmentOption[]' },
      },
    },
    selectedValue: {
      description: '현재 선택된 옵션의 value 값입니다.',
      control: 'text',
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    onChange: {
      description: '값이 변경될 때 호출되는 이벤트 핸들러입니다.',
      table: {
        category: 'Events',
        type: { summary: '(value: string) => void' },
      },
    },

    // 폼 관련 속성 (Native HTML Attributes)
    name: {
      description: '라디오 그룹의 name 속성으로, 폼 제출 시 키값으로 사용됩니다.',
      control: 'text',
      table: {
        category: 'Form',
        type: { summary: 'string' },
      },
    },
    disabled: {
      description: '전체 컨트롤을 비활성화하고 사용자의 인터랙션을 차단합니다.',
      control: 'boolean',
      table: {
        category: 'Form',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // 🎨 Appearance
    color: {
      description: '디자인 시스템에 정의된 의미론적(Semantic) 색상을 적용합니다.',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    shape: {
      description: '버튼 모서리의 굴곡(Radius)을 조절합니다.',
      control: 'inline-radio',
      options: ['rounded', 'pill'],
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'rounded' },
      },
    },

    // 📏 Layout
    size: {
      description: '컨트롤의 높이와 내부 패딩 크기를 결정합니다.',
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      description: '커스텀 스타일을 적용하기 위한 추가 클래스명입니다.',
      control: 'text',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
      },
    },

    // ♿ Accessibility
    title: {
      description: '스크린 리더 사용자에게 제공할 컨트롤의 한국어 설명입니다.',
      control: 'text',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
      },
    },
  },
  args: {
    name: 'view-mode',
    title: '정렬 방식',
    size: 'xl',
    options: [
      { label: '최신순', value: 'latest' },
      { label: '인기순', value: 'popular' },
      { label: '가격순', value: 'price' },
    ],

    selectedValue: 'popular',
    onChange: (value: string) => {},
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 컴포넌트의 가장 기본적인 활용 예시입니다.
 * 단일 상태(`viewType`) 관리를 통해 인디케이터가 선택된 옵션으로 부드럽게 이동하는지 확인합니다.
 */
export const Base: Story = {
  render: args => {
    const { t } = useTranslation();
    const [viewType, setViewType] = useState(args.selectedValue);
    const localizedOptions = localizeSegmentedOptions(t, args.options);

    return (
      <SegmentedControl
        {...args}
        options={localizedOptions}
        selectedValue={viewType} // 💡 2. 로컬 상태를 주입
        onChange={value => {
          setViewType(value); // 💡 3. 클릭 시 로컬 상태 변경 -> 인디케이터 이동
          args.onChange?.(value); // Actions 로그 기록
        }}
      />
    );
  },
};

/**
 * 브랜드 컬러 시스템(Primary, Secondary, Tertiary)별 테마를 검증합니다.
 * - **Contrast**: 인디케이터 위에서 반전되는 텍스트 컬러가 웹 콘텐츠 접근성 가이드(WCAG)의 대비율을 만족하는지 확인합니다.
 * - **Semantic**: 각 컬러 테마가 서비스의 디자인 톤앤매너와 일치하는지 검수합니다.
 */
export const Colors: Story = {
  render: args => {
    const { t } = useTranslation();
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];
    const localizedOptions = localizeSegmentedOptions(t, args.options);

    // 💡 1. 각 컬러 테마별 독립적인 선택 값을 관리하기 위한 상태 선언
    const [values, setValues] = useState<Record<string, string>>(
      colorOptions.reduce((acc, color) => ({ ...acc, [color]: args.selectedValue }), {}),
    );

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => (
          <SpecimenGroup key={color} title={color}>
            <SpecimenRow>
              <SegmentedControl
                {...args}
                color={color}
                options={localizedOptions}
                selectedValue={values[color]}
                onChange={val => {
                  setValues(prev => ({ ...prev, [color]: val }));
                  console.log(`[${color}] 선택된 Value:`, val);
                  args.onChange?.(val);
                }}
              />
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * 인터랙션 상태에 따른 시각적 변화와 기능 제약을 확인합니다.
 * - **Focus**: 키보드 탭 진입 시 나타나는 포커스 링 스타일을 검증합니다.
 * - **Disabled**: 컴포넌트 전체가 비활성화되어 클릭 및 키보드 조작이 차단되는지 확인합니다.
 */
export const States: Story = {
  render: args => {
    const { t } = useTranslation();
    const states = [
      { label: 'Normal', className: '' },
      { label: 'Focus', className: 'pseudo-focus-visible' },
      { label: 'Disabled', props: { disabled: true } },
    ];
    const localizedOptions = localizeSegmentedOptions(t, args.options);

    const [values, setValues] = useState<Record<string, string>>(
      states.reduce((acc, state) => ({ ...acc, [state.label]: args.selectedValue }), {}),
    );

    return (
      <SpecimenWrapper>
        {states.map(state => (
          <SpecimenGroup key={state.label} title={state.label}>
            <SpecimenGroup>
              <SegmentedControl
                {...args}
                color={args.color}
                {...state.props}
                // focus-visible은 부모 클래스 영향을 받도록 SCSS 설계됨
                className={state.className}
                options={localizedOptions}
                // 현재 상태(label)에 맞는 값을 주입
                selectedValue={values[state.label]}
                // 클릭 시 해당 라벨의 값만 업데이트하여 인디케이터 이동
                onChange={val => {
                  setValues(prev => ({ ...prev, [state.label]: val }));
                  args.onChange?.(val);
                }}
              />
            </SpecimenGroup>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * XL부터 XS까지 5단계 크기 환경에서 레이아웃을 검증합니다.
 * - **Sliding Logic**: 내부 패딩과 높이가 변하더라도 슬라이더 인디케이터가 정확한 위치(translateX)에 계산되어 배치되는지 확인합니다.
 * - **Readability**: 작은 사이즈(SM, XS)에서도 레이블 텍스트가 깨지지 않고 명확히 전달되는지 체크합니다.
 */
export const Sizes: Story = {
  render: args => {
    const { t } = useTranslation();
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];
    const localizedOptions = localizeSegmentedOptions(t, args.options);

    const [values, setValues] = useState<Record<string, string>>(
      sizeOptions.reduce((acc, size) => ({ ...acc, [size]: args.selectedValue }), {}),
    );

    return (
      <GuideGroup>
        <GuideRow direction='column'>
          {sizeOptions.map(size => (
            <GuideCell key={size} caption={size}>
              <SegmentedControl
                {...args}
                size={size}
                options={localizedOptions}
                selectedValue={values[size]}
                onChange={val => {
                  setValues(prev => ({ ...prev, [size]: val }));
                  args.onChange?.(val);
                }}
              />
            </GuideCell>
          ))}
        </GuideRow>
      </GuideGroup>
    );
  },
};

/**
 * 외곽선 형태(Rounded, Pill)에 따른 디자인 일관성을 검증합니다.
 * - **Visual Matching**: 특히 `Pill` 형태에서 좌우 끝단의 둥근 곡률과 내부 인디케이터의 모서리 처리가 자연스럽게 어우러지는지 확인합니다.
 */
export const Shapes: Story = {
  render: args => {
    const { t } = useTranslation();
    const shapeOptions: Array<'rounded' | 'pill'> = ['rounded', 'pill'];
    const localizedOptions = localizeSegmentedOptions(t, args.options);

    const [values, setValues] = useState<Record<string, string>>(
      shapeOptions.reduce((acc, shape) => ({ ...acc, [shape]: args.selectedValue }), {}),
    );

    return (
      <GuideGroup>
        <GuideRow direction='column'>
          {shapeOptions.map(shape => (
            <GuideCell key={shape} caption={shape}>
              <SegmentedControl
                {...args}
                shape={shape}
                options={localizedOptions}
                selectedValue={values[shape]}
                onChange={val => {
                  setValues(prev => ({ ...prev, [shape]: val }));
                  args.onChange?.(val);
                }}
              />
            </GuideCell>
          ))}
        </GuideRow>
      </GuideGroup>
    );
  },
};
