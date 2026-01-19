import { forwardRef, useCallback, useEffect, useId, useRef, useState, memo } from 'react';
import styles from '@/components/ui/molecules/Searchbar/Searchbar.module.scss';
import clsx from 'clsx';
import type { Size, Variant, Color, Shape } from '@/types/design/design-tokens.types';
import type { InputA11yProps } from '@/types/a11y/a11y-roles.types';
import Icon from '../../atoms/Icon/Icon';
import IconButton from '../IconButton/IconButton';
import type { PortalPosition } from '../OptionListPortal/OptionListPortal';
import OptionListPortal from '../OptionListPortal/OptionListPortal';
import OptionList from '../OptionList/OptionList';
import { type OptionBase } from '../OptionItem/OptionItem';
import SearchOptionItem from './SearchOptionItem';

interface StyleProps {
  variant: 'solid' | 'outline';
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: Size;
  shape?: Shape;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof InputA11yProps | 'onChange'
>;

type SearchbarActionType = 'submit' | 'clear' | 'toggle';

type OptionType = Omit<OptionBase, 'disabled' | 'selected' | 'label'> & {
  href?: string; // 이동할 주소
  target?: string; // _blank 등
};

interface SearchbarAction {
  type: SearchbarActionType;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
}

export interface SearchbarProps extends StyleProps, NativeDivProps {
  id?: string;
  inputProps?: InputA11yProps & {
    inputId?: string;
    labelText?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
  };
  buttonProps?: {
    variant: 'ghost' | 'solid';
  };
  options?: OptionType[];
  debounceMs?: number;
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

// -----------------------------------------------------
// 🎯 [Performance] SearchOptionItem 메모이제이션
// -----------------------------------------------------
const MemoizedOptionItem = memo(SearchOptionItem);

const Searchbar = forwardRef<HTMLDivElement, SearchbarProps>(
  (
    {
      variant,
      color = 'primary',
      size = 'md',
      shape = 'rounded',
      id,
      inputProps = {},
      actions,
      debounceMs = 300,
      buttonProps = {
        variant: 'ghost',
      },
      options,
      ...rest
    },
    ref,
  ) => {
    const { inputId, labelText, role, placeholder, disabled, value, onChange } = inputProps;

    // -----------------------------
    // 📌 상태
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [internalValue, setInternalValue] = useState(value ?? '');
    const [filterKeyword, setFilterKeyword] = useState(value ?? '');
    // -----------------------------
    // 🧩 Ref
    // -----------------------------
    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const customInputRef = useRef<HTMLDivElement>(null);
    const nativeInputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const ignoreNextFocusRef = useRef(false);
    const debouncedOnChangeRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // -----------------------------
    // 🔑 ID 관리
    // -----------------------------
    const baseId = id ?? useId();
    const listboxId = `${baseId}-listbox`;

    // -----------------------------------------------------
    // 🔍 [Filter] filterKeyword 기준 옵션 필터링
    // -----------------------------------------------------
    const filteredOptions =
      options?.filter(opt => opt.value.toLowerCase().includes(filterKeyword.toLowerCase())) ?? [];

    // -----------------------------------------------------
    // ✨ [Sync] 외부 value 동기화
    // -----------------------------------------------------
    useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(value);
      }
    }, [value]);

    // -----------------------------------------------------
    // 🧹 [Cleanup] 타이머 정리
    // -----------------------------------------------------
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

    // -----------------------------------------------------
    // 📂 [Interaction] 옵션 리스트 열기
    // -----------------------------------------------------
    const openList = useCallback(() => {
      setIsOpen(true);
    }, []);

    // -----------------------------------------------------
    // 📁 [Interaction] 옵션 리스트 닫기
    // -----------------------------------------------------
    const closeList = useCallback((restoreFocus = false) => {
      setIsOpen(false);
      setActiveIndex(null);

      if (restoreFocus) {
        ignoreNextFocusRef.current = true;
        requestAnimationFrame(() => {
          nativeInputRef.current?.focus();
        });
      }
    }, []);

    // -----------------------------------------------------
    // ⌨️ [Input] 입력 변경
    // - 입력값 반영 + debounce onChange
    // -----------------------------------------------------
    const handleInputChange = useCallback(
      (newValue: string) => {
        setInternalValue(newValue);
        setFilterKeyword(newValue);

        if (debouncedOnChangeRef.current) {
          clearTimeout(debouncedOnChangeRef.current);
        }
        debouncedOnChangeRef.current = setTimeout(() => {
          onChange?.(newValue);
        }, debounceMs);

        setIsOpen(newValue !== '');
      },
      [onChange, debounceMs],
    );

    // -----------------------------------------------------
    // 🖱️ [Selection] 옵션 클릭
    // -----------------------------------------------------
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

    // -----------------------------------------------------
    // 🔘 [Action] Utility 버튼 클릭
    // -----------------------------------------------------
    const handleUtilityClick = useCallback(
      (e?: React.MouseEvent) => {
        e?.preventDefault();

        if (actions?.utilityAction?.type === 'clear') {
          const newValue = '';

          // 입력값 + 필터 키워드 초기화
          setInternalValue(newValue);
          setFilterKeyword(newValue);

          if (debouncedOnChangeRef.current) {
            clearTimeout(debouncedOnChangeRef.current);
          }
          onChange?.(newValue);

          ignoreNextFocusRef.current = true;
          window.requestAnimationFrame(() => {
            if (nativeInputRef.current) {
              nativeInputRef.current.focus();
            }
          });
        }

        actions?.utilityAction?.onClick?.();
      },
      [actions, onChange, closeList],
    );

    // -----------------------------------------------------
    // ⌨️ [Keyboard] Input 키보드
    // -----------------------------------------------------
    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) return;

        // ESC: 초기화 및 닫기
        if (e.key === 'Escape') {
          e.preventDefault();
          setInternalValue('');
          setFilterKeyword('');
          onChange?.('');
          closeList(true);
          return;
        }

        // ArrowDown: 리스트 진입
        if (e.key === 'ArrowDown') {
          if (!isOpen) {
            e.preventDefault();
            openList();
          } else if (filteredOptions.length > 0) {
            e.preventDefault();

            beforeNavigationValueRef.current = internalValue;

            const firstOption = filteredOptions[0];
            setInternalValue(firstOption.value);

            requestAnimationFrame(() => {
              optionRefs.current[0]?.querySelector('a')?.focus();
            });
          }
        }

        // Enter: 리스트가 닫혀있을 때 제출 동작
        if (e.key === 'Enter' && !isOpen) {
          closeList(true);
        }
      },
      [isOpen, filteredOptions, internalValue, onChange, openList, closeList],
    );

    const beforeNavigationValueRef = useRef('');

    const handleOptionKeyDown = useCallback(
      (e: React.KeyboardEvent, index: number) => {
        const lastIndex = filteredOptions.length - 1;

        const moveFocusAndSync = (nextIdx: number) => {
          const nextVal = filteredOptions[nextIdx].value;
          setInternalValue(nextVal);
          requestAnimationFrame(() => {
            optionRefs.current[nextIdx]?.querySelector('a')?.focus();
          });
        };

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (index < lastIndex) moveFocusAndSync(index + 1);
            break;

          case 'ArrowUp':
            e.preventDefault();
            if (index === 0) {
              setInternalValue(beforeNavigationValueRef.current);
              setFilterKeyword(beforeNavigationValueRef.current);
              nativeInputRef.current?.focus();
            } else {
              moveFocusAndSync(index - 1);
            }
            break;

          case 'Escape':
            e.preventDefault();
            setInternalValue(beforeNavigationValueRef.current);
            setFilterKeyword(beforeNavigationValueRef.current);
            closeList(true);
            break;

          case 'Enter':
            setFilterKeyword(internalValue);
            if (debouncedOnChangeRef.current) clearTimeout(debouncedOnChangeRef.current);
            onChange?.(internalValue);

            requestAnimationFrame(() => {
              setIsOpen(false);
            });
            break;
        }
      },
      [filteredOptions, internalValue, onChange, closeList],
    );

    // -----------------------------------------------------
    // ♿️ [ARIA] 활성 옵션 ID
    // -----------------------------------------------------
    const activeDescendantId =
      activeIndex !== null && filteredOptions[activeIndex]
        ? filteredOptions[activeIndex].id
        : undefined;

    // -----------------------------------------------------
    // 🔧 [Portal] 위치 계산
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
    // -----------------------------------------------------
    const handleOutsideClick = useCallback((event: MouseEvent) => {
      const target = event.target as Node | null;

      const isInsideContainer =
        containerRef.current && target && containerRef.current.contains(target);

      const isInsidePortal = portalRef.current && target && portalRef.current.contains(target);

      if (!isInsideContainer && !isInsidePortal) {
        setIsOpen(false);
      }
    }, []);

    // -----------------------------------------------------
    // 🎯 [Focus] Input 포커스 처리
    // -----------------------------------------------------
    const handleInputFocus = useCallback(() => {
      if (ignoreNextFocusRef.current) {
        ignoreNextFocusRef.current = false;
        return;
      }

      setActiveIndex(null);
      openList();
    }, [openList]);

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
    // ✨ [Effect] 입력값 변경 시 activeIndex 리셋
    // -----------------------------------------------------
    useEffect(() => {
      setActiveIndex(null);
    }, [internalValue]);

    // -----------------------------------------------------
    // ✨ [A11y] 활성 옵션 스크롤 동기화
    // -----------------------------------------------------
    useEffect(() => {
      if (activeIndex !== null && optionRefs.current[activeIndex]) {
        optionRefs.current[activeIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, [activeIndex]);

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

    // -----------------------------------------------------
    // 🔊 [A11y] 검색 결과 안내 (debounce + 중복 방지)
    // -----------------------------------------------------
    const prevAnnounceRef = useRef<string>('');
    const [announceMsg, setAnnounceMsg] = useState('');
    const [announceRole, setAnnounceRole] = useState<'assertive' | 'polite'>('polite');

    useEffect(() => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      if (!internalValue.trim()) {
        setAnnounceMsg('');
        prevAnnounceRef.current = '';
        return;
      }

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

        if (prevAnnounceRef.current !== newMsg) {
          prevAnnounceRef.current = newMsg;

          setAnnounceRole(liveType);

          setAnnounceMsg('');
          requestAnimationFrame(() => {
            setAnnounceMsg(newMsg);
          });
        }
      }, 300);

      return () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }, [internalValue, filteredOptions.length]);

    // rest.className에서 'pseudo-'로 시작하는 클래스만 추출
    const pseudoClasses = rest.className
      ? rest.className
          .split(' ')
          .filter(cls => cls.startsWith('pseudo-'))
          .join(' ')
      : '';

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['searchbar']} variant--${variant} shape--${shape} color--${color} size--${size}`,
        )}
      >
        <label htmlFor={inputId} className='sr-only'>
          {labelText}
        </label>
        <div ref={customInputRef} className={clsx('custom-input', pseudoClasses)}>
          <input
            ref={nativeInputRef}
            id={inputId}
            type='search'
            role={role}
            value={internalValue}
            placeholder={placeholder}
            disabled={disabled}
            aria-autocomplete='list'
            aria-haspopup='listbox'
            aria-controls={isOpen ? listboxId : undefined}
            aria-expanded={isOpen}
            aria-activedescendant={activeDescendantId}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
          />
          {actions?.utilityAction && internalValue !== '' && (
            <IconButton
              variant='solid'
              color={color}
              size={size}
              shape={shape}
              type='button'
              className={clsx('adorned-end', 'delete-btn')}
              aria-label={
                actions.utilityAction.ariaLabel ?? defaultAriaLabel[actions.utilityAction.type]
              }
              disabled={actions.utilityAction.disabled}
              onClick={handleUtilityClick}
              onMouseDown={handleUtilityClick}
              icon={actions.utilityAction.icon}
            />
          )}

          {actions?.submitAction && (
            <IconButton
              variant={buttonProps?.variant}
              color={color}
              size={size}
              shape={shape}
              type='submit'
              className={clsx('adorned-end', 'submit-btn')}
              aria-label={
                actions.submitAction.ariaLabel ?? defaultAriaLabel[actions.submitAction.type]
              }
              disabled={actions.submitAction.disabled}
              onClick={actions.submitAction.onClick}
              icon={actions.submitAction.icon}
            />
          )}
        </div>

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
                        variant={variant === 'outline' ? 'ghost' : 'solid'}
                        color={color}
                        size={size}
                        index={idx}
                        id={opt.id}
                        value={opt.value}
                        href={opt.href}
                        target={opt.target}
                        className={clsx({ 'is-active': idx === activeIndex })}
                        onKeyDown={e => handleOptionKeyDown(e, idx)}
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
                        strokeWidth={2.5}
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
