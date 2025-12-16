import type { InputA11yProps } from '@/types/a11y/a11y-roles.types';
import type { Color, Size, Variant } from '@/types/design/design-tokens.types';
import styles from '@/components/ui/organisms/Calendar/Calendar.module.scss';
import clsx from 'clsx';
import React, { forwardRef, useMemo, useState } from 'react';
import CalendarSelectbox from './CalendarSelectbox';
import { useCalendarMatrix, type CalendarCell } from './Calendar.mock';
import Icon from '../../atoms/Icon/Icon';
import IconButton from '../../molecules/IconButton/IconButton';
import ActionBar from '../ActionBar/ActionBar';
import Button from '../../molecules/Button/Button';
import ButtonGroup from '../../molecules/ButtonGroup/ButtonGroup';
import type { OptionBase } from '../../molecules/OptionItem/OptionItem';
import type { Holiday } from '@/App';

interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof InputA11yProps
>;

interface CalendarProps extends StyleProps, NativeDivProps {
  id?: string;
  selectedYear?: number;
  selectedMonth?: number;
  selectedDate?: Date | null;
  initialSelectedDate?: Date | null;
  calendarProps?: {
    yearOptions?: Omit<OptionBase, 'label'>[];
    monthOptions?: Omit<OptionBase, 'label'>[];
  };
  holidays?: Holiday[];
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onDateSelect?: (date: Date) => void;
  onDateChange?: (selectedDate: Date | null) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      variant,
      color,
      size,
      id,
      selectedYear,
      selectedMonth,
      selectedDate, // 최초 값
      initialSelectedDate = null,
      calendarProps = {},
      holidays = [],
      onYearChange,
      onMonthChange,
      onDateSelect,
      onDateChange,
      onConfirm,
      onCancel,
    },
    ref,
  ) => {
    // calendarProps 구조분해
    const { yearOptions, monthOptions } = calendarProps;

    const [activeHolidayKey, setActiveHolidayKey] = useState<string | null>(null);
    const resolvedSelectedDate = selectedDate ?? initialSelectedDate;

    // -----------------------------
    // 🔑 Selectbox에 전달할 현재 선택된 옵션 ID 계산
    // -----------------------------
    const derivedYear = selectedYear ?? resolvedSelectedDate?.getFullYear();

    const derivedMonth =
      selectedMonth ?? (resolvedSelectedDate ? resolvedSelectedDate.getMonth() + 1 : undefined);

    const currentYearOptionId = derivedYear ? `year-${derivedYear}` : undefined;

    const currentMonthOptionId = derivedMonth ? `month-${derivedMonth}` : undefined;

    // -----------------------------
    // 🎯 이전/다음 달 이동
    // -----------------------------
    const handlePrevMonth = () => {
      if (!derivedYear || !derivedMonth) return;

      if (derivedMonth === 1) {
        onYearChange?.(derivedYear - 1);
        onMonthChange?.(12);
      } else {
        onMonthChange?.(derivedMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (!derivedYear || !derivedMonth) return;

      if (derivedMonth === 12) {
        onYearChange?.(derivedYear + 1);
        onMonthChange?.(1);
      } else {
        onMonthChange?.(derivedMonth + 1);
      }
    };

    // -----------------------------
    // 🎯 오늘 날짜로 이동
    // -----------------------------
    const handleTodayClick = () => {
      const today = new Date();
      onYearChange?.(today.getFullYear());
      onMonthChange?.(today.getMonth() + 1);
    };

    // -----------------------------
    // 🎯 날짜 선택
    // -----------------------------
    const handleDateClick = (cell: CalendarCell) => {
      if (cell.disabled) return;
      onDateSelect?.(cell.date);
    };

    const holidayMap = useMemo(() => {
      const map = new Map<string, Holiday>();
      holidays.forEach(h => map.set(h.date, h));
      return map;
    }, [holidays]);

    // -----------------------------
    // 📊 달력 매트릭스 생성
    // -----------------------------
    const matrix = useMemo(() => {
      if (!derivedYear || !derivedMonth) return [];

      const baseMatrix = useCalendarMatrix(
        derivedYear,
        derivedMonth,
        resolvedSelectedDate ?? undefined,
      );

      return baseMatrix.map(week =>
        week.map(cell => {
          const ymd =
            cell.date.getFullYear().toString() +
            String(cell.date.getMonth() + 1).padStart(2, '0') +
            String(cell.date.getDate()).padStart(2, '0');

          const holiday = holidayMap.get(ymd);

          return {
            ...cell,
            isHoliday: Boolean(holiday),
            holidayName: holiday?.name,
          };
        }),
      );
    }, [derivedYear, derivedMonth, resolvedSelectedDate, holidayMap]);

    return (
      <div
        ref={ref}
        className={clsx(`${styles['calendar']} variant--${variant} color--${color} size--${size}`)}
        onMouseDown={e => {
          e.stopPropagation();
        }}
        role='dialog'
        aria-modal='true'
        aria-labelledby='calendar-title'
      >
        <h2 id='calendar-title' className='sr-only'>
          날짜 선택
        </h2>
        <div className='calendar-wrap' tabIndex={0}>
          <div className='calendar-head'>
            {/* 이전 달 */}
            <IconButton
              variant='soft'
              color='primary'
              size='xs'
              shape='pill'
              className='prev-month-btn'
              aria-label='이전 달'
              icon={<Icon name='chevron-left' />}
              onClick={handlePrevMonth}
            />
            {/* 연도, 월 선택 */}
            <div className='calendar-switch-wrap'>
              <CalendarSelectbox
                variant='outline'
                color='primary'
                size='xs'
                role='combobox'
                aria-labelledby='year-switch-label'
                id='year-switch-component'
                selectId='year-switch-select'
                options={yearOptions ?? []}
                defaultOptionId={currentYearOptionId}
                onValueChange={(optionId, option) => {
                  if (!option) return;
                  const year = Number(option.value.replace('년', ''));
                  onYearChange?.(year);
                }}
              />
              <CalendarSelectbox
                variant='outline'
                color='primary'
                size='xs'
                role='combobox'
                aria-labelledby='month-switch-label'
                id='month-switch-component'
                selectId='month-switch-select'
                options={monthOptions ?? []}
                defaultOptionId={currentMonthOptionId}
                onValueChange={(optionId, option) => {
                  if (!option) return;
                  onMonthChange?.(Number(option.value.replace('월', '')));
                }}
              />
            </div>
            {/* 다음 달 */}
            <IconButton
              variant='soft'
              color='primary'
              size='xs'
              shape='pill'
              className='prev-month-btn'
              aria-label='다음 달'
              icon={<Icon name='chevron-right' />}
              onClick={handleNextMonth}
            />
          </div>
          <div className='calendar-body' role='grid' aria-labelledby='calendar-title'>
            <div className='calendar-table-wrap'>
              <table className='calendar-table'>
                <caption>
                  {derivedYear}년 {derivedMonth}월
                </caption>
                <thead>
                  <tr>
                    <th scope='col'>일</th>
                    <th scope='col'>월</th>
                    <th scope='col'>화</th>
                    <th scope='col'>수</th>
                    <th scope='col'>목</th>
                    <th scope='col'>금</th>
                    <th scope='col'>토</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((week, wIdx) => (
                    <tr key={wIdx}>
                      {week.map(cell => (
                        <td
                          key={cell.date.toISOString()}
                          className={clsx({
                            old: cell.disabled,
                            today: cell.isToday,
                            selected: cell.isSelected,
                            holiday: cell.isHoliday,
                          })}
                          role='gridcell'
                          aria-selected={cell.isSelected}
                        >
                          <button
                            type='button'
                            className='btn-set-date'
                            disabled={cell.disabled}
                            tabIndex={cell.disabled ? -1 : 0}
                            aria-label={`${cell.day}${cell.isHoliday ? ` ${cell.holidayName}` : ''}${cell.isToday ? ' 오늘' : ''}${cell.isSelected ? ' 선택됨' : ''}`}
                            onClick={() => handleDateClick(cell)}
                            onMouseEnter={() =>
                              cell.isHoliday && setActiveHolidayKey(cell.date.toISOString())
                            }
                            onMouseLeave={() => setActiveHolidayKey(null)}
                            onFocus={() =>
                              cell.isHoliday && setActiveHolidayKey(cell.date.toISOString())
                            }
                            onBlur={() => setActiveHolidayKey(null)}
                          >
                            <span>{cell.day}</span>
                            {cell.isHoliday && (
                              <span
                                className={clsx('mark', {
                                  'is-active': activeHolidayKey === cell.date.toISOString(),
                                })}
                                data-label={cell.holidayName}
                                aria-hidden={true}
                              ></span>
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='calendar-footer'>
            <ActionBar size='xs' className='calendar-btn-wrap'>
              <ButtonGroup size='xs' align='left'>
                <Button
                  variant='outline'
                  color='tertiary'
                  size='xs'
                  shape='rounded'
                  className='today-btn'
                  onClick={handleTodayClick}
                >
                  오늘
                </Button>
              </ButtonGroup>
              <ButtonGroup size='xs' align='right' role='group' ariaLabel='날짜 선택 완료 버튼'>
                <Button
                  variant='outline'
                  color={color}
                  size='xs'
                  shape='rounded'
                  className='cancel-btn'
                  onClick={() => {
                    onCancel?.();
                  }}
                >
                  취소
                </Button>
                <Button
                  variant='solid'
                  color={color}
                  size='xs'
                  shape='rounded'
                  className='confirm-btn'
                  onClick={() => {
                    onConfirm?.();
                  }}
                >
                  확인
                </Button>
              </ButtonGroup>
            </ActionBar>
          </div>
        </div>
      </div>
    );
  },
);

Calendar.displayName = 'Calendar';

export default Calendar;
