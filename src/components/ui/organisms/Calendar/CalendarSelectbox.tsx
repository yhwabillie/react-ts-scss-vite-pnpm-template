import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/organisms/Calendar/CalendarSelectbox.module.scss';
import type { Size, Variant, Color } from '@/types/design/design-tokens.types';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import Icon from '@/components/ui/atoms/Icon/Icon';
import type { PortalPosition } from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import OptionListPortal from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import OptionItem, { type OptionBase } from '@/components/ui/molecules/OptionItem/OptionItem';
import type { SelectboxA11yProps } from '@/types/a11y/a11y-roles.types';
import CalendarOptionList from './CalendarOptionList';

interface StyleProps {
  variant: 'solid' | 'outline';
  color: 'primary' | 'secondary' | 'tertiary';
  size: Size;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof SelectboxA11yProps
>;

export interface SelectboxProps extends StyleProps, SelectboxA11yProps, NativeDivProps {
  id?: string;
  selectId?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options: OptionBase[];
  defaultOptionId?: string; // controlled
  onValueChange?: (id: string, option?: OptionBase) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

const CalendarSelectbox = forwardRef<HTMLDivElement, SelectboxProps>(
  (
    {
      variant,
      color,
      size,
      role,
      'aria-labelledby': ariaLabelledBy,
      'aria-label': ariaLabel,
      id,
      selectId,
      required,
      disabled,
      className,
      placeholder,
      options,
      defaultOptionId,
      onValueChange,
      onOpenChange,
    },
    ref,
  ) => {
    // -----------------------------
    // 📌 상태
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // -----------------------------
    // 🧩 Ref
    // -----------------------------
    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const customSelectRef = useRef<HTMLDivElement>(null);
    const nativeSelectRef = useRef<HTMLSelectElement>(null);
    const hasScrolledRef = useRef(false);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

    // -----------------------------
    // 🔑 [ID] 컴포넌트/리스트박스 식별자
    // -----------------------------
    const baseId = id ?? useId();
    const listboxId = `${baseId}-listbox`;

    // -----------------------------
    // 🏁 초기 선택 옵션 계산
    // -----------------------------
    const initialSelectedOption = useMemo(() => {
      if (defaultOptionId) {
        const found = options.find(opt => opt.id === defaultOptionId && !opt.disabled);
        if (found) return found;
      }
      return options.find(opt => opt.selected && !opt.disabled && opt.value !== '') ?? null;
    }, [options, defaultOptionId]);

    const [selectedId, setSelectedId] = useState<string | null>(
      () => initialSelectedOption?.id ?? null,
    );
    const [selectedValue, setSelectedValue] = useState<string>(
      () => initialSelectedOption?.value ?? '',
    );

    // -----------------------------
    // ♿️ [ARIA] 활성 옵션 ID
    // -----------------------------
    const activeDescendantId = focusedIndex !== null ? options[focusedIndex]?.id : undefined;

    const open = () => {
      setIsOpen(true);

      onOpenChange?.(true);
    };

    const close = () => {
      setIsOpen(false);
      setFocusedIndex(null);

      onOpenChange?.(false);
    };

    // ------------------------------------------------------
    // ⚡️ 옵션 선택 처리
    // ------------------------------------------------------
    const handleSelect = useCallback(
      (id: string, value: string) => {
        setSelectedId(id);
        setSelectedValue(value);
        setIsOpen(false);
        setFocusedIndex(null);

        const option = options.find(opt => opt.id === id);
        onValueChange?.(id, option);
      },
      [options, onValueChange],
    );

    // -----------------------------
    // ⚡️ native select 변경 처리
    // -----------------------------
    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
      handleSelect(e.target.id, e.target.value);
    };

    // -----------------------------------------------------
    // 🔁 [Keyboard] 다음/이전 활성 인덱스 계산
    // -----------------------------------------------------
    const findNextEnabled = useCallback(
      (current: number | null, step: 1 | -1) => {
        if (options.length === 0) return null;

        let idx = current === null ? (step === 1 ? 0 : options.length - 1) : current + step;

        while (idx >= 0 && idx < options.length) {
          if (!options[idx].disabled) {
            return idx;
          }
          idx += step;
        }

        return current;
      },
      [options],
    );

    // ------------------------------------------------------
    // ⚡️ OptionList 내부 ESC 처리
    // ------------------------------------------------------
    const handleOptionListEscape = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          e.preventDefault();
          e.stopPropagation();

          close();

          customSelectRef.current?.focus();
        }
      },
      [isOpen, close],
    ); // close와 isOpen에 의존

    // ------------------------------------------------------
    // ⚡️ 키보드 이벤트 처리
    // ------------------------------------------------------
    const lastKeyEventRef = useRef<{ key: string; timestamp: number } | null>(null);

    const handleKeyDown = useCallback(
      <T extends HTMLElement>(e: React.KeyboardEvent<T>) => {
        const now = Date.now();

        // 50ms 이내 동일 키 중복 방지
        if (
          lastKeyEventRef.current &&
          lastKeyEventRef.current.key === e.key &&
          now - lastKeyEventRef.current.timestamp < 50
        ) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        lastKeyEventRef.current = { key: e.key, timestamp: now };

        switch (e.key) {
          case ' ':
          case 'Enter': {
            e.preventDefault();

            if (!isOpen) {
              open();
              return;
            }

            if (focusedIndex !== null) {
              const opt = options[focusedIndex];
              if (!opt.disabled) {
                handleSelect(opt.id, opt.value);
              }
            }
            return;
          }

          case 'ArrowDown':
          case 'ArrowUp': {
            e.preventDefault();

            // 🔓 닫혀 있으면 열기만 (포커스 이동은 다음 tick)
            if (!isOpen) {
              open();
              return;
            }

            const step = e.key === 'ArrowDown' ? 1 : -1;
            let nextIndex: number | null;

            if (focusedIndex === null) {
              if (selectedId) {
                const idx = options.findIndex(opt => opt.id === selectedId && !opt.disabled);
                nextIndex = idx !== -1 ? idx : options.findIndex(opt => !opt.disabled);
              } else {
                nextIndex = options.findIndex(opt => !opt.disabled);
              }
              nextIndex = nextIndex !== -1 ? nextIndex : null;
            } else {
              nextIndex = findNextEnabled(focusedIndex, step);
            }

            setFocusedIndex(nextIndex);
            return;
          }

          // 💡 CalendarSelectbox.tsx (예상되는 handleKeyDown 수정)
          case 'Escape': {
            if (!isOpen) return;
            e.preventDefault(); // 기본 브라우저 동작만 막음 (전파는 막지 않음)
            close(); // setIsOpen(false) 실행
            customSelectRef.current?.focus(); // 포커스 복귀
            return;
          }

          case 'Tab': {
            // Tab 은 기본 동작 허용 + 리스트만 닫기
            if (isOpen) {
              close();
            }
            return;
          }
        }
      },
      [isOpen, focusedIndex, selectedId, options, findNextEnabled, handleSelect],
    );

    useEffect(() => {
      setSelectedId(initialSelectedOption?.id ?? null);
      setSelectedValue(initialSelectedOption?.value ?? '');
    }, [initialSelectedOption]);

    // -----------------------------
    // ✨ [Scroll] 드롭다운 오픈 시 선택된 옵션 자동 스크롤
    // - isOpen 상태에서만 실행
    // - 이미 스크롤 완료된 경우 중복 실행 방지 (hasScrolledRef)
    // - setTimeout 0을 사용해 DOM이 렌더링된 후 scrollIntoView 실행
    // - 키보드 포커스(focusedIndex)와 무관하게 초기 위치 맞춤용
    // -----------------------------
    useEffect(() => {
      if (!isOpen) {
        hasScrolledRef.current = false; // 닫히면 다시 초기화
        return;
      }

      if (hasScrolledRef.current) return; // 이미 스크롤 완료 시 더 이상 실행하지 않음

      const timeout = setTimeout(() => {
        const selectedIdx = options.findIndex(opt => opt.id === selectedId);
        if (selectedIdx === -1) return;

        const selectedEl = optionRefs.current[selectedIdx];
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'nearest' });
          hasScrolledRef.current = true; // 한 번만 실행 표시
        }
      }, 0);

      return () => clearTimeout(timeout);
    }, [isOpen, selectedId, options]);

    // -----------------------------------------------------
    // ✨ [Accessibility] 활성 옵션 스크롤 동기화
    // - aria-activedescendant 기반 포커싱에서는
    //   브라우저가 자동으로 스크롤하지 않으므로
    //   수동으로 scrollIntoView() 호출
    // - 키보드로 포커스 이동 시 화면 밖 옵션을 뷰포트로 이동
    // - block: 'nearest' → 최소한의 스크롤만 발생
    // -----------------------------------------------------
    useLayoutEffect(() => {
      if (!isOpen || !positioned) return;
      if (focusedIndex === null) return;

      const el = optionRefs.current[focusedIndex];
      if (!el) return;

      el.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }, [isOpen, positioned, focusedIndex]);

    // -----------------------------------------------------
    // 🖱️ [Interaction] handleOutsideClick
    // - Combobox 외부 영역 클릭 감지
    // - input 영역(containerRef)과
    //   옵션 리스트 포털(portalRef) 모두 포함하지 않을 경우
    //   → 옵션 리스트 닫기
    // - 포털 구조에서도 정상 동작하도록 ref 기준 검사
    // -----------------------------------------------------
    const handleOutsideClick = useCallback(
      (event: MouseEvent) => {
        const target = event.target as Node | null;

        const isInsideContainer =
          containerRef.current && target && containerRef.current.contains(target);

        const isInsidePortal = portalRef.current && target && portalRef.current.contains(target);

        // 🚨 수정: 외부 클릭 시 close() 함수를 호출하여 중복 로직 제거 및 onOpenChange 보장
        if (!isInsideContainer && !isInsidePortal && isOpen) {
          close();
        }
      },
      [isOpen], // close 함수를 사용하도록 수정했으므로, close의 의존성을 따름
    );

    // -----------------------------------------------------
    // ✨ 외부 클릭 이벤트 등록 / 해제
    // - document 기준 mousedown 이벤트 사용
    // - 컴포넌트 마운트 시 등록
    // - 언마운트 시 이벤트 해제
    // -----------------------------------------------------
    useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [handleOutsideClick]);

    // -----------------------------------------------------
    // 🔧 [Portal] updatePosition
    // - customInputRef 또는 containerRef 기준으로 위치 측정
    // - getBoundingClientRect() + window.scrollY/X → 스크롤 반영
    // - top: 요소 하단 기준, left/width: 요소 좌측 및 너비
    // - 외부 클릭 닫기 등 포털 렌더링 위치 계산에 사용
    // -----------------------------------------------------
    const updatePosition = useCallback(() => {
      const el = customSelectRef.current ?? containerRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      } as PortalPosition;
    }, []);

    // ----------------------------------------------
    // ✨ [Portal] OptionList 위치 초기화
    // - isOpen 상태에 따라 Portal 위치 계산
    // - 열려있으면 동기적으로 위치 계산 후 상태 업데이트
    // - 닫히면 positioned, portalPos 초기화
    // ----------------------------------------------
    useLayoutEffect(() => {
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

    // ---------------------------------------------------------------
    // ✨ [Portal] OptionList 윈도우 리사이즈 / 스크롤 시 Portal 위치 재계산
    // - isOpen 상태에서만 이벤트 리스너 등록
    // - 리사이즈 및 스크롤 이벤트 발생 시 updatePosition 실행
    // - 컴포넌트 언마운트 시 이벤트 제거
    // ---------------------------------------------------------------
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

    // storybook states 스타일 클래스 적용 - 'pseudo-'로 시작하지 않는 것
    const filteredClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => !name.startsWith('pseudo-'))
        .join(' ');
    }, [className]);

    // storybook states 스타일 클래스 적용 - 'pseudo-'로 시작하는 것
    const pseudoClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => name.startsWith('pseudo-')) // ✅ 'pseudo-'로 시작하는 것만 남김
        .join(' ');
    }, [className]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={containerRef}
        id={id}
        className={clsx(
          `${styles['calendar-selectbox']} variant--${variant} color--${color} size--${size}`,
          filteredClassName,
        )}
      >
        {/* native select (보조기기 동기화용) */}
        <select
          ref={nativeSelectRef}
          id={selectId}
          tabIndex={-1}
          required={required}
          disabled={disabled}
          value={selectedValue}
          onChange={handleChange}
          aria-hidden={true}
        >
          {options.map(opt => (
            <option key={opt.id} value={opt.value} disabled={opt.disabled}>
              {opt.value}
            </option>
          ))}
        </select>

        {/* 커스텀 셀렉트 트리거 */}
        <div
          ref={customSelectRef}
          className={clsx('custom-select', pseudoClassName)}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-activedescendant={activeDescendantId}
          role={role}
          aria-controls={isOpen ? listboxId : undefined}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-labelledby={ariaLabelledBy}
          aria-label={ariaLabel}
          onClick={e => {
            if (disabled) return;
            e.stopPropagation(); // document로의 전파만 막습니다.

            if (isOpen) close();
            else open();
          }}
          onKeyDown={handleKeyDown}
        >
          <span id={ariaLabelledBy} className='custom-select-text'>
            {selectedValue === '' ? placeholder : selectedValue}
          </span>
          <IconButton
            as='div'
            color={color}
            size={size}
            variant='ghost'
            shape='rounded'
            className='adorned-end'
            icon={
              <Icon
                name={isOpen ? 'arrow-up' : 'arrow-down'}
                className='icon'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />
        </div>

        {/* OptionList */}
        {isOpen && positioned && portalPos && (
          <OptionListPortal isOpen={isOpen} position={portalPos} portalRef={portalRef}>
            <CalendarOptionList
              id={listboxId}
              variant={variant}
              color={color}
              onKeyDown={handleOptionListEscape}
            >
              {options.map((opt, idx) => (
                <OptionItem
                  ref={el => {
                    optionRefs.current[idx] = el;
                  }}
                  key={opt.id}
                  variant='ghost'
                  color={color}
                  size={size}
                  index={idx}
                  id={opt.id}
                  value={opt.value}
                  placeholder={opt.id === 'placeholder' ? placeholder : undefined}
                  selected={opt.id === selectedId}
                  disabled={opt.disabled}
                  onSelect={handleSelect}
                  isActive={opt.id === activeDescendantId}
                  // onKeyDown={handleKeyDown}
                />
              ))}
            </CalendarOptionList>
          </OptionListPortal>
        )}
      </div>
    );
  },
);

CalendarSelectbox.displayName = 'CalendarSelectbox';

export default CalendarSelectbox;
