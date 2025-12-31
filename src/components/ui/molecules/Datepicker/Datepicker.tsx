import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import IconButton from '../IconButton/IconButton';

interface StyleProps {
  variant: 'solid' | 'outline';
  shape?: 'square' | 'rounded' | 'pill';
  color: Color;
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
  inputProps?: {
    id?: string;
    value?: string;
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

    // ✅ 캘린더가 키보드로 열렸는지 추적
    const [openedByKeyboard, setOpenedByKeyboard] = useState(false);
    const triggerButtonRef = useRef<HTMLButtonElement>(null);

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
        setPositioned(true); // 👈 캘린더가 렌더링을 시작할 수 있는 신호
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
      // readOnly일 경우 함수 실행을 즉시 중단
      if (inputProps.readOnly) return;

      setIsOpen(prev => !prev);
    }, [inputProps.readOnly]);

    // ⌨️ [Interaction] 달력 트리거 버튼 키다운 핸들러 수정 (이 부분은 유지)
    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // readOnly일 경우 키 이벤트를 무시
      if (inputProps.readOnly) return;

      // Enter 또는 Space 키를 감지
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // 1. 캘린더 열기
        setIsOpen(true);
        // 2. 키보드로 열림 플래그 설정
        setOpenedByKeyboard(true);
      }
    };

    // ✅ 키보드 포커스 제어 로직 통합 및 수정
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
              // calendar-wrap을 찾지 못했다면, 이전에 하려던 날짜 버튼 포커스를 시도 (대비책)
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

    // storybook states 스타일 클래스 적용 - 'pseudo-'로 시작하지 않는 것
    const filteredClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => {
          // 1. 'pseudo-'로 시작하지 않는 일반 클래스는 무조건 통과
          if (!name.startsWith('pseudo-')) return true;

          // 2. 'pseudo-'로 시작하더라도 'pseudo-hover'인 경우는 통과
          return name === 'pseudo-hover';
        })
        .join(' ');
    }, [className]);

    // storybook states 스타일 클래스 적용 - 'pseudo-'로 시작하는 것
    const pseudoClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => name.startsWith('pseudo-') && name !== 'pseudo-hover') // ✅ pseudo-로 시작하지만, pseudo-hover는 아닐 때만 남김
        .join(' ');
    }, [className]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <Component
        {...(Component === 'label' ? { htmlFor: id } : {})}
        ref={containerRef}
        id={id}
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
            aria-labelledby={ariaLabelledBy}
            // 1. 확정된 날짜가 있으면 포맷팅된 값을 보여주고, 없으면 inputProps의 초기값 사용
            value={confirmedDate ? formatDate(confirmedDate) : inputProps.value || ''}
            readOnly={inputProps.readOnly}
          />
          <span id={ariaLabelledBy} className='sr-only'>
            {inputProps?.placeholder}
          </span>
          <IconButton
            ref={triggerButtonRef}
            className='trigger-calendar'
            aria-expanded={isOpen}
            disabled={inputProps.disabled}
            type='button'
            aria-label={isOpen ? '달력 닫기' : '달력 열기'}
            onClick={() => {
              toggle();
            }}
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
                color='primary'
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
                  // ✅ 트리거 버튼으로 포커스 복귀
                  nativeInputRef.current?.focus();
                }}
                onConfirm={() => {
                  if (!tempSelectedDate) return;
                  const formatted = formatDate(tempSelectedDate);
                  onDateChange?.(formatted, tempSelectedDate);
                  setConfirmedDate(tempSelectedDate);
                  setIsOpen(false);
                  // ✅ 트리거 버튼으로 포커스 복귀
                  nativeInputRef.current?.focus();
                }}
                onClose={() => {
                  setIsOpen(false);
                  // ✅ ESC로 닫을 때도 트리거 버튼으로 포커스 복귀
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
