import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react'; // 💡 외부 패키지 대신 리액트 기본 훅 사용
import SegmentedControl from './SegmentedControl';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { GuideCell, GuideGroup, GuideRow } from '../../guide/Guide';

const meta = {
  title: 'UI/Molecules/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
 * 가장 기본적인 사용 예시입니다.
 * 단일 상태(viewType)를 통해 인디케이터의 실시간 이동과 데이터 동기화를 검증합니다.
 */
export const Base: Story = {
  render: args => {
    const [viewType, setViewType] = useState(args.selectedValue);

    return (
      <SegmentedControl
        {...args}
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
 * 각 테마는 다크모드 대응 고대비 로직(WCAG 4.5:1)이 적용되어 있습니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];

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
 * 인터랙션 상태(Normal, Focus, Disabled)를 검증합니다.
 * Disabled 상태 시 키보드 접근(Tab) 및 화살표 조작이 원천 차단되는지 확인합니다.
 */
export const States: Story = {
  render: args => {
    const states = [
      { label: 'Normal', className: '' },
      { label: 'Focus', className: 'pseudo-focus-visible' },
      { label: 'Disabled', props: { disabled: true } },
    ];

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
 * 다양한 크기(XL ~ XS) 환경에서 인디케이터의 정렬과 텍스트 가독성을 검증합니다.
 * 내부 패딩 변화에도 슬라이더가 정확한 위치(translateX)에 고정되는지 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

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
 * Pill 형태 선택 시 좌우 끝단의 곡률과 인디케이터의 마스크 영역이 일치해야 합니다.
 */
export const Shapes: Story = {
  render: args => {
    const shapeOptions: Array<'rounded' | 'pill'> = ['rounded', 'pill'];

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
