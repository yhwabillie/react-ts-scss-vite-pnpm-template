import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from './Calendar';
import {
  calendarYearOptions,
  calendarMonthOptions,
  TODAY_YEAR,
  TODAY_MONTH,
} from './Calendar.mock';
import { useEffect, useState } from 'react';
import { GuideGroup } from '../../guide/Guide';
import { expect, within, userEvent, waitFor, waitForElementToBeRemoved } from '@storybook/test';

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
      <GuideGroup title='Holidays'>
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

export const AsyncHolidays: Story = {
  parameters: {
    // 웹접근성 검사 차단, storybook 검사 도구 한계
    // max-height로 가려진 스크롤 영역으로 가려지는 부분을 배경 색상 감지 불가로 체크
    // 웹접근성 에러가 아닌데 도구의 한계로 에러로 알려줌
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: false },
          { id: 'scrollable-region-focusable', enabled: false },
        ],
      },
    },
  },
  render: args => {
    const [isLoading, setIsLoading] = useState(true);
    const [holidays, setHolidays] = useState<{ date: string; name: string }[]>([]);
    const [year, setYear] = useState(args.selectedYear || 2026);
    const [month, setMonth] = useState(args.selectedMonth || 1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 1));

    // API 호출 시뮬레이션
    useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setHolidays([
          { date: '20260101', name: '신정' },
          { date: '20260128', name: '설날 연휴' },
          { date: '20260129', name: '설날' },
          { date: '20260130', name: '설날 연휴' },
        ]);
        setIsLoading(false);
      }, 2000); // 2초 뒤 데이터 로드 완료

      return () => clearTimeout(timer);
    }, [year, month]); // 연/월 변경 시 다시 로딩하는 시나리오

    return (
      <GuideGroup title='API Data Loading (Skeleton)'>
        <div style={{ position: 'relative', width: 'fit-content' }}>
          {/* 실제 구현 시 Calendar 컴포넌트 내부에 isLoading props가 있거나, 
            Skeleton 전용 컴포넌트를 따로 배치할 수 있습니다.
          */}
          <Calendar
            {...args}
            selectedYear={year}
            selectedMonth={month}
            selectedDate={selectedDate}
            holidays={holidays}
            onYearChange={y => setYear(y)}
            onMonthChange={m => setMonth(m)}
            onDateSelect={date => setSelectedDate(date)}
            isLoading={isLoading}
          />
        </div>
      </GuideGroup>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('로딩 상태 해제 대기', async () => {
      // "불러오는 중" 문구가 사라질 때까지 대기
      await waitForElementToBeRemoved(() => canvas.queryByText(/불러오는 중/i), {
        timeout: 10000, // 6초 지연을 고려해 10초 설정
      });
    });

    await step('공휴일 데이터 확인 (Aria-label 활용)', async () => {
      /**
       * 1. 텍스트가 쪼개져 있거나 title 속성에만 정보가 있는 경우를 대비해
       * findByRole이나 findByLabelText를 사용합니다.
       * 캘린더 날짜 셀은 보통 gridcell이나 button 역할을 가집니다.
       */
      const holidayCell = await canvas.findByRole(
        'gridcell', // button 대신 gridcell 사용
        {
          name: /2026년 1월 1일 목요일 신정/i, // 전체 문구 혹은 정규식 사용
        },
        { timeout: 5000 },
      );

      await expect(holidayCell).toBeInTheDocument();
    });

    await step('날짜 선택 테스트', async () => {
      // 1. role을 'gridcell'로 변경하고 정규식을 사용하여 유연하게 찾습니다.
      const date5 = await canvas.findByRole('gridcell', {
        name: /2026년 1월 5일 월요일/i,
      });

      // 2. 클릭 인터랙션
      await userEvent.click(date5);

      // 3. 클래스(is-active) 대신 aria-selected 속성이 true인지 확인
      // 이 방식이 스크린 리더 사용자에게 선택되었다는 정보가 전달되는지 확인하는 더 정확한 방법입니다.
      await expect(date5).toHaveAttribute('aria-selected', 'true');

      // 만약 스타일 확인을 위해 클래스도 체크하고 싶다면 병행할 수 있습니다.
      // await expect(date5).toHaveClass('is-active');
    });
  },
};
