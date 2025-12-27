import type { Meta, StoryObj } from '@storybook/react-vite';
import Datepicker from './Datepicker';
import {
  calendarYearOptions,
  calendarMonthOptions,
  TODAY_YEAR,
  TODAY_MONTH,
} from '../../organisms/Calendar/Calendar.mock';
import AnatomyWrapper from '../../guide/AnatomyWrapper';

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
  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    inputProps: {
      id: 'datepicker-input',

      readonly: true,
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
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    onDateChange: { action: 'dateChanged' },
  },
} satisfies Meta<typeof Datepicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Default]
 * 기본적인 날짜 선택 흐름을 테스트합니다.
 */
export const Default: Story = {
  render: args => (
    <AnatomyWrapper title='Standard Datepicker' style={{ width: '300px' }}>
      <Datepicker {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * [02. Pre-selected Value]
 * 초기값이 설정되어 있을 때 달력이 해당 날짜를 기준으로 열리는지 확인합니다.
 */
export const WithValue: Story = {
  args: {
    inputProps: {
      value: '2025-05-05',
      readonly: true,
    },
  },
  render: args => (
    <AnatomyWrapper title='Pre-selected (2025-05-05)' style={{ width: '300px' }}>
      <Datepicker {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * [03. Disabled State]
 * 비활성화 상태에서 트리거 버튼 및 입력이 차단되는지 확인합니다.
 */
export const Disabled: Story = {
  args: {
    inputProps: {
      disabled: true,
    },
  },
  render: args => (
    <AnatomyWrapper title='Disabled Datepicker' style={{ width: '300px' }}>
      <Datepicker {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * [04. Long Distance Portal]
 * 화면 하단에 위치했을 때 포털이 올바른 위치(위 또는 아래)에 생성되는지,
 * 스크롤 시 위치를 유지하는지 테스트하기 위한 스토리입니다.
 */
export const PortalTest: Story = {
  render: args => (
    <div style={{ height: '150vh', paddingTop: '100vh', paddingLeft: '50px' }}>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        스크롤을 내려서 데이트피커를 확인하세요.
      </p>
      <Datepicker {...args} />
    </div>
  ),
};
