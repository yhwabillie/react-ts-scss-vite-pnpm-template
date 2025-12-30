import type { Meta, StoryObj } from '@storybook/react-vite';
import Datepicker from './Datepicker';
import {
  calendarYearOptions,
  calendarMonthOptions,
  TODAY_YEAR,
  TODAY_MONTH,
} from '../../organisms/Calendar/Calendar.mock';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { GuideCell, GuideGroup, GuideRow } from '../../guide/Guide';

/**
 * [Datepicker]
 * 날짜 입력 필드와 달력 팝업이 결합된 컴포넌트입니다.
 * - **Portal**: 캘린더는 포털을 통해 최상위 레이어에 렌더링되어 z-index 문제를 방지합니다.
 * - **Focus Management**: 키보드로 달력을 열면 캘린더 내부로 포커스가 자동 이동하며, 닫힐 때 인풋으로 복귀합니다.
 * - **Controlled/Uncontrolled**: 내부적으로 선택된 날짜와 현재 뷰(Year/Month)를 관리합니다.
 */
const meta = {
  title: 'UI/Molecules/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    // 🎨 Style 카테고리: 시각적 외형
    variant: {
      description: '데이트피커의 테마 스타일을 결정합니다.',
      control: 'inline-radio',
      options: ['solid', 'outline'],
      table: { category: 'Style', type: { summary: "'solid' | 'outline'" } },
    },
    color: {
      description: '브랜드 컬러 시스템을 적용합니다.',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: { category: 'Style', type: { summary: 'Color' } },
    },
    size: {
      description: '입력창 및 캘린더 전체의 스케일을 조절합니다.',
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Style', type: { summary: 'Size' }, defaultValue: { summary: 'md' } },
    },
    shape: {
      description: '컴포넌트의 테두리 곡률을 결정합니다.',
      control: 'inline-radio',
      options: ['square', 'rounded', 'pill'],
      table: {
        category: 'Style',
        type: { summary: 'Shape' },
        defaultValue: { summary: 'rounded' },
      },
    },
    className: {
      description: '사용자 정의 CSS 클래스',
      control: 'text',
      table: { category: 'Style' },
    },

    // ⚙️ Configuration 카테고리: 컴포넌트 설정 및 속성
    id: {
      description: '컴포넌트 고유 ID (Label 연동 및 ARIA 대응용)',
      control: 'text',
      table: { category: 'Configuration' },
    },
    as: {
      description: '렌더링할 HTML 태그 또는 컴포넌트',
      control: 'text',
      table: { category: 'Configuration', defaultValue: { summary: 'label' } },
    },
    inputProps: {
      description: '내부 인풋(Input) 요소에 전달되는 속성',
      control: 'object',
      table: { category: 'Configuration' },
    },
    'inputProps.placeholder': {
      name: 'input: placeholder',
      control: 'text',
      table: { category: 'Configuration', subcategory: 'Input Props' },
    },
    'inputProps.readOnly': {
      name: 'input: readOnly',
      control: 'boolean',
      table: { category: 'Configuration', subcategory: 'Input Props' },
    },
    'inputProps.disabled': {
      name: 'input: disabled',
      control: 'boolean',
      table: { category: 'Configuration', subcategory: 'Input Props' },
    },
    buttonProps: {
      description: '트리거 버튼의 스타일 설정',
      control: 'object',
      table: { category: 'Configuration' },
    },
    'buttonProps.variant': {
      name: 'button: variant',
      control: 'inline-radio',
      options: ['ghost', 'solid'],
      table: { category: 'Configuration', subcategory: 'Button Props' },
    },

    // 📅 Calendar Data 카테고리: 데이터 관리
    calendar: {
      description: '캘린더 전체 설정 및 옵션 데이터',
      control: 'object',
      table: { category: 'Calendar Data' },
    },
    'calendar.selectedYear': {
      name: 'cal: selectedYear',
      control: 'number',
      table: { category: 'Calendar Data', subcategory: 'Initial View' },
    },
    'calendar.selectedMonth': {
      name: 'cal: selectedMonth',
      control: { type: 'number', min: 1, max: 12 },
      table: { category: 'Calendar Data', subcategory: 'Initial View' },
    },

    // 🖱️ Actions 카테고리: 이벤트 핸들러
    onDateChange: {
      description: '날짜 선택 시 발생하는 콜백 함수',
      action: 'onDateChange',
      table: {
        category: 'Actions',
        type: { summary: '(value: string, date: Date) => void' },
      },
    },
  } as any,

  args: {
    variant: 'outline',
    shape: 'rounded',
    color: 'primary',
    size: 'md',
    inputProps: {
      id: 'datepicker-input',
      placeholder: 'YYYY-MM-DD',
    },
    calendar: {
      selectedYear: TODAY_YEAR,
      selectedMonth: TODAY_MONTH,
      calendarProps: {
        yearOptions: calendarYearOptions,
        monthOptions: calendarMonthOptions,
      },
      holidays: [
        { date: '20251225', name: '크리스마스' },
        { date: '20260101', name: '신정' },
      ],
    },
  },
} satisfies Meta<typeof Datepicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: args => <Datepicker {...args} />,
};

/**
 * * `Datepicker`의 브랜드 테마별 색상을 정의합니다.
 * * **사용 가이드**:
 * - 서비스의 전체적인 톤앤매너에 맞춰 `primary`를 기본으로 사용합니다.
 * - 피드백이나 상태 강조가 필요한 경우 `success`, `warning`, `danger` 컬러를 전략적으로 배치합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <Datepicker {...args} color={color} />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * * 입력창의 크기 스케일을 조절하여 UI 밀도를 결정합니다.
 * * **특징**:
 * - `xs`, `sm`: 데이터가 집약된 대시보드나 모달 내부에서 공간을 절약할 때 사용합니다.
 * - `md`: 표준 폼 입력 시 권장되는 크기입니다.
 * - `lg`, `xl`: 랜딩 페이지의 메인 검색이나 가독성이 중요한 모바일 환경에 최적화되어 있습니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

    return (
      <SpecimenWrapper>
        {sizeOptions.map(size => {
          return (
            <SpecimenGroup key={size} title={size.toUpperCase()}>
              <SpecimenRow>
                <Datepicker {...args} size={size} />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * * 인터랙션에 따른 컴포넌트의 시각적 변화 및 동작 제한을 검증합니다.
 * * **주요 상태**:
 * - **Focus**: `pseudo-focus-visible` 클래스를 통해 입력 시 포커스 링을 고정 시뮬레이션합니다.
 * - **Read Only**: 사용자가 타이핑으로 값을 수정할 수 없으며, **현재 로직상 달력 팝업 트리거도 차단**되어 데이터 정합성을 유지합니다.
 * - **Disabled**: 컴포넌트가 완전히 비활성화되어 마우스/키보드 이벤트에 응답하지 않습니다.
 */
export const States: Story = {
  render: args => {
    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Focus', props: { className: 'pseudo-focus-visible' } },
      { label: 'Read Only', props: { readOnly: true } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map((state, idx) => {
          return (
            <SpecimenGroup key={idx} title={state.label}>
              <SpecimenRow>
                <Datepicker
                  {...args}
                  {...state.props}
                  inputProps={{
                    ...args.inputProps,
                    disabled: state.props.disabled,
                    readOnly: state.props.readOnly,
                  }}
                />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * * 테두리의 곡률(Border-radius)에 따른 3가지 베리에이션을 제공합니다.
 * * **특징**:
 * - **SQUARE**: 격식 있고 견고한 느낌을 줍니다.
 * - **ROUNDED**: 가장 범용적인 표준 UI 형태입니다.
 * - **PILL**: 유연하고 모던한 느낌을 주며, 버튼이나 태그 위주의 UI와 잘 어우러집니다.
 */
export const Shapes: Story = {
  render: (args, context) => {
    const shapeOptions: Array<'square' | 'rounded' | 'pill'> = ['square', 'rounded', 'pill'];

    return (
      <GuideGroup direction='column'>
        {shapeOptions.map(shape => (
          <GuideRow key={shape} direction='column'>
            {/* 상단 캡션용 Cell */}
            <GuideCell caption={shape.toUpperCase()}>
              <Datepicker {...args} shape={shape} />
            </GuideCell>
          </GuideRow>
        ))}
      </GuideGroup>
    );
  },
};

/**
 * * 우측 캘린더 트리거 버튼의 스타일(`ghost`, `solid`)을 설정합니다.
 * * **가이드**:
 * - **GHOST**: 입력창 내부의 시각적 요소가 많을 때 단순함을 유지하기 위해 권장합니다.
 * - **SOLID**: '날짜 선택'이라는 액션을 명확하게 유도하고 싶을 때 사용합니다.
 */
export const Variants: Story = {
  render: args => {
    type btnVariantsType = 'ghost' | 'solid';

    const btnVariants: btnVariantsType[] = ['ghost', 'solid'];

    return (
      <SpecimenWrapper>
        {btnVariants.map((variant, idx) => {
          return (
            <SpecimenGroup key={idx} title={variant}>
              <Datepicker {...args} buttonProps={{ variant: variant }} />
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * * `OptionListPortal`이 올바르게 작동하는지 확인하기 위한 테스트 스토리입니다.
 * * **핵심 기능**:
 * - 부모 요소에 `overflow: hidden`이 걸려 있더라도, 캘린더 팝업이 잘리지 않고 최상단 레이어에 정상적으로 렌더링되는지 보장합니다.
 */
export const PortalTest: Story = {
  render: args => (
    <AnatomyWrapper title='부모 요소가 overflow: hidden 상태입니다.' style={{ overflow: 'hidden' }}>
      <Datepicker {...args} />
    </AnatomyWrapper>
  ),
};
