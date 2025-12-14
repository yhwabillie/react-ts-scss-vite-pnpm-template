import React, {
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
import styles from '@/components/ui/molecules/Selectbox/Selectbox.module.scss';
import type { Size, Variant, Color } from '@/types/design/design-tokens.types';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import Icon from '@/components/ui/atoms/Icon/Icon';
import type { PortalPosition } from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import OptionListPortal from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import OptionList from '@/components/ui/molecules/OptionList/OptionList';
import OptionItem, { type OptionBase } from '@/components/ui/molecules/OptionItem/OptionItem';
import type { SelectboxA11yProps } from '@/types/a11y/a11y-roles.types';

interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof SelectboxA11yProps
>;

interface SelectboxProps extends StyleProps, SelectboxA11yProps, NativeDivProps {
  id?: string;
  selectId?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options: OptionBase[];
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onValueChange?: (value: string, option?: OptionBase) => void;
}

const Selectbox = forwardRef<HTMLDivElement, SelectboxProps>(
  (
    {
      variant,
      color,
      size,
      role,
      'aria-labelledby': ariaLabelledBy,
      id,
      selectId,
      required,
      disabled,
      className,
      placeholder,
      options,
      onValueChange,
    },
    ref,
  ) => {
    // -----------------------------
    // 📌 상태 선언
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // -----------------------------
    // 🧩 Ref 선언
    // -----------------------------
    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const customSelectRef = React.useRef<HTMLDivElement>(null);
    const nativeSelectRef = React.useRef<HTMLSelectElement>(null);
    const hasScrolledRef = useRef(false);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const openReasonRef = useRef<'click' | 'keyboard' | null>(null);

    // -----------------------------
    // 🔑 [ID 관리] Combobox 및 리스트박스 식별자
    // - baseId: 사용자로부터 id가 전달되면 사용, 없으면 useId()로 생성
    // - listboxId: 리스트박스(옵션 컨테이너)의 고유 ID, aria-controls 등에 사용
    // -----------------------------
    const baseId = id ?? useId();
    const listboxId = `${baseId}-listbox`;

    // -----------------------------
    // 🏁 [초기 선택 옵션 계산]
    // - 최초 마운트 시 options 중
    //   selected: true && disabled 아님 && value가 빈 값이 아닌 옵션을 탐색
    // - 조건을 만족하는 첫 번째 옵션을 초기 선택값으로 사용
    // - 없으면 초기 선택 없음 (null / '')
    // -----------------------------
    const initialSelectedOption = useMemo(
      () => options.find(opt => opt.selected && !opt.disabled && opt.value !== '') ?? null,
      [options],
    );

    const [selectedId, setSelectedId] = useState<string | null>(
      () => initialSelectedOption?.id ?? null,
    );
    const [selectedValue, setSelectedValue] = useState<string>(
      () => initialSelectedOption?.value ?? '',
    );

    // -----------------------------
    // ♿️ [ARIA] 활성 옵션 ID
    // - 키보드 포커스가 있는 옵션의 ID를 aria-activedescendant에 사용
    // - focusedIndex가 null이면 undefined 반환
    // -----------------------------
    const activeDescendantId = focusedIndex !== null ? options[focusedIndex]?.id : undefined;

    const open = (reason: 'click' | 'keyboard') => {
      openReasonRef.current = reason;
      setIsOpen(true);
    };

    const close = () => {
      openReasonRef.current = null;
      setIsOpen(false);
      setFocusedIndex(null);
    };

    // ------------------------------------------------------
    // ⚡️ handleSelect
    // - 옵션 선택 시 실행되는 이벤트 핸들러
    // - selectedId, selectedValue 상태 업데이트
    // - onValueChange 콜백 실행
    // - 드롭다운 메뉴 닫기(isOpen = false)
    // - 선택 후 포커스(focusedIndex) 초기화
    // ------------------------------------------------------
    const handleSelect = useCallback(
      (id: string, value: string) => {
        setSelectedId(id);
        setSelectedValue(value);
        setIsOpen(false);
        setFocusedIndex(null);

        const option = options.find(opt => opt.id === id);
        onValueChange?.(value, option);
      },
      [options, onValueChange],
    );

    // -----------------------------
    // ⚡️ handleChange
    // - Select 요소 변경 이벤트 핸들러
    // - 사용자가 옵션 선택 시 handleSelect 호출 (id, value 전달)
    // -----------------------------
    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
      handleSelect(e.target.id, e.target.value);
    };

    // -----------------------------------------------------
    // 🔁 [Keyboard Utils] 다음/이전 활성 옵션 인덱스 계산
    // - disabled 옵션은 건너뜀
    // - 범위를 벗어나면 기존 인덱스 유지
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
    // ⚡️ handleKeyDown
    // - custom-select 드롭다운 키보드 이벤트 핸들러
    // - 드롭다운이 닫혀 있을 때:
    //   • Enter / Space → 드롭다운 열기, 선택된 옵션 또는 첫 활성 옵션 포커스
    // - 드롭다운이 열려 있을 때 키 처리:
    //   • Escape → 메뉴 닫기, 포커스 초기화, custom-select로 포커스 이동
    //   • ArrowDown → 다음 활성 옵션으로 포커스 이동
    //   • ArrowUp → 이전 활성 옵션으로 포커스 이동
    //   • Enter / Space → 현재 포커스 옵션 선택, 메뉴 닫기, custom-select로 포커스 이동
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

            // 🔓 닫혀 있으면 키보드로 열기
            if (!isOpen) {
              open('keyboard');
              return;
            }

            // 🔒 열려 있고 포커스된 옵션이 있으면 선택
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
              open('keyboard');
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

          case 'Escape': {
            if (!isOpen) return;
            e.preventDefault();
            close();
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
    const handleOutsideClick = useCallback((event: MouseEvent) => {
      const target = event.target as Node | null;

      const isInsideContainer =
        containerRef.current && target && containerRef.current.contains(target);

      const isInsidePortal = portalRef.current && target && portalRef.current.contains(target);

      if (isInsideContainer || isInsidePortal) return;

      // ⭐ 핵심: 클릭으로 막 연 경우 무시
      if (openReasonRef.current === 'click') {
        openReasonRef.current = null;
        return;
      }

      close();
    }, []);

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

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={ref}
        id={id}
        className={clsx(
          `${styles['selectbox']} variant--${variant} color--${color} size--${size}`,
          className,
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
          className='custom-select'
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-activedescendant={activeDescendantId}
          role={role}
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-labelledby={ariaLabelledBy}
          onClick={e => {
            if (disabled) return;

            // 이미 열려있으면 닫기
            if (isOpen) {
              close();
              return;
            }

            open('click');
          }}
          onKeyDown={handleKeyDown}
        >
          <span className='custom-select-text'>
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
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />
        </div>

        {/* OptionList */}
        {isOpen && positioned && portalPos && (
          <OptionListPortal isOpen={isOpen} position={portalPos} portalRef={portalRef}>
            <OptionList id={listboxId} variant={variant} color={color} size={size}>
              {options.map((opt, idx) => (
                <OptionItem
                  ref={el => {
                    optionRefs.current[idx] = el;
                  }}
                  key={opt.id}
                  variant={variant}
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
                  onKeyDown={handleKeyDown}
                />
              ))}
            </OptionList>
          </OptionListPortal>
        )}
      </div>
    );
  },
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;
