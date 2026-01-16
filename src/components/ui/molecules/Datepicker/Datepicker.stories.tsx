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
import { useState } from 'react';

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
    docs: {
      description: {
        component:
          '**Datepicker**는 날짜를 직접 입력하거나 캘린더 팝업을 통해 선택할 수 있는 복합 입력 컴포넌트입니다. <br /><br />' +
          '• 캘린더 팝업은 DOM 최상단에 렌더링되어 부모 요소의 `overflow`나 `z-index` 설정에 구애받지 않고 항상 온전하게 노출됩니다. <br />' +
          '• 팝업이 열릴 때 캘린더 내부로 포커스가 진입하고, 닫힐 때 원래의 입력창으로 복귀하여 완벽한 키보드 접근성을 제공합니다. <br />' +
          '• 날짜 형식(YYYY-MM-DD)에 맞는 입력 유효성 검사 및 휴일 정보 표시 기능을 포함하고 있습니다.',
      },
    },
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
      options: ['primary', 'secondary', 'tertiary'],
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
 * 컴포넌트의 가장 기본적인 렌더링 형태입니다.
 * 인풋 클릭 또는 우측 아이콘 버튼을 통해 캘린더를 호출할 수 있습니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];

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
 * 디자인 시스템의 핵심 컬러 테마를 적용합니다.
 * - **Visual Focus**: 선택된 날짜 및 오늘(Today) 표시, 그리고 인터랙션 피드백 컬러가 테마에 맞춰 변경됩니다.
 * - **Consistency**: 다른 폼 요소(Input, Button)들과 동일한 컬러 토큰을 사용하여 일관된 사용자 경험을 제공합니다.
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
 * 인터랙션 과정에서 발생할 수 있는 주요 시각적 상태와 제약 사항을 확인합니다.
 * - **Read Only**: 값의 수정이 불가능하며, 데이터 무결성을 위해 캘린더 트리거 동작 역시 제한됩니다.
 * - **Disabled**: 컴포넌트가 비활성화되어 모든 이벤트(호버, 클릭 등)가 차단됩니다.
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
 * 서비스의 디자인 언어에 맞춰 3가지 테두리 곡률을 선택할 수 있습니다.
 * - **Pill**: 모던한 검색 인터페이스나 모바일 친화적인 레이아웃에 권장됩니다.
 * - **Square/Rounded**: 정교하고 구조적인 대시보드나 전문 툴에 적합합니다.
 */
export const Shapes: Story = {
  render: args => {
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
 * 우측 캘린더 트리거 버튼의 스타일을 결정합니다.
 * - **Ghost**: 인풋 내부에 자연스럽게 녹아드는 미니멀한 디자인입니다.
 * - **Solid**: 날짜 선택 액션을 명확하게 강조하여 사용자의 클릭을 유도합니다.
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
 * 부모 요소가 `overflow: hidden`인 상황에서도 캘린더 레이어가 잘리지 않는지 검증합니다.
 * 저장된 정보에 따르면, 이 컴포넌트는 'partially obscured' 에러를 방지하기 위해 포털을 통한 최상위 렌더링 전략을 취합니다.
 */
export const PortalTest: Story = {
  render: args => (
    <AnatomyWrapper title='부모 요소가 overflow: hidden 상태입니다.' style={{ overflow: 'hidden' }}>
      <Datepicker {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * 외부 상태(`useState`)를 통해 날짜를 강제로 주입하거나 변경을 감지하는 실무 예제입니다.
 * - **State Sync**: 외부에서 변경된 날짜가 캘린더의 현재 뷰(Year/Month)와 선택 표시(`selectedDate`)에 정확히 반영되는지 확인합니다.
 */
export const Controlled: Story = {
  render: args => {
    // 외부에서 2026년 1월 1일로 상태 관리
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 1));
    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(1);

    return (
      <GuideGroup title='Controlled Datepicker (2026-01-01)'>
        <Datepicker
          {...args}
          calendar={{
            ...args.calendar,
            selectedDate: selectedDate,
            selectedYear: year,
            selectedMonth: month,
          }}
          onDateChange={(value, date) => {
            setSelectedDate(date);
            console.log('선택된 날짜 문자열:', value);
          }}
        />
      </GuideGroup>
    );
  },
};
