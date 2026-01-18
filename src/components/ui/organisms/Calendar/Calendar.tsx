import type { InputA11yProps } from '@/types/a11y/a11y-roles.types';
import type { Color, Size, Variant } from '@/types/design/design-tokens.types';
import styles from '@/components/ui/organisms/Calendar/Calendar.module.scss';
import clsx from 'clsx';
import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import CalendarSelectbox from './CalendarSelectbox';
import {
  getCalendarStatusLabels,
  getWeekdayNames,
  useCalendarMatrix,
  type CalendarCell,
} from './Calendar.mock';
import Icon from '../../atoms/Icon/Icon';
import IconButton from '../../molecules/IconButton/IconButton';
import ActionBar from '../ActionBar/ActionBar';
import Button from '../../molecules/Button/Button';
import ButtonGroup from '../../molecules/ButtonGroup/ButtonGroup';
import type { OptionBase } from '../../molecules/OptionItem/OptionItem';
import CalendarSkeleton from '../../atoms/Skeleton/CalendarSkeleton';
import type { Holiday } from '../../molecules/Datepicker/Datepicker';

interface StyleProps {
  variant: Variant;
  color: 'primary' | 'secondary' | 'tertiary';
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof InputA11yProps
>;

export interface CalendarProps extends StyleProps, NativeDivProps {
  calendarRef?: React.RefObject<HTMLDivElement | null>;
  selectedYear?: number;
  selectedMonth?: number;
  selectedDate?: Date | null;
  initialSelectedDate?: Date | null;
  locale?: string;
  calendarProps?: {
    yearOptions?: Omit<OptionBase, 'label'>[];
    monthOptions?: Omit<OptionBase, 'label'>[];
  };
  holidays?: Holiday[];
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onDateSelect?: (date: Date) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      calendarRef,
      variant,
      color,
      selectedYear,
      selectedMonth,
      selectedDate,
      initialSelectedDate = null,
      locale = 'ko',
      calendarProps = {},
      holidays = [],
      onYearChange,
      onMonthChange,
      onDateSelect,
      onConfirm,
      onCancel,
      onClose,
      isLoading,
      ...rest
    },
    ref,
  ) => {
    const { yearOptions, monthOptions } = calendarProps;

    const [activeHolidayKey, setActiveHolidayKey] = useState<string | null>(null);
    const resolvedSelectedDate = selectedDate ?? initialSelectedDate;

    // -----------------------------
    // 🔑 Selectbox 선택 ID 계산
    // -----------------------------
    const derivedYear = selectedYear ?? resolvedSelectedDate?.getFullYear();

    const derivedMonth =
      selectedMonth ?? (resolvedSelectedDate ? resolvedSelectedDate.getMonth() + 1 : undefined);

    const currentYearOptionId = derivedYear ? `year-${derivedYear}` : undefined;

    const currentMonthOptionId = derivedMonth ? `month-${derivedMonth}` : undefined;

    // -----------------------------
    // 📌 요일/상태 라벨
    // -----------------------------
    const WEEKDAY_NAMES = useMemo(() => getWeekdayNames(locale), [locale]);
    const statusLabels = useMemo(() => getCalendarStatusLabels(locale), [locale]);

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
    const formatDateLabel = useCallback(
      (date: Date) =>
        new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        }).format(date),
      [locale],
    );

    const handleDateClick = (cell: CalendarCell) => {
      if (cell.disabled) return;
      onDateSelect?.(cell.date);

      if (calendarAnnouncerRef.current) {
        calendarAnnouncerRef.current.textContent = `${formatDateLabel(cell.date)} ${statusLabels.selected}`;
      }
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

    // Selectbox 열림 상태 추적 (연도)
    const isYearSelectboxOpenRef = useRef(false);
    // Selectbox 열림 상태 추적 (월)
    const isMonthSelectboxOpenRef = useRef(false);

    // 연도 Selectbox 열림 상태 업데이트
    const updateYearSelectboxOpenState = useCallback((isOpen: boolean) => {
      isYearSelectboxOpenRef.current = isOpen;
    }, []);

    // 월 Selectbox 열림 상태 업데이트
    const updateMonthSelectboxOpenState = useCallback((isOpen: boolean) => {
      isMonthSelectboxOpenRef.current = isOpen;
    }, []);

    // 날짜 셀 버튼 ref 배열
    const dateButtonRefs = useRef<(HTMLButtonElement | null)[][]>([]);

    // Live Region 및 마운트 상태
    const calendarAnnouncerRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef(false);

    // 현재 포커스된 날짜 좌표
    const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

    // Tab 진입 시 활성화할 셀 (선택 > 오늘 > 1일)
    const getTabTargetCell = useCallback(() => {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          const cell = matrix[i][j];
          if (cell.isSelected && !cell.disabled) {
            return { row: i, col: j };
          }
        }
      }

      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          const cell = matrix[i][j];
          if (cell.isToday && !cell.disabled) {
            return { row: i, col: j };
          }
        }
      }

      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          const cell = matrix[i][j];
          if (cell.day === 1 && !cell.disabled) {
            return { row: i, col: j };
          }
        }
      }

      return null;
    }, [matrix]);

    // 날짜 테이블 Arrow Key 처리
    const handleDateKeyDown = useCallback(
      (e: React.KeyboardEvent, rowIdx: number, colIdx: number) => {
        const key = e.key;

        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          return;
        }

        e.preventDefault();

        let newRow = rowIdx;
        let newCol = colIdx;
        let shouldChangeMonth = false; // 월 변경 플래그

        switch (key) {
          case 'ArrowUp':
            newRow = rowIdx - 1;
            break;

          case 'ArrowDown':
            newRow = rowIdx + 1;
            break;

          case 'ArrowLeft':
            if (colIdx === 0) {
              // 일요일(0)에서 왼쪽 키를 누르면
              if (rowIdx === 0) {
                // 캘린더의 첫 번째 셀에서도 왼쪽 키를 누르면: 이전 달로 이동
                shouldChangeMonth = true;
              } else {
                // 같은 주에서 토요일(6)로 이동
                newRow = rowIdx - 1;
                newCol = 6;
              }
            } else {
              newCol = colIdx - 1;
            }
            break;

          case 'ArrowRight':
            if (colIdx === 6) {
              // 토요일(6)에서 오른쪽 키를 누르면
              if (rowIdx === matrix.length - 1) {
                // 캘린더의 마지막 셀에서도 오른쪽 키를 누르면: 다음 달로 이동
                shouldChangeMonth = true;
              } else {
                // 같은 주에서 일요일(0)로 이동
                newRow = rowIdx + 1;
                newCol = 0;
              }
            } else {
              newCol = colIdx + 1;
            }
            break;
        }

        // -------------------------------------------------------------------
        // 1. 월/연도 변경 처리
        // -------------------------------------------------------------------
        if (shouldChangeMonth) {
          // 월이 변경되어 리렌더링이 발생하면, 이 함수의 나머지 부분은 무시됨
          if (key === 'ArrowLeft') {
            handlePrevMonth();
          } else if (key === 'ArrowRight') {
            handleNextMonth();
          }
          return; // 🚨 월 변경 후 함수 종료
        }

        // -------------------------------------------------------------------
        // 2. 현재 월 내에서 날짜 이동 처리
        // -------------------------------------------------------------------

        // 새 위치가 현재 매트릭스 경계를 벗어나지 않았는지 확인 (상하 화살표 이동 시)
        const targetButton = dateButtonRefs.current[newRow]?.[newCol];

        if (targetButton) {
          if (!targetButton.disabled) {
            // 유효한 날짜이고 disabled가 아니면 포커스 이동
            targetButton.focus();
            setFocusedCell({ row: newRow, col: newCol });
          } else {
            // 새 위치가 disabled (이전/다음 달 날짜)인 경우:
            // 이 경우는 'ArrowUp'/'ArrowDown'으로 월 경계를 넘어 이동하려 한 경우입니다.
            // 월 경계를 넘는 상하 이동은 허용하지 않고 현재 위치 유지 (return)
            return;
          }
        }
      },
      [matrix, handlePrevMonth, handleNextMonth],
    ); // 종속성 배열 유지

    // ESC: Selectbox가 열려 있으면 위임, 아니면 Calendar 닫기
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          const isAnySelectboxOpen =
            isYearSelectboxOpenRef.current || isMonthSelectboxOpenRef.current;

          if (isAnySelectboxOpen) {
            return;
          }
          e.preventDefault();
          onClose?.();
        }
      };

      document.addEventListener('keydown', handleEscape, true);
      return () => document.removeEventListener('keydown', handleEscape, true);
    }, [onClose]);

    // 캘린더 열림/월 변경 시 Tab 진입점만 갱신
    useEffect(() => {
      if (!matrix.length) return;

      const target = getTabTargetCell();
      if (target) {
        setFocusedCell(target);
      }
    }, [matrix, getTabTargetCell]);

    // 월/연도 변경 시 스크린 리더 공지
    useEffect(() => {
      if (derivedYear && derivedMonth && calendarAnnouncerRef.current) {
        if (isMounted.current) {
          const announcementMessage = `${derivedYear}년 ${derivedMonth}월`;
          calendarAnnouncerRef.current.textContent = announcementMessage;
        }

        isMounted.current = true;
      }
    }, [derivedYear, derivedMonth]);

    const uniqueId = useId();
    const bodyLabel = `${color || ''} ${derivedYear}년 ${derivedMonth}월 날짜 선택`.trim();

    // -----------------------------
    // 🎨 Skeleton 전용 행/열 생성 (6행 7열)
    // -----------------------------
    const skeletonRows = Array.from({ length: 6 });
    const skeletonCols = Array.from({ length: 7 });

    return (
      <div
        ref={calendarRef}
        className={clsx(
          `${styles['calendar']} variant--${variant} color--${color} ${isLoading && 'is-loading'}`,
        )}
        aria-busy={isLoading}
        onMouseDown={e => {
          e.stopPropagation();
        }}
      >
        {/* ARIA Live Region: 월/연도 변경 공지 */}
        <div
          ref={calendarAnnouncerRef}
          className='sr-only'
          aria-live='polite'
        >
          {isLoading ? '공휴일 정보를 불러오는 중입니다.' : ''}
        </div>
        <div
          className='calendar-wrap'
          role='region'
          aria-label={`${rest['aria-label']} 달력`}
          tabIndex={0}
        >
          <div className='calendar-head'>
            {/* 이전 달 */}
            <IconButton
              variant='solid'
              color={color}
              size='xs'
              shape='pill'
              className='prev-month-btn'
              aria-label='이전 달'
              icon={
                <Icon
                  className='icon'
                  name='chevron-left'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                />
              }
              onClick={handlePrevMonth}
              disabled={isLoading}
            />
            {/* 연도, 월 선택 */}
            <div className='calendar-switch-wrap'>
              <CalendarSelectbox
                aria-label='연도 선택'
                variant='outline'
                color={color}
                size='xs'
                role='combobox'
                aria-labelledby={`year-switch-label-${uniqueId}`}
                id={`year-switch-component-${uniqueId}`}
                selectId={`year-switch-select-${uniqueId}`}
                options={yearOptions ?? []}
                defaultOptionId={currentYearOptionId}
                onValueChange={(_, option) => {
                  if (!option) return;
                  const year = Number(option.id.replace('year-', ''));
                  if (!Number.isNaN(year)) {
                    onYearChange?.(year);
                  }
                }}
                onOpenChange={updateYearSelectboxOpenState}
                disabled={isLoading}
              />
              <CalendarSelectbox
                aria-label='월 선택'
                variant='outline'
                color={color}
                size='xs'
                role='combobox'
                aria-labelledby={`month-switch-label-${uniqueId}`}
                id={`month-switch-component-${uniqueId}`}
                selectId={`month-switch-select-${uniqueId}`}
                options={monthOptions ?? []}
                defaultOptionId={currentMonthOptionId}
                onValueChange={(_, option) => {
                  if (!option) return;
                  const month = Number(option.id.replace('month-', ''));
                  if (!Number.isNaN(month)) {
                    onMonthChange?.(month);
                  }
                }}
                onOpenChange={updateMonthSelectboxOpenState}
                disabled={isLoading}
              />
            </div>
            {/* 다음 달 */}
            <IconButton
              variant='solid'
              color={color}
              size='xs'
              shape='pill'
              className='prev-month-btn'
              aria-label='다음 달'
              icon={
                <Icon
                  className='icon'
                  name='chevron-right'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                />
              }
              onClick={handleNextMonth}
              disabled={isLoading}
            />
          </div>
          <div className='calendar-body' role='region' aria-label={bodyLabel}>
            <div className='calendar-table-wrap'>
              <table className='calendar-table' role='grid'>
                <thead>
                  <tr role='row'>
                    {WEEKDAY_NAMES.map(name => (
                      <th key={name} scope='col' role='columnheader'>
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    // -----------------------------
                    // 🦴 Skeleton UI 렌더링
                    // -----------------------------
                    <CalendarSkeleton />
                  ) : (
                    // -----------------------------
                    // 📅 실제 데이터 렌더링 (기존 로직)
                    // -----------------------------
                    matrix.map((week, rowIdx) => {
                      // ✅ 각 row마다 ref 배열 초기화
                      if (!dateButtonRefs.current[rowIdx]) {
                        dateButtonRefs.current[rowIdx] = [];
                      }

                      return (
                        <tr key={rowIdx} role='row'>
                          {week.map((cell, colIdx) => (
                            <td
                              key={cell.date.toISOString()}
                              role='presentation'
                              className={clsx({
                                old: cell.disabled,
                                today: cell.isToday,
                                selected: cell.isSelected,
                                holiday: cell.isHoliday,
                              })}
                            >
                              <button
                                ref={el => {
                                  dateButtonRefs.current[rowIdx][colIdx] = el;
                                }}
                                type='button'
                                role='gridcell'
                                className={clsx('btn-set-date')}
                                disabled={cell.disabled}
                                tabIndex={
                                  // ✅ roving tabindex: focusedCell과 일치하는 셀만 tabIndex={0}
                                  focusedCell?.row === rowIdx && focusedCell?.col === colIdx
                                    ? 0
                                    : -1
                                }
                                aria-selected={cell.isSelected}
                                // 🚨 수정된 aria-label
                                aria-label={`${formatDateLabel(cell.date)}${cell.isHoliday ? ` ${cell.holidayName}` : ''}${cell.isToday ? ` ${statusLabels.today}` : ''}${cell.isSelected ? ` ${statusLabels.selected}` : ''}`}
                                onClick={() => handleDateClick(cell)}
                                onKeyDown={e => handleDateKeyDown(e, rowIdx, colIdx)}
                                onMouseEnter={() =>
                                  cell.isHoliday && setActiveHolidayKey(cell.date.toISOString())
                                }
                                onMouseLeave={() => setActiveHolidayKey(null)}
                                onFocus={() => {
                                  setFocusedCell({ row: rowIdx, col: colIdx });
                                  cell.isHoliday && setActiveHolidayKey(cell.date.toISOString());
                                }}
                                onBlur={() => setActiveHolidayKey(null)}
                              >
                                <span>{cell.day}</span>
                                {cell.isHoliday && (
                                  <span
                                    className={clsx(
                                      'mark',
                                      activeHolidayKey === cell.date.toISOString() && 'is-active',
                                      rest.className && 'is-active',
                                    )}
                                    data-label={cell.holidayName}
                                    aria-hidden={true}
                                  ></span>
                                )}
                              </button>
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className='calendar-footer'>
            <ActionBar size='xs' className='calendar-btn-wrap'>
              <ButtonGroup size='xs' align='left'>
                <Button
                  variant='outline'
                  color={color}
                  size='xs'
                  shape='rounded'
                  className='today-btn'
                  onClick={handleTodayClick}
                  disabled={isLoading}
                >
                  오늘
                </Button>
              </ButtonGroup>
              <ButtonGroup size='xs' align='right' role='group' ariaLabel='기능 버튼 그룹'>
                <Button
                  variant='outline'
                  color={color}
                  size='xs'
                  shape='rounded'
                  className='cancel-btn'
                  onClick={() => {
                    onCancel?.();
                  }}
                  disabled={isLoading}
                >
                  닫기
                </Button>
                <Button
                  variant='solid'
                  color={color}
                  size='xs'
                  shape='rounded'
                  className='confirm-btn'
                  onClick={() => {
                    onConfirm?.();
                    onClose?.(); // 🚨 달력 닫기 요청 추가 (Datepicker가 이 요청을 받고 포커스를 Input으로 복귀시켜야 함)
                  }}
                  disabled={isLoading}
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
