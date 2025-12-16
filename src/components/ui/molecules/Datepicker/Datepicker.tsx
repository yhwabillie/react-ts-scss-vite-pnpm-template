import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import styles from '@/components/ui/molecules/Datepicker/Datepicker.module.scss';
import clsx from 'clsx';
import type { Color, Size, Variant } from '@/types/design/design-tokens.types';
import type { InputA11yProps } from '@/types/a11y/a11y-roles.types';
import Icon from '../../atoms/Icon/Icon';
import type { PortalPosition } from '../OptionListPortal/OptionListPortal';
import OptionListPortal from '../OptionListPortal/OptionListPortal';
import type { OptionBase } from '../OptionItem/OptionItem';
import type { Holiday } from '@/App';
import Calendar from '../../organisms/Calendar/Calendar';

interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
}

type NativeDivPorps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof InputA11yProps
>;

interface DatepickerProps extends StyleProps, NativeDivPorps {
  id?: string;
  inputProps?: {
    id?: string;
    value?: string;
    readonly?: boolean;
    disabled?: boolean;
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
  ({ variant, color, size, id, inputProps = {}, calendar, onDateChange }, ref) => {
    const {
      selectedYear,
      selectedMonth,
      selectedDate,
      calendarProps,
      holidays,
      onYearChange,
      onMonthChange,
      onDateSelect,
    } = calendar ?? {};
    // -----------------------------
    // 📌 상태 선언
    // -----------------------------
    // 📌 Datepicker 내부
    const [isOpen, setIsOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);

    // "현재 보고 있는" 달력 상태
    const [viewYear, setViewYear] = useState<number | null>(null);
    const [viewMonth, setViewMonth] = useState<number | null>(null);

    // -----------------------------
    // 🧩 Ref 선언
    // -----------------------------
    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const customInputRef = React.useRef<HTMLDivElement>(null);
    const nativeInputRef = React.useRef<HTMLInputElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

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

    const handleYearChange = (year: number) => {
      setViewYear(year);
      calendar?.onYearChange?.(year); // 외부로 전달
    };

    const handleMonthChange = (month: number) => {
      setViewMonth(month);
      calendar?.onMonthChange?.(month);
    };

    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(resolvedSelectedDate);
    const [confirmedDate, setConfirmedDate] = useState<Date | null>(resolvedSelectedDate); // 확정 값

    // -----------------------------------------------------
    // 🔧 [Portal] 위치 계산
    // - customInputRef 또는 containerRef 기준으로 위치 측정
    // - getBoundingClientRect() + window.scrollY/X로 스크롤 반영
    // - top: 요소 하단, left/width: 요소 좌측 및 너비
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
    // - Combobox 외부 영역 클릭 시 리스트 닫기
    // - input 영역(containerRef)과 포털(portalRef) 모두 체크
    // - 포털 구조에서도 정상 동작하도록 ref 기반 검사
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

    useEffect(() => {
      if (!isOpen) return;

      const baseDate = resolvedSelectedDate ?? new Date();

      setViewYear(baseDate.getFullYear());
      setViewMonth(baseDate.getMonth() + 1);
    }, [isOpen]);

    // -----------------------------------------------------
    // ✨ [Effect] 외부 클릭 이벤트 등록
    // - isOpen 상태일 때만 이벤트 리스너 등록
    // - mousedown 이벤트로 외부 클릭 감지
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
    // - isOpen 상태에 따라 Portal 위치 계산
    // - 열려있으면 동기적으로 위치 계산 후 상태 업데이트
    // - 닫히면 positioned, portalPos 초기화
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
    // ✨ [Effect] 윈도우 리사이즈/스크롤 시 Portal 위치 재계산
    // - isOpen 상태에서만 이벤트 리스너 등록
    // - 리사이즈 및 스크롤 이벤트 발생 시 updatePosition 실행
    // - 컴포넌트 언마운트 시 이벤트 제거
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
      setIsOpen(prev => !prev);
    }, []);

    // -----------------------------------------------------
    // ⌨️ [Interaction] ESC 키 감지
    // - ESC 키 입력 시 포털 닫기
    // -----------------------------------------------------
    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }, []);

    // -----------------------------------------------------
    // ✨ [Effect] ESC 키 이벤트 등록
    // - isOpen 상태일 때만 이벤트 리스너 등록
    // - keydown 이벤트로 ESC 키 감지
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) return;

      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }, [isOpen, handleEscapeKey]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={containerRef}
        id={id}
        className={clsx(
          `${styles['datepicker']} variant--${variant} color--${color} size--${size}`,
        )}
      >
        <div ref={customInputRef} className='custom-input'>
          <input
            ref={nativeInputRef}
            id={inputProps.id}
            type='text'
            value={confirmedDate ? formatDate(confirmedDate) : inputProps.value || ''}
            readOnly={inputProps.readonly}
            disabled={inputProps.disabled}
            aria-label='선택된 날짜'
            aria-describedby='datepicker-description'
          />
        </div>

        {/* 달력 노출 트리거 */}
        <button
          className='trigger-calendar'
          aria-label='달력 열기'
          disabled={inputProps.disabled}
          aria-expanded={isOpen}
          onClick={() => {
            toggle();
          }}
        >
          <Icon name='calendar' strokeWidth={2.5} />
        </button>

        {/* 스크린리더 */}
        <div id='datepicker-description' className='sr-only'>
          화살표 키로 날짜 이동, Enter 또는 Space로 선택, Escape로 닫기
        </div>

        {isOpen && (
          <OptionListPortal
            isOpen={isOpen}
            position={portalPos || { top: 0, left: 0, width: 0 }}
            portalRef={portalRef}
          >
            {positioned && selectedYear != null && selectedMonth != null && calendar != null && (
              <Calendar
                ref={calendarRef}
                variant='outline'
                color='primary'
                size='xl'
                selectedYear={viewYear ?? calendar.selectedYear}
                selectedMonth={viewMonth ?? calendar.selectedMonth}
                selectedDate={tempSelectedDate} // ✅ 임시 선택
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
                  setTempSelectedDate(confirmedDate); // 선택 전 상태로 복원
                  setIsOpen(false);
                }}
                onConfirm={() => {
                  if (!tempSelectedDate) return;

                  const formatted = formatDate(tempSelectedDate);

                  // 부모에게 최종 값 전달
                  onDateChange?.(formatted, tempSelectedDate);

                  // 확정 값에 반영
                  setConfirmedDate(tempSelectedDate);

                  // 달력 닫기
                  setIsOpen(false);
                }}
              />
            )}
          </OptionListPortal>
        )}
      </div>
    );
  },
);

Datepicker.displayName = 'Datepicker';

export default Datepicker;
