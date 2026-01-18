import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/ui/molecules/Datepicker/Datepicker.module.scss';
import clsx from 'clsx';
import type { Color, Size } from '@/types/design/design-tokens.types';
import type { InputA11yProps } from '@/types/a11y/a11y-roles.types';
import Icon from '../../atoms/Icon/Icon';
import type { PortalPosition } from '../OptionListPortal/OptionListPortal';
import OptionListPortal from '../OptionListPortal/OptionListPortal';
import type { OptionBase } from '../OptionItem/OptionItem';
import Calendar from '../../organisms/Calendar/Calendar';
import IconButton from '../IconButton/IconButton';

export type Holiday = {
  date: string;
  name: string;
};

interface StyleProps {
  variant: 'solid' | 'outline';
  shape?: 'square' | 'rounded' | 'pill';
  color: 'primary' | 'secondary' | 'tertiary';
  size: Size;
}

type NativeDivPorps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof InputA11yProps
>;

export interface DatepickerProps extends StyleProps, NativeDivPorps {
  id?: string;
  as?: React.ElementType;
  className?: string;
  locale?: string;
  inputProps?: {
    id?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
  };
  buttonProps?: {
    variant: 'ghost' | 'solid';
  };
  calendar?: {
    selectedYear: number;
    selectedMonth: number;
    selectedDate?: Date | null;
    calendarProps?: {
      yearOptions?: Omit<OptionBase, 'label'>[];
      monthOptions?: Omit<OptionBase, 'label'>[];
    };
    holidays?: Holiday[];
    onYearChange?: (year: number) => void;
    onMonthChange?: (month: number) => void;
    onDateSelect?: (date: Date) => void;
  };
  onDateChange?: (value: string, date: Date) => void;
}

const Datepicker = forwardRef<HTMLDivElement, DatepickerProps>(
  (
    {
      variant,
      shape = 'rounded',
      color,
      size,
      id,
      'aria-labelledby': ariaLabelledBy,
      className,
      locale = 'ko',
      as: Component = 'label',
      inputProps = {},
      buttonProps = {
        variant: 'ghost',
      },
      calendar,
      onDateChange,
    },
    ref,
  ) => {
    const resolvedReadOnly = inputProps.readOnly ?? false;
    const { selectedYear, selectedMonth, selectedDate } = calendar ?? {};
    // -----------------------------
    // 📌 상태
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);

    // 달력 표시용 연/월 (선택값과 분리)
    const [viewYear, setViewYear] = useState<number | null>(null);
    const [viewMonth, setViewMonth] = useState<number | null>(null);

    // -----------------------------
    // 🧩 Ref
    // -----------------------------
    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const customInputRef = React.useRef<HTMLDivElement>(null);
    const nativeInputRef = React.useRef<HTMLInputElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    // ✅ 키보드로 열린 경우 포커스 이동 처리
    const [openedByKeyboard, setOpenedByKeyboard] = useState(false);
    const resolvedInputId = inputProps.id ?? id;
    const labelId = id && resolvedInputId && id === resolvedInputId ? `${id}-label` : id;

    const formatDate = (date: Date): string => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const parseDateString = (value?: string): Date | null => {
      if (!value) return null;

      // YYYY-MM-DD 형식만 허용
      const [y, m, d] = value.split('-').map(Number);
      if (!y || !m || !d) return null;

      return new Date(y, m - 1, d);
    };

    const inputDate = parseDateString(inputProps.value);

    /**
     * 우선순위
     * 1. calendar.selectedDate (외부 제어)
     * 2. inputProps.value 기반 Date
     */
    const resolvedSelectedDate = selectedDate ?? inputDate ?? null;

    const today = new Date();

    const derivedYear = resolvedSelectedDate?.getFullYear() ?? selectedYear ?? today.getFullYear();

    const derivedMonth = resolvedSelectedDate
      ? resolvedSelectedDate.getMonth() + 1
      : (selectedMonth ?? today.getMonth() + 1);

    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(resolvedSelectedDate);
    const [confirmedDate, setConfirmedDate] = useState<Date | null>(resolvedSelectedDate);
    const [inputValue, setInputValue] = useState<string>(
      confirmedDate ? formatDate(confirmedDate) : inputProps.value || '',
    );

    useEffect(() => {
      if (confirmedDate) {
        setInputValue(formatDate(confirmedDate));
      } else {
        setInputValue(inputProps.value || '');
      }
    }, [confirmedDate, inputProps.value]);

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
      setInputValue(event.target.value);
      inputProps.onChange?.(event);
    };

    const handleInputBlur: React.FocusEventHandler<HTMLInputElement> = () => {
      if (resolvedReadOnly) return;
      const parsed = parseDateString(inputValue);
      if (!parsed) return;

      setConfirmedDate(parsed);
      setTempSelectedDate(parsed);
      onDateChange?.(formatDate(parsed), parsed);
    };

    // -----------------------------------------------------
    // 🔧 [Portal] 위치 계산
    // - 트리거 기준 rect + scroll
    // -----------------------------------------------------
    const updatePosition = useCallback(() => {
      if (!isOpen) return null;

      const el = customInputRef.current ?? containerRef.current;
      if (!el) return null;

      const rect = el.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      } as PortalPosition;
    }, [isOpen]);

    // -----------------------------------------------------
    // 🖱️ [Interaction] 외부 클릭 감지
    // - 트리거/포털/캘린더 외부 클릭 시 닫기
    // -----------------------------------------------------
    const handleOutsideClick = useCallback((event: MouseEvent) => {
      const path = event.composedPath();

      const isInsideContainer = containerRef.current && path.includes(containerRef.current);

      const isInsidePortal = portalRef.current && path.includes(portalRef.current);

      const isInsideCalendar = calendarRef.current && path.includes(calendarRef.current);

      if (!isInsideContainer && !isInsidePortal && !isInsideCalendar) {
        setIsOpen(false);
      }
    }, []);

    // -----------------------------------------------------
    // ✨ [Effect] 달력 열림 시 초기 뷰 설정
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) return;

      // confirmedDate -> selectedDate -> today 순으로 기준 선정
      const baseDate = confirmedDate ?? resolvedSelectedDate ?? new Date();

      setViewYear(baseDate.getFullYear());
      setViewMonth(baseDate.getMonth() + 1);

      setTempSelectedDate(confirmedDate ?? resolvedSelectedDate);
    }, [isOpen, confirmedDate, resolvedSelectedDate]);

    // -----------------------------------------------------
    // ✨ [Effect] 외부 클릭 이벤트 등록
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) return;

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [isOpen, handleOutsideClick]);

    // -----------------------------------------------------
    // ✨ [Effect] Portal 위치 초기화
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) {
        setPositioned(false);
        setPortalPos(null);
        return;
      }

      const pos = updatePosition();
      if (pos) {
        setPortalPos(pos);
        setPositioned(true);
      }
    }, [isOpen, updatePosition]);

    // -----------------------------------------------------
    // ✨ [Effect] 리사이즈/스크롤 시 위치 재계산
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) return;

      const handle = () => {
        const pos = updatePosition();
        if (pos) setPortalPos(pos);
      };

      window.addEventListener('resize', handle);
      window.addEventListener('scroll', handle, true);

      return () => {
        window.removeEventListener('resize', handle);
        window.removeEventListener('scroll', handle, true);
      };
    }, [isOpen, updatePosition]);

    const toggle = useCallback(() => {
      // readOnly일 경우 함수 실행을 즉시 중단
      if (resolvedReadOnly) return;

      setIsOpen(prev => !prev);
    }, [resolvedReadOnly]);

    // ⌨️ [Interaction] 트리거 키보드 열기
    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // readOnly일 경우 키 이벤트를 무시
      if (resolvedReadOnly) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setOpenedByKeyboard(true);
      }
    };

    // ✅ 키보드로 열렸을 때 캘린더로 포커스 이동
    useEffect(() => {
      // 1. 달력이 열렸고 (isOpen)
      // 2. 키보드로 열렸으며 (openedByKeyboard)
      // 3. Portal 내부에 캘린더가 위치가 잡혀서 렌더링되었을 때 (positioned)
      if (isOpen && openedByKeyboard && positioned) {
        requestAnimationFrame(() => {
          if (calendarRef.current) {
            // 🚨 수정된 부분: 'calendar-wrap' 클래스를 가진 요소 찾기
            const calendarWrap = calendarRef.current.querySelector<HTMLElement>(
              '.calendar-wrap[tabindex="0"]', // tabindex="0"이 설정된 요소를 명확히 지정
            );

            if (calendarWrap) {
              calendarWrap.focus();
              setOpenedByKeyboard(false); // 포커스 이동 성공 후 플래그 초기화
            } else {
              // calendar-wrap이 없으면 첫 날짜 버튼으로 대체
              const firstDateBtn = calendarRef.current.querySelector<HTMLElement>(
                '.btn-set-date:not([disabled])',
              );
              if (firstDateBtn) {
                firstDateBtn.focus();
                setOpenedByKeyboard(false);
              }
            }
          }
        });
      }
    }, [isOpen, openedByKeyboard, positioned]);

    // storybook 상태 클래스: 일반 클래스만
    const filteredClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => {
          // 1. 'pseudo-'가 아니면 통과
          if (!name.startsWith('pseudo-')) return true;

          // 2. 'pseudo-hover'는 통과
          return name === 'pseudo-hover';
        })
        .join(' ');
    }, [className]);

    // storybook 상태 클래스: pseudo 전용
    const pseudoClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => name.startsWith('pseudo-') && name !== 'pseudo-hover')
        .join(' ');
    }, [className]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <Component
        {...(Component === 'label' ? { htmlFor: resolvedInputId } : {})}
        ref={containerRef}
        id={labelId}
        className={clsx(
          `${styles['datepicker']} variant--${variant} ${`shape--${shape}`} color--${color} size--${size}`,
          filteredClassName,
        )}
      >
        <div ref={customInputRef} className='custom-input'>
          <input
            ref={nativeInputRef}
            type='text'
            className={clsx('custom-input-text', pseudoClassName)}
            {...inputProps}
            id={resolvedInputId}
            aria-labelledby={ariaLabelledBy}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            readOnly={resolvedReadOnly}
          />
          <span id={ariaLabelledBy} className='sr-only'>
            {inputProps?.placeholder}
          </span>
          <IconButton
            className='trigger-calendar'
            aria-expanded={isOpen}
            disabled={inputProps.disabled || resolvedReadOnly}
            type='button'
            aria-label={isOpen ? '달력 닫기' : '달력 열기'}
            onClick={toggle}
            onKeyDown={handleTriggerKeyDown}
            variant={buttonProps.variant}
            color={color}
            shape={shape}
            size={size}
            icon={
              <Icon
                className='icon'
                name='calendar'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.5}
              />
            }
          />
        </div>

        {isOpen && (
          <OptionListPortal
            isOpen={isOpen}
            position={portalPos || { top: 0, left: 0, width: 0 }}
            portalRef={portalRef}
          >
            {positioned && selectedYear != null && selectedMonth != null && calendar != null && (
              <Calendar
                calendarRef={calendarRef}
                variant='outline'
                color={color}
                locale={locale}
                selectedYear={viewYear ?? calendar.selectedYear}
                selectedMonth={viewMonth ?? calendar.selectedMonth}
                selectedDate={tempSelectedDate}
                calendarProps={calendar.calendarProps}
                holidays={calendar.holidays}
                onYearChange={year => {
                  setViewYear(year);
                  calendar.onYearChange?.(year);
                }}
                onMonthChange={month => {
                  setViewMonth(month);
                  calendar.onMonthChange?.(month);
                }}
                onDateSelect={date => setTempSelectedDate(date)}
                onCancel={() => {
                  setTempSelectedDate(confirmedDate);
                  setIsOpen(false);
                  nativeInputRef.current?.focus();
                }}
                onConfirm={() => {
                  if (!tempSelectedDate) return;
                  const formatted = formatDate(tempSelectedDate);
                  onDateChange?.(formatted, tempSelectedDate);
                  setConfirmedDate(tempSelectedDate);
                  setIsOpen(false);
                  nativeInputRef.current?.focus();
                }}
                onClose={() => {
                  setIsOpen(false);
                  nativeInputRef.current?.focus();
                }}
              />
            )}
          </OptionListPortal>
        )}
      </Component>
    );
  },
);

Datepicker.displayName = 'Datepicker';

export default Datepicker;
