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
    // 🎨 Style 카테고리
    variant: {
      description: '데이트피커의 전체적인 테마 스타일을 결정합니다.',
      control: 'inline-radio',
      options: ['solid', 'outline'],
      table: {
        category: 'Style',
        type: { summary: "'solid' | 'outline'" },
      },
    },
    color: {
      description: '브랜드 컬러 테마를 적용합니다.',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: {
        category: 'Style',
        type: { summary: 'Color' },
      },
    },
    size: {
      description: '입력창 및 캘린더 전체의 크기 스케일을 조절합니다.',
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        category: 'Style',
        type: { summary: 'Size' },
        defaultValue: { summary: 'md' },
      },
    },

    // ⚙️ Configuration 카테고리
    id: {
      description: '컴포넌트의 고유 식별자입니다.',
      control: 'text',
      table: { category: 'Configuration' },
    },
    inputProps: {
      description: '내부 Input 요소에 전달되는 속성입니다.',
      control: 'object',
      table: {
        category: 'Configuration',
        type: { summary: 'InputPropsObject' },
      },
    },

    // 📅 Calendar Data 카테고리
    calendar: {
      description: '캘린더 내부 상태와 옵션, 휴일 데이터 등을 설정합니다.',
      control: 'object',
      table: {
        category: 'Calendar Data',
        type: { summary: 'CalendarSettings' },
      },
    },

    // 🖱️ Actions 카테고리
    onDateChange: {
      description: '날짜가 변경되었을 때 호출되는 콜백 함수입니다.',
      action: 'dateChanged',
      table: {
        category: 'Actions',
        type: { summary: '(value: string, date: Date) => void' },
      },
    },
  },

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

export const Default: Story = {
  render: args => <Datepicker {...args} />,
};

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

export const PortalTest: Story = {
  render: args => (
    <AnatomyWrapper title='부모 요소가 overflow: hidden 상태입니다.' style={{ overflow: 'hidden' }}>
      <Datepicker {...args} />
    </AnatomyWrapper>
  ),
};
