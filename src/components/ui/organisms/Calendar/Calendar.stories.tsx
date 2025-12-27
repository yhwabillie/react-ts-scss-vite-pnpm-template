import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from './Calendar';
import {
  calendarYearOptions,
  calendarMonthOptions,
  TODAY_YEAR,
  TODAY_MONTH,
} from './Calendar.mock';
import AnatomyWrapper from '../../guide/AnatomyWrapper';

/**
 * [Calendar]
 * 연도, 월 이동 및 날짜 선택 기능을 제공하는 유기체 컴포넌트입니다.
 * - **Roving Tabindex**: 키보드 화살표 키로 날짜 간 이동이 가능합니다.
 * - **Live Region**: 연도/월 변경 시 스크린 리더가 현재 정보를 공지합니다.
 * - **Selectbox Integration**: 내부 Selectbox가 열려 있을 때 ESC 전파를 제어합니다.
 */
const meta = {
  title: 'UI/Organisms/Calendar/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    selectedYear: TODAY_YEAR,
    selectedMonth: TODAY_MONTH,
    selectedDate: new Date(),
    calendarProps: {
      yearOptions: calendarYearOptions,
      monthOptions: calendarMonthOptions,
    },
    holidays: [
      { date: '20250101', name: '신정' },
      { date: '20250128', name: '설날 연휴' },
      { date: '20250129', name: '설날' },
      { date: '20250130', name: '설날 연휴' },
    ],
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    onYearChange: { action: 'yearChanged' },
    onMonthChange: { action: 'monthChanged' },
    onDateSelect: { action: 'dateSelected' },
    onClose: { action: 'calendarClosed' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Interactive Calendar]
 * 연도/월 변경 및 날짜 선택 시 state가 동기화되는 실제 동작 버전입니다.
 */
export const Interactive: Story = {
  render: (args, { updateArgs }) => {
    // 1. 연도 변경 핸들러
    const handleYearChange = (year: number) => {
      updateArgs({ selectedYear: year });
      args.onYearChange?.(year);
    };

    // 2. 월 변경 핸들러
    const handleMonthChange = (month: number) => {
      updateArgs({ selectedMonth: month });
      args.onMonthChange?.(month);
    };

    // 3. 날짜 선택 핸들러
    const handleDateSelect = (date: Date) => {
      updateArgs({ selectedDate: date });
      args.onDateSelect?.(date);
    };

    return (
      <AnatomyWrapper title='Interactive Calendar' style={{ width: '340px' }}>
        <Calendar
          {...args}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
          onDateSelect={handleDateSelect}
        />
      </AnatomyWrapper>
    );
  },
};

/**
 * [02. Holiday Display]
 * 공휴일 데이터가 주입되었을 때의 시각적 피드백과 마크 표시를 확인합니다.
 */
export const WithHolidays: Story = {
  args: {
    selectedYear: 2025,
    selectedMonth: 1,
  },
  render: args => (
    <AnatomyWrapper title='January 2025 with Holidays' style={{ width: '340px' }}>
      <Calendar {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * [03. Size Variation]
 * 디자인 시스템의 크기별 레이아웃 대응을 확인합니다.
 */
export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <AnatomyWrapper title='Size: XS' style={{ width: '280px' }}>
          <Calendar {...args} size='xs' />
        </AnatomyWrapper>
        <AnatomyWrapper title='Size: SM' style={{ width: '300px' }}>
          <Calendar {...args} size='sm' />
        </AnatomyWrapper>
      </div>
      <AnatomyWrapper title='Size: MD (Default)' style={{ width: '340px' }}>
        <Calendar {...args} size='md' />
      </AnatomyWrapper>
    </div>
  ),
};

/**
 * [04. Empty Selection]
 * 선택된 날짜가 없을 때(오늘 날짜 중심)의 초기 상태를 확인합니다.
 */
export const NoSelection: Story = {
  args: {
    selectedDate: null,
    initialSelectedDate: null,
  },
};
