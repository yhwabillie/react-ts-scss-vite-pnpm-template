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
import styles from '@/components/ui/molecules/Combobox/Combobox.module.scss';
import type { Size, Variant, Color } from '@/types/design/design-tokens.types';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import Icon from '@/components/ui/atoms/Icon/Icon';
import type { PortalPosition } from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import OptionListPortal from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import OptionList from '@/components/ui/molecules/OptionList/OptionList';
import OptionItem, { type OptionBase } from '@/components/ui/molecules/OptionItem/OptionItem';
import type { ComboboxA11yProps } from '@/types/a11y/a11y-roles.types';
import type { ComboboxInputProps } from '@/types/form-control.types';

interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof ComboboxA11yProps
>;

interface ComboboxProps extends StyleProps, ComboboxA11yProps, NativeDivProps {
  id?: string;
  inputId?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  inputProps?: ComboboxInputProps;
  options: OptionBase[];
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onValueChange?: (value: string, option?: OptionBase) => void;
}

const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      variant,
      color,
      size,
      role,
      'aria-labelledby': ariaLabelledBy,
      id,
      inputId,
      required,
      disabled,
      readOnly,
      className,
      inputProps,
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
    const customInputRef = React.useRef<HTMLDivElement>(null);
    const nativeInputRef = React.useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const openReasonRef = useRef<'input' | 'keyboard' | 'button' | null>(null);

    // -----------------------------
    // 🔑 [ID 관리] Combobox 및 리스트박스 식별자
    // - baseId: 사용자로부터 id가 전달되면 사용, 없으면 useId()로 생성
    // - listboxId: 리스트박스(옵션 컨테이너)의 고유 ID, aria-controls 등에 사용
    // -----------------------------
    const baseId = id ?? useId();
    const listboxId = `${baseId}-listbox`;

    // -----------------------------
    // 🏁 초기 선택값 설정
    // - 최초 마운트 시 options 중
    //   selected: true && disabled 아님 && value가 빈 값이 아닌 옵션을 찾음
    // - 해당 옵션이 있으면 selectedId / inputValue의 초기값으로 사용
    // - 없으면 선택 없음 (selectedId: null, inputValue: '')
    // -----------------------------
    const initialSelectedOption = useMemo(
      () => options.find(opt => opt.selected && !opt.disabled && opt.value !== '') ?? null,
      [options],
    );

    const [selectedId, setSelectedId] = useState<string | null>(initialSelectedOption?.id ?? null);
    const [inputValue, setInputValue] = useState<string>(initialSelectedOption?.value ?? '');

    // -----------------------------
    // 🔎 [옵션 필터링] filteredOptions
    // - inputValue(사용자 입력값)를 기준으로 옵션 필터링
    // - 입력값 없으면 전체 옵션 반환
    // - 대소문자 구분 없이 포함 여부 검사
    // -----------------------------
    const filteredOptions = useMemo(() => {
      if (!inputValue) return options;

      const keyword = inputValue.toLowerCase();

      return options.filter(opt => opt.value.toLowerCase().includes(keyword));
    }, [options, inputValue]);

    // -----------------------------
    // ♿️ [ARIA] 활성 옵션 ID
    // - 키보드 포커스가 있는 옵션의 ID를 aria-activedescendant에 사용
    // - focusedIndex가 null이면 undefined 반환
    // -----------------------------
    const activeDescendantId =
      focusedIndex !== null ? filteredOptions[focusedIndex]?.id : undefined;

    // -----------------------------------------------------
    // ⚡️ [Input] handleInputChange
    // - 사용자가 입력창에 타이핑할 때 호출
    // - 입력값을 내부 상태(inputValue)에 반영
    // - 입력 시 옵션 리스트를 열고(isOpen = true)
    // - 키보드 포커스 인덱스 초기화
    // - 외부에서 전달된 inputProps.onChange가 있다면 함께 호출
    // -----------------------------------------------------
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setInputValue(value);
      setIsOpen(true);

      openReasonRef.current = 'input';

      // 🔥 검색 중에는 포커스 이동 금지
      setFocusedIndex(null);

      inputProps?.onChange?.(e);
    };

    // -----------------------------------------------------
    // ⚡️ [Option] handleSelect
    // - OptionItem 선택 시 호출되는 콜백
    // - 선택된 옵션의 value를 inputValue에 반영
    // - 선택된 옵션의 id를 selectedId로 저장
    // - 옵션 리스트 닫기
    // - 키보드 포커스 인덱스 초기화
    // - 선택된 옵션 정보를 조합하여
    //   외부 onValueChange(value, option)로 전달
    // -----------------------------------------------------
    const handleSelect = useCallback(
      (id: string, value: string) => {
        setSelectedId(id);
        setInputValue(value);
        setIsOpen(false);
        setFocusedIndex(null);

        const option = options.find(opt => opt.id === id);
        onValueChange?.(value, option);
      },
      [options, onValueChange],
    );

    // -----------------------------------------------------
    // 🔁 [Keyboard Utils] 다음/이전 활성 옵션 인덱스 계산
    // - disabled 옵션은 건너뜀
    // - 범위를 벗어나면 기존 인덱스 유지
    // -----------------------------------------------------
    const findNextEnabled = useCallback(
      (current: number | null, step: 1 | -1) => {
        if (filteredOptions.length === 0) return null;

        let idx = current === null ? (step === 1 ? 0 : filteredOptions.length - 1) : current + step;

        while (idx >= 0 && idx < filteredOptions.length) {
          if (!filteredOptions[idx].disabled) {
            return idx;
          }
          idx += step;
        }

        return current;
      },
      [filteredOptions],
    );

    // -----------------------------------------------------
    // ⌨️ [Keyboard] handleKeyDown
    // - Combobox 키보드 인터랙션 처리 (웹 접근성 준수)
    // - ArrowDown / ArrowUp : 옵션 포커스 이동
    // - Enter : 포커스된 옵션 선택
    // - Escape : 옵션 리스트 닫기
    // - Tab : 기본 포커스 이동 허용 (리스트 닫기만 처리)
    // - aria-activedescendant 패턴 사용
    // - 최초 진입 시 포커스가 없다면
    //   → 선택된 옵션 또는 첫 번째 옵션부터 포커싱
    // -----------------------------------------------------
    const lastKeyEventRef = useRef<{ key: string; timestamp: number } | null>(null);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const now = Date.now();

        // 50ms 이내에 같은 키 이벤트가 발생하면 무시 (중복 이벤트 방지)
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
          case 'ArrowDown':
          case 'ArrowUp': {
            e.preventDefault();

            // 닫혀있으면 열기만
            if (!isOpen) {
              setIsOpen(true);
              openReasonRef.current = 'keyboard';
              return;
            }

            // 열려있으면 포커스 이동
            const step = e.key === 'ArrowDown' ? 1 : -1;
            let nextIndex: number | null;

            if (focusedIndex === null) {
              // 초기 진입: 선택된 옵션 또는 첫 번째 활성 옵션으로
              if (selectedId) {
                const idx = filteredOptions.findIndex(
                  opt => opt.id === selectedId && !opt.disabled,
                );
                nextIndex = idx !== -1 ? idx : filteredOptions.findIndex(opt => !opt.disabled);
              } else {
                nextIndex = filteredOptions.findIndex(opt => !opt.disabled);
              }
              nextIndex = nextIndex !== -1 ? nextIndex : null;
            } else {
              // 이미 포커스가 있으면 다음/이전으로 이동
              nextIndex = findNextEnabled(focusedIndex, step);
            }

            setFocusedIndex(nextIndex);
            return;
          }

          case 'Enter': {
            if (!isOpen || focusedIndex === null) return;
            e.preventDefault();

            const opt = filteredOptions[focusedIndex];
            if (!opt.disabled) {
              handleSelect(opt.id, opt.value);
            }
            return;
          }

          case 'Escape': {
            if (!isOpen) return;
            e.preventDefault();
            setIsOpen(false);
            setFocusedIndex(null);
            return;
          }

          case 'Tab': {
            // Tab 키는 기본 동작 허용, 리스트만 닫기
            if (isOpen) {
              setIsOpen(false);
              setFocusedIndex(null);
            }
            return;
          }
        }
      },
      [isOpen, focusedIndex, selectedId, filteredOptions, findNextEnabled, handleSelect],
    );

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

      if (!isInsideContainer && !isInsidePortal) {
        setIsOpen(false);
        setFocusedIndex(null);
      }
    }, []);

    // -----------------------------------------------------
    // ✨ [Focus Sync] 활성 옵션 스크롤 동기화
    // - 키보드 이동(ArrowUp / ArrowDown)으로 focusedIndex 변경 시
    //   실제 DOM 옵션이 화면 밖에 있으면 자동으로 스크롤 이동
    // - aria-activedescendant 기반 포커싱에서는
    //   브라우저가 스크롤을 자동 처리하지 않기 때문에
    //   scrollIntoView()를 수동으로 호출해야 함
    // - block: 'nearest'
    //   → 최소한의 스크롤만 발생시켜 UX 튀는 현상 방지
    // -----------------------------------------------------
    useLayoutEffect(() => {
      if (!isOpen || !positioned) return;
      if (focusedIndex === null) return;

      const el = optionRefs.current[focusedIndex];
      if (!el) return;

      el.scrollIntoView({
        block: 'nearest',
      });
    }, [isOpen, positioned, focusedIndex]);

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
      const el = customInputRef.current ?? containerRef.current;
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

    // -----------------------------------------------------
    // 🔊 [Accessibility] 스크린리더 검색 결과 안내
    // - 검색어 입력 시 필터링된 옵션 수를 안내
    // - 검색 중 연속 입력 시 안내가 너무 자주 발생하지 않도록 debounce 적용 (300ms)
    // - 이전 안내와 동일하면 중복 안내 방지
    // - 검색 결과가 없으면 중요 메시지(assertive)로 안내
    // - 검색 결과가 1개 이상이면 일반 안내(polite)로 안내
    // - live region 갱신 시 기존 메시지를 초기화 후 requestAnimationFrame으로 새 메시지 설정하여
    //   스크린리더가 변경을 감지하도록 보장
    // - 검색어가 비어있으면 안내하지 않음 (초기 상태)
    // -----------------------------------------------------
    const prevAnnounceRef = useRef<string>('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [announceMsg, setAnnounceMsg] = useState('');
    const [announceRole, setAnnounceRole] = useState<'assertive' | 'polite'>('polite');

    useEffect(() => {
      // 이전 타이머 취소
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // 검색어 없으면 안내 초기화
      if (!inputValue.trim()) {
        setAnnounceMsg('');
        prevAnnounceRef.current = '';
        return;
      }

      // debounce: 300ms
      typingTimeoutRef.current = setTimeout(() => {
        let newMsg = '';
        let liveType: 'assertive' | 'polite' = 'polite';

        if (filteredOptions.length === 0) {
          newMsg = '검색 결과가 없습니다.';
          liveType = 'assertive'; // 결과 없음은 중요 메시지
        } else if (filteredOptions.length === 1) {
          newMsg = '1개의 검색 결과가 있습니다.';
        } else {
          newMsg = `${filteredOptions.length}개의 검색 결과가 있습니다.`;
        }

        // 이전 메시지와 같으면 업데이트하지 않음 (중복 방지)
        if (prevAnnounceRef.current !== newMsg) {
          prevAnnounceRef.current = newMsg;

          // live region 갱신
          setAnnounceRole(liveType);

          // DOM 업데이트 보장: 기존 메시지 초기화 후 다음 렌더에서 새 메시지 설정
          setAnnounceMsg('');
          requestAnimationFrame(() => {
            setAnnounceMsg(newMsg);
          });
        }
      }, 300);

      return () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }, [inputValue, filteredOptions.length]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['combobox']} variant--${variant} color--${color} size--${size}`,
          className,
        )}
      >
        <div ref={customInputRef} className='custom-input'>
          <input
            ref={nativeInputRef}
            id={inputId}
            type='text'
            className='custom-input-text'
            {...inputProps}
            role={role}
            aria-activedescendant={activeDescendantId}
            aria-controls={listboxId}
            aria-haspopup='listbox'
            aria-labelledby={ariaLabelledBy}
            aria-autocomplete='list'
            aria-expanded={isOpen}
            required={required}
            readOnly={readOnly}
            disabled={disabled}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <IconButton
            color={color}
            size={size}
            variant='ghost'
            shape='rounded'
            className='adorned-end'
            type='button'
            aria-label={isOpen ? '옵션 닫기' : '옵션 열기'}
            disabled={disabled}
            icon={
              <Icon
                name={isOpen ? 'arrow-up' : 'arrow-down'}
                className='icon'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
            onClick={() => {
              setIsOpen(prev => !prev);
            }}
          />
        </div>

        {/* OptionList */}
        {isOpen && positioned && portalPos && (
          <OptionListPortal isOpen={isOpen} position={portalPos} portalRef={portalRef}>
            <OptionList id={listboxId} variant={variant} color={color} size={size}>
              {filteredOptions.map((opt, idx) => (
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
                  placeholder={inputProps?.placeholder}
                  selected={opt.id === selectedId}
                  disabled={opt.disabled}
                  onSelect={handleSelect}
                  isActive={opt.id === activeDescendantId}
                />
              ))}

              {filteredOptions.length === 0 && (
                <li key='empty-state' className='empty-state' role='option' aria-disabled='true'>
                  <Icon
                    name='search-x'
                    className='icon'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <span className='title'>검색 결과가 없습니다.</span>
                  <span className='desc'>다른 키워드로 다시 검색해 보세요.</span>
                </li>
              )}
            </OptionList>

            {/* 스크린리더 전용 안내 */}
            <div
              className='sr-only'
              role={announceRole}
              aria-live={announceRole}
              aria-atomic='true'
            >
              {announceMsg || '\u00A0'}
            </div>
          </OptionListPortal>
        )}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';

export default Combobox;
