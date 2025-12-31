import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from './Calendar';
import {
  calendarYearOptions,
  calendarMonthOptions,
  TODAY_YEAR,
  TODAY_MONTH,
} from './Calendar.mock';
import { useState } from 'react';
import { GuideGroup } from '../../guide/Guide';

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

  argTypes: {
    calendarRef: {
      control: false,
      table: { category: 'Ref' },
    },
    // 🎨 Style 관련 그룹
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline'],
      description: '캘린더의 시각적 스타일 변형',
      table: { category: 'Style' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '컴포넌트의 주요 테마 색상',
      table: { category: 'Style' },
    },

    // 📅 Data & State 관련 그룹
    selectedYear: {
      control: { type: 'number' },
      description: '현재 선택된 연도',
      table: { category: 'State' },
    },
    selectedMonth: {
      control: { type: 'number', min: 1, max: 12 },
      description: '현재 선택된 월 (1-12)',
      table: { category: 'State' },
    },
    selectedDate: {
      control: 'date',
      description: '현재 선택된 날짜 객체',
      table: { category: 'State' },
    },
    initialSelectedDate: {
      control: 'date',
      description: '초기 선택값으로 설정될 날짜',
      table: { category: 'State' },
    },
    holidays: {
      control: 'object',
      description: '공휴일 정보 배열',
      table: { category: 'Data' },
    },
    calendarProps: {
      control: 'object',
      description: '연도/월 선택 박스의 옵션 커스텀 설정',
      table: { category: 'Data' },
    },

    // ⚡️ Events 관련 그룹
    onYearChange: {
      action: 'year changed',
      description: '연도 변경 시 실행되는 콜백',
      table: { category: 'Events' },
    },
    onMonthChange: {
      action: 'month changed',
      description: '월 변경 시 실행되는 콜백',
      table: { category: 'Events' },
    },
    onDateSelect: {
      action: 'date selected',
      description: '날짜를 클릭했을 때 실행되는 콜백',
      table: { category: 'Events' },
    },
    onDateChange: {
      action: 'date changed',
      description: '최종 선택 날짜가 변경되었을 때 실행되는 콜백',
      table: { category: 'Events' },
    },
    onConfirm: {
      action: 'confirmed',
      description: '확인 버튼 클릭 시 실행',
      table: { category: 'Events' },
    },
    onCancel: {
      action: 'cancelled',
      description: '취소 버튼 클릭 시 실행',
      table: { category: 'Events' },
    },
    onClose: {
      action: 'closed',
      description: '캘린더 닫기 액션 발생 시 실행',
      table: { category: 'Events' },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    selectedYear: TODAY_YEAR,
    selectedMonth: TODAY_MONTH,
    calendarProps: {
      yearOptions: calendarYearOptions,
      monthOptions: calendarMonthOptions,
    },
    holidays: [
      { date: '20260101', name: '신정' },
      { date: '20260128', name: '설날 연휴' },
      { date: '20260129', name: '설날' },
      { date: '20260130', name: '설날 연휴' },
    ],
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    selectedDate: new Date(2025, 11, 12),
  },
  render: args => {
    const [year, setYear] = useState(args.selectedYear);
    const [month, setMonth] = useState(args.selectedMonth);

    const [selectedDate, setSelectedDate] = useState<Date | null>(
      args.selectedDate ? new Date(args.selectedDate) : args.initialSelectedDate || new Date(),
    );

    return (
      <Calendar
        {...args}
        selectedYear={year}
        selectedMonth={month}
        selectedDate={selectedDate}
        onYearChange={y => setYear(y)}
        onMonthChange={m => setMonth(m)}
        onDateSelect={date => {
          setSelectedDate(date);
          args.onDateSelect?.(date);
        }}
      />
    );
  },
};

export const Colors: Story = {
  render: args => {
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];

    // 1. 각 컬러별 캘린더가 독립적인 상태를 갖도록 내부 컴포넌트 정의
    const ColorCalendarItem = ({
      colorTheme,
    }: {
      colorTheme: 'primary' | 'secondary' | 'tertiary';
    }) => {
      const [year, setYear] = useState(args.selectedYear || 2025);
      const [month, setMonth] = useState(args.selectedMonth || 12);
      const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 11, 12));

      return (
        <GuideGroup title={colorTheme}>
          <Calendar
            {...args}
            aria-label={colorTheme}
            color={colorTheme}
            selectedYear={year}
            selectedMonth={month}
            selectedDate={selectedDate}
            onYearChange={y => setYear(y)}
            onMonthChange={m => setMonth(m)}
            onDateSelect={date => setSelectedDate(date)}
          />
        </GuideGroup>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
        {colorOptions.map(color => (
          <ColorCalendarItem key={color} colorTheme={color} />
        ))}
      </div>
    );
  },
};

export const Holiday: Story = {
  args: {
    selectedYear: 2026,
    selectedMonth: 1, // 2월 페이지를 보여줌
    holidays: [
      { date: '20260101', name: '신정' },
      { date: '20260128', name: '설날 연휴' },
      { date: '20260129', name: '설날' },
      { date: '20260130', name: '설날 연휴' },
    ],
  },
  render: args => {
    const [year, setYear] = useState(args.selectedYear);
    const [month, setMonth] = useState(args.selectedMonth);

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 6));

    return (
      <GuideGroup title='Holidays (February 2026)'>
        <Calendar
          {...args}
          selectedYear={year}
          selectedMonth={month}
          selectedDate={selectedDate}
          onYearChange={y => setYear(y)}
          onMonthChange={m => setMonth(m)}
          onDateSelect={date => {
            setSelectedDate(date);
            args.onDateSelect?.(date);
          }}
          className='is-active'
        />
      </GuideGroup>
    );
  },
};
