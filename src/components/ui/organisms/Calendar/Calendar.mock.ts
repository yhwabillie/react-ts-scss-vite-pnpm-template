import type { OptionBase } from '../../molecules/OptionItem/OptionItem';

type CalendarLocale = string;

// 연도
const currentYear = new Date().getFullYear();

const PAST_YEARS = 10;
const FUTURE_YEARS = 2;

const formatYearLabel = (year: number, locale: CalendarLocale) =>
  new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(new Date(year, 0, 1));

const formatMonthLabel = (month: number, locale: CalendarLocale) =>
  new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, month - 1, 1));

export const getCalendarYearOptions = (locale: CalendarLocale = 'ko') =>
  Array.from({ length: PAST_YEARS + FUTURE_YEARS + 1 }, (_, i) => {
    const year = currentYear - PAST_YEARS + i;

    return {
      id: `year-${year}`,
      value: formatYearLabel(year, locale),
      selected: year === currentYear,
      disabled: false,
    };
  });

// 월
const currentMonth = new Date().getMonth() + 1; // 1 ~ 12

const TOTAL_MONTHS = 12;

export const getCalendarMonthOptions = (locale: CalendarLocale = 'ko') =>
  Array.from({ length: TOTAL_MONTHS }, (_, i) => {
    const month = i + 1;

    return {
      id: `month-${month}`,
      value: formatMonthLabel(month, locale),
      selected: month === currentMonth,
      disabled: false,
    };
  });

export const calendarYearOptions: Omit<OptionBase, 'label'>[] = getCalendarYearOptions('ko');
export const calendarMonthOptions: Omit<OptionBase, 'label'>[] = getCalendarMonthOptions('ko');

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

export const getWeekdayNames = (locale: CalendarLocale = 'ko', weekStartsOn: number = 0) => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const base = new Date(Date.UTC(2021, 0, 3));
  const names = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() + i);
    return formatter.format(date);
  });

  if (weekStartsOn === 0) return names;
  const offset = ((weekStartsOn % 7) + 7) % 7;
  return names.slice(offset).concat(names.slice(0, offset));
};

export const getCalendarStatusLabels = (locale: CalendarLocale = 'ko') => {
  const base = locale.split('-')[0];

  switch (base) {
    case 'en':
      return { today: 'today', selected: 'selected' };
    case 'ja':
      return { today: '今日', selected: '選択済み' };
    case 'ko':
    default:
      return { today: '오늘', selected: '선택됨' };
  }
};

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
