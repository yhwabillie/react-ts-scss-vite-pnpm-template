import type { OptionBase } from '../../molecules/OptionItem/OptionItem';

// 연도
const currentYear = new Date().getFullYear();

const PAST_YEARS = 10;
const FUTURE_YEARS = 2;

export const calendarYearOptions: Omit<OptionBase, 'label'>[] = Array.from(
  { length: PAST_YEARS + FUTURE_YEARS + 1 },
  (_, i) => {
    const year = currentYear - PAST_YEARS + i;

    return {
      id: `year-${year}`,
      value: `${year}년`,
      selected: year === currentYear,
      disabled: false,
    };
  },
);

// 월
const currentMonth = new Date().getMonth() + 1; // 1 ~ 12

const TOTAL_MONTHS = 12;

export const calendarMonthOptions: Omit<OptionBase, 'label'>[] = Array.from(
  { length: TOTAL_MONTHS },
  (_, i) => {
    const month = i + 1;

    return {
      id: `month-${month}`,
      value: `${month}월`,
      selected: month === currentMonth,
      disabled: false,
    };
  },
);

// 달력 matrix
const today = new Date();

export const TODAY_YEAR = today.getFullYear();
export const TODAY_MONTH = today.getMonth() + 1; // 1~12
export const TODAY_DATE = today.getDate();

export function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export interface CalendarCell {
  date: Date;
  year: number;
  month: number; // 1~12
  day: number;

  // 👇 추가
  isHoliday?: boolean;
  holidayName?: string;

  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
  disabled: boolean;
}

export function useCalendarMatrix(
  year: number = TODAY_YEAR,
  month: number = TODAY_MONTH,
  selectedDate?: Date,
): CalendarCell[][] {
  const today = new Date();
  const firstOfMonth = new Date(year, month - 1, 1);
  const startDay = firstOfMonth.getDay();
  const startDate = new Date(year, month - 1, 1 - startDay);

  const cells: CalendarCell[] = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isCurrentMonth = date.getMonth() + 1 === month;

    cells.push({
      date,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      isToday: isSameDate(date, today),
      isSelected: selectedDate ? isSameDate(date, selectedDate) : false,
      isCurrentMonth,
      disabled: !isCurrentMonth,
    });
  }

  const matrix: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    matrix.push(cells.slice(i, i + 7));
  }

  return matrix;
}
