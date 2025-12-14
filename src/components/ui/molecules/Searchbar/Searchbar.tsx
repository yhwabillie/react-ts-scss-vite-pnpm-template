import React, { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from '@/components/ui/molecules/Searchbar/Searchbar.module.scss';
import clsx from 'clsx';
import type { Size, Variant, Color, Shape } from '@/types/design/design-tokens.types';
import type { InputA11yProps } from '@/types/a11y/a11y-roles.types';
import Icon from '../../atoms/Icon/Icon';
import IconButton from '../IconButton/IconButton';
import type { PortalPosition } from '../OptionListPortal/OptionListPortal';
import OptionListPortal from '../OptionListPortal/OptionListPortal';
import OptionList from '../OptionList/OptionList';
import OptionItem, { type OptionBase } from '../OptionItem/OptionItem';

interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
  shape: Shape;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof InputA11yProps | 'onChange'
>;

type SearchbarActionType = 'submit' | 'clear' | 'toggle';

type OptionType = Omit<OptionBase, 'disabled' | 'selected' | 'label'>;

interface SearchbarAction {
  type: SearchbarActionType;
  icon: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface SearchbarProps extends StyleProps, InputA11yProps, NativeDivProps {
  id?: string;
  inputId?: string;
  name?: string;
  labelText?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  options?: OptionType[];
  onChange?: (value: string) => void;
  debounceMs?: number; // ✅ debounce 시간 설정 가능
  actions?: {
    submitAction?: SearchbarAction;
    utilityAction?: SearchbarAction;
  };
}

const defaultAriaLabel: Record<SearchbarActionType, string> = {
  submit: '검색',
  clear: '검색어 지우기',
  toggle: '검색 옵션 열기',
};

// ✅ OptionItem 메모이제이션
const MemoizedOptionItem = React.memo(OptionItem);

const Searchbar = forwardRef<HTMLDivElement, SearchbarProps>(
  (
    {
      variant,
      color,
      size,
      shape,
      id,
      inputId,
      placeholder,
      value,
      onChange,
      disabled,
      name,
      role,
      labelText,
      actions,
      debounceMs = 300, // ✅ 기본 300ms
      options,
    },
    ref,
  ) => {
    // -----------------------------
    // 📌 상태 선언
    // -----------------------------
    // ✅ 내부 state로 즉각 반응
    const [internalValue, setInternalValue] = useState(value ?? '');
    const [isOpen, setIsOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);
    const [announceMsg, setAnnounceMsg] = useState('');
    const [announceRole, setAnnounceRole] = useState<'assertive' | 'polite'>('polite');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // -----------------------------
    // 🧩 Ref 선언
    // -----------------------------
    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const customInputRef = React.useRef<HTMLDivElement>(null);
    const nativeInputRef = React.useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const openReasonRef = useRef<'input' | 'keyboard' | 'button' | null>(null);
    const isTypingRef = useRef(false);
    // 포커스 이벤트에서 무시 여부를 체크할 ref
    const ignoreNextFocusRef = useRef(false);

    // ✅ Debounce 타이머 ref
    const debouncedOnChangeRef = useRef<NodeJS.Timeout | undefined>(undefined);
    // ✅ 올바른 방법
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // -----------------------------
    // 🔑 ID 관리
    // -----------------------------
    const baseId = id ?? useId();
    const listboxId = `${baseId}-listbox`;

    // input 값 기준으로 options 필터링
    const filteredOptions =
      options?.filter(opt => opt.value.toLowerCase().includes(internalValue.toLowerCase())) ?? [];

    // ✅ 외부 value prop이 변경되면 내부 state 동기화
    useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(value);
      }
    }, [value]);

    // ✅ 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
      return () => {
        if (debouncedOnChangeRef.current) {
          clearTimeout(debouncedOnChangeRef.current);
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

    const openList = useCallback((reason?: 'input' | 'keyboard' | 'button') => {
      openReasonRef.current = reason ?? null;
      setIsOpen(true);
    }, []);

    const closeList = useCallback((restoreFocus = false) => {
      setIsOpen(false);
      setActiveIndex(null); // activedescendant 초기화

      if (restoreFocus) {
        ignoreNextFocusRef.current = true;
        requestAnimationFrame(() => {
          nativeInputRef.current?.focus();
        });
      }
    }, []);

    // ✅ 최적화된 input change 핸들러
    const handleInputChange = useCallback(
      (newValue: string) => {
        setInternalValue(newValue);
        isTypingRef.current = true;

        // 타이핑 상태 리셋 타이머
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          isTypingRef.current = false;
        }, 150);

        // 부모 onChange는 debounce 처리
        if (debouncedOnChangeRef.current) {
          clearTimeout(debouncedOnChangeRef.current);
        }
        debouncedOnChangeRef.current = setTimeout(() => {
          onChange?.(newValue);
        }, debounceMs);

        // ✅ 입력값이 있을 때만 OptionList 열기
        if (newValue !== '') {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      },
      [onChange, debounceMs],
    );

    // ✅ 옵션 클릭 핸들러 수정
    const handleOptionClick = useCallback(
      (optionValue: string) => {
        setInternalValue(optionValue);

        // debounce 타이머 취소 후 즉시 onChange 호출
        if (debouncedOnChangeRef.current) {
          clearTimeout(debouncedOnChangeRef.current);
        }
        onChange?.(optionValue);

        closeList(true); // 포커스 복원
      },
      [onChange, closeList],
    );

    const handleUtilityClick = useCallback(() => {
      if (actions?.utilityAction?.type === 'clear') {
        const newValue = '';
        setInternalValue(newValue);

        // debounce 타이머 취소 후 즉시 onChange 호출
        if (debouncedOnChangeRef.current) {
          clearTimeout(debouncedOnChangeRef.current);
        }
        onChange?.(newValue);

        // ✅ closeList() 호출 (포커스 복원 없이)
        closeList(false); // restoreFocus = false

        // ✅ 수동으로 포커스 복원하되, ignoreNextFocusRef 설정
        ignoreNextFocusRef.current = true;
        requestAnimationFrame(() => {
          nativeInputRef.current?.focus();
        });
      }

      actions?.utilityAction?.onClick?.();
    }, [actions, onChange, closeList]);

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // ✅ IME 조합 중이면 이벤트 무시
        if (e.nativeEvent.isComposing) {
          return;
        }

        if (!isOpen) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openList('keyboard');

            // ✅ 리스트만 열고 activeIndex는 null 유지 (aria-activedescendant 없음)
            // ArrowDown을 다시 누르면 그때 0번부터 시작
          }
          return;
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex(prev => {
              // ✅ null이면 0부터 시작
              if (prev === null) return 0;
              // ✅ 마지막 옵션에서 더 이상 내려가지 않음
              if (prev === filteredOptions.length - 1) return prev;
              return prev + 1;
            });
            break;

          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex(prev => {
              // ✅ null이면 0부터 시작
              if (prev === null) return 0;
              // ✅ 첫 번째 옵션에서 더 이상 올라가지 않음
              if (prev === 0) return 0;
              return prev - 1;
            });
            break;

          case 'Enter':
            if (activeIndex !== null) {
              handleInputChange(filteredOptions[activeIndex].value);
              closeList(true);
            }
            break;

          case 'Escape':
            e.preventDefault();
            closeList(true);
            break;
        }
      },
      [isOpen, filteredOptions, handleInputChange, closeList, openList],
    );

    const activeDescendantId =
      activeIndex !== null && filteredOptions[activeIndex]
        ? filteredOptions[activeIndex].id
        : undefined;

    // ✅ 최적화된 Portal 위치 계산
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
        // setFocusedIndex(null);
      }
    }, []);

    const handleInputFocus = useCallback(() => {
      if (ignoreNextFocusRef.current) {
        ignoreNextFocusRef.current = false;
        return;
      }

      setActiveIndex(null); // ✅ 포커스 시 activeIndex 리셋
      openList('keyboard'); // 포커스만으로 리스트 열기
    }, [openList]);

    // ✅ 외부 클릭 이벤트 등록
    useEffect(() => {
      if (!isOpen) return;

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [isOpen, handleOutsideClick]);

    // ✅ Portal 위치 초기화
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

    // ✅ Portal 위치 업데이트 (리사이즈/스크롤)
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

    // ✅ internalValue가 변경되면 무조건 activeIndex 리셋
    useEffect(() => {
      setActiveIndex(null);
    }, [internalValue]);

    // ✅ activeIndex 변경 시 해당 옵션으로 스크롤
    useEffect(() => {
      if (activeIndex !== null && optionRefs.current[activeIndex]) {
        optionRefs.current[activeIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // 필요한 만큼만 스크롤 (이미 보이면 스크롤 안함)
        });
      }
    }, [activeIndex]);

    return (
      <div
        ref={ref}
        className={clsx(`${styles['searchbar']} variant--${variant} color--${color} size--${size}`)}
      >
        <label htmlFor={inputId} className='sr-only'>
          {labelText}
        </label>
        <div ref={customInputRef} className='custom-input'>
          <input
            ref={nativeInputRef}
            id={inputId}
            type='search'
            name={name}
            role={role}
            value={internalValue} // ✅ 내부 state 사용
            onChange={e => handleInputChange(e.target.value)} // ✅ 최적화된 핸들러
            placeholder={placeholder}
            aria-autocomplete='list'
            aria-haspopup='listbox'
            aria-controls={listboxId}
            aria-expanded={isOpen}
            aria-activedescendant={activeDescendantId}
            disabled={disabled}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
          />
          {actions?.utilityAction && internalValue !== '' && (
            <IconButton
              variant='ghost'
              color={color}
              size={size}
              shape={shape}
              className={clsx('adorned-end', 'delete-btn')}
              type='button'
              aria-label={
                actions.utilityAction.ariaLabel ?? defaultAriaLabel[actions.utilityAction.type]
              }
              disabled={actions.utilityAction.disabled}
              onClick={handleUtilityClick}
              icon={actions.utilityAction.icon}
            />
          )}
        </div>
        {actions?.submitAction && (
          <IconButton
            variant='ghost'
            color={color}
            size={size}
            shape={shape}
            className={clsx('adorned-end', 'submit-btn')}
            type='submit'
            aria-label={
              actions.submitAction.ariaLabel ?? defaultAriaLabel[actions.submitAction.type]
            }
            disabled={actions.submitAction.disabled}
            onClick={actions.submitAction.onClick}
            icon={actions.submitAction.icon}
          />
        )}

        {/* ✅ 최적화된 OptionList 렌더링 */}
        {isOpen && (
          <OptionListPortal
            isOpen={isOpen}
            position={portalPos || { top: 0, left: 0, width: 0 }}
            portalRef={portalRef}
          >
            {positioned && (
              <>
                <OptionList id={listboxId} variant={variant} color={color} size={size}>
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt, idx) => (
                      <MemoizedOptionItem
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
                        className={clsx({ 'is-active': idx === activeIndex })}
                        onSelect={(id, value) => handleOptionClick(value)}
                      />
                    ))
                  ) : (
                    <li
                      key='empty-state'
                      className='empty-state'
                      role='option'
                      aria-disabled='true'
                    >
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

                <div
                  className='sr-only'
                  role={announceRole}
                  aria-live={announceRole}
                  aria-atomic='true'
                >
                  {announceMsg || '\u00A0'}
                </div>
              </>
            )}
          </OptionListPortal>
        )}
      </div>
    );
  },
);

Searchbar.displayName = 'Searchbar';

export default Searchbar;
