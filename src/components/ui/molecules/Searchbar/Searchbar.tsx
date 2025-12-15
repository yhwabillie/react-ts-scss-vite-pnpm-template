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
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
}

interface SearchbarProps extends StyleProps, NativeDivProps {
  id?: string;
  inputProps?: InputA11yProps & {
    inputId?: string;
    labelText?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
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
// 🎯 [Performance] OptionItem 메모이제이션
// - 불필요한 리렌더링 방지
// - 옵션 리스트 성능 최적화
// -----------------------------------------------------
const MemoizedOptionItem = React.memo(OptionItem);

const Searchbar = forwardRef<HTMLDivElement, SearchbarProps>(
  (
    { variant, color, size, shape, id, inputProps = {}, actions, debounceMs = 300, options },
    ref,
  ) => {
    // inputProps 구조분해
    const { inputId, labelText, role, placeholder, disabled, value, onChange } = inputProps;

    // -----------------------------
    // 📌 상태 선언
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [internalValue, setInternalValue] = useState(value ?? '');
    // const [announceMsg, setAnnounceMsg] = useState('');
    // const [announceRole, setAnnounceRole] = useState<'assertive' | 'polite'>('polite');

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
    const ignoreNextFocusRef = useRef(false);
    const debouncedOnChangeRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // -----------------------------
    // 🔑 ID 관리
    // -----------------------------
    const baseId = id ?? useId();
    const listboxId = `${baseId}-listbox`;

    // -----------------------------------------------------
    // 🔍 [Filter] 옵션 필터링
    // - input 값 기준으로 options 필터링
    // - 대소문자 구분 없이 검색
    // -----------------------------------------------------
    const filteredOptions =
      options?.filter(opt => opt.value.toLowerCase().includes(internalValue.toLowerCase())) ?? [];

    // -----------------------------------------------------
    // ✨ [Sync] 외부 value prop 동기화
    // - 외부에서 value가 변경되면 내부 state 업데이트
    // - Controlled component 지원
    // -----------------------------------------------------
    useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(value);
      }
    }, [value]);

    // -----------------------------------------------------
    // 🧹 [Cleanup] 타이머 정리
    // - 컴포넌트 언마운트 시 debounce 타이머 정리
    // - 메모리 누수 방지
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
    // - 리스트를 여는 이유(reason) 추적
    // - 'input', 'keyboard', 'button' 등의 소스 기록
    // -----------------------------------------------------
    const openList = useCallback((reason?: 'input' | 'keyboard' | 'button') => {
      openReasonRef.current = reason ?? null;
      setIsOpen(true);
    }, []);

    // -----------------------------------------------------
    // 📁 [Interaction] 옵션 리스트 닫기
    // - restoreFocus: true일 경우 input으로 포커스 복원
    // - activeIndex 초기화로 aria-activedescendant 제거
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
    // ⌨️ [Input] Input 변경 핸들러
    // - 내부 상태 업데이트 및 타이핑 상태 추적
    // - Debounce를 통한 부모 onChange 호출 최적화
    // - 입력값이 있을 때만 옵션 리스트 열기
    // -----------------------------------------------------
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

        // 입력값이 있을 때만 OptionList 열기
        if (newValue !== '') {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      },
      [onChange, debounceMs],
    );

    // -----------------------------------------------------
    // 🖱️ [Selection] 옵션 클릭 핸들러
    // - 선택된 옵션 값으로 input 업데이트
    // - Debounce 타이머 취소 후 즉시 onChange 호출
    // - 리스트 닫기 및 포커스 복원
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
    // 🔘 [Action] Utility 버튼 클릭 핸들러
    // - 'clear' 타입일 경우 입력값 초기화
    // - Debounce 타이머 취소 후 즉시 onChange 호출
    // - 리스트 닫기 및 수동 포커스 복원
    // -----------------------------------------------------
    const handleUtilityClick = useCallback(() => {
      if (actions?.utilityAction?.type === 'clear') {
        const newValue = '';
        setInternalValue(newValue);

        // debounce 타이머 취소 후 즉시 onChange 호출
        if (debouncedOnChangeRef.current) {
          clearTimeout(debouncedOnChangeRef.current);
        }
        onChange?.(newValue);

        closeList(false); // restoreFocus = false

        // 수동으로 포커스 복원하되, ignoreNextFocusRef 설정
        ignoreNextFocusRef.current = true;
        requestAnimationFrame(() => {
          nativeInputRef.current?.focus();
        });
      }

      actions?.utilityAction?.onClick?.();
    }, [actions, onChange, closeList]);

    // -----------------------------------------------------
    // ⌨️ [Keyboard] Input 키보드 이벤트 핸들러
    // - IME 조합 중 이벤트 무시
    // - ArrowDown: 리스트 열기 또는 다음 옵션으로 이동
    // - ArrowUp: 이전 옵션으로 이동
    // - Enter: 현재 활성 옵션 선택
    // - Escape: input 값 초기화 및 리스트 닫기
    // -----------------------------------------------------
    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // IME 조합 중이면 이벤트 무시
        if (e.nativeEvent.isComposing) {
          return;
        }

        // Escape 키는 리스트 상태와 관계없이 처리
        if (e.key === 'Escape') {
          e.preventDefault();

          // input 값 초기화
          const newValue = '';
          setInternalValue(newValue);

          // debounce 타이머 취소 후 즉시 onChange 호출
          if (debouncedOnChangeRef.current) {
            clearTimeout(debouncedOnChangeRef.current);
          }
          onChange?.(newValue);

          // 리스트 닫기 및 포커스 유지
          closeList(true);
          return;
        }

        if (!isOpen) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openList('keyboard');
          }
          return;
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex(prev => {
              // null이면 0부터 시작
              if (prev === null) return 0;
              // 마지막 옵션에서 더 이상 내려가지 않음
              if (prev === filteredOptions.length - 1) return prev;
              return prev + 1;
            });
            break;

          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex(prev => {
              // null이면 0부터 시작
              if (prev === null) return 0;
              // 첫 번째 옵션에서 더 이상 올라가지 않음
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

          // case 'Escape':
          //   e.preventDefault();
          //   closeList(true);
          //   break;
        }
      },
      [isOpen, filteredOptions, handleInputChange, closeList, openList],
    );

    // -----------------------------------------------------
    // ♿️ [ARIA] 활성 옵션 ID 계산
    // - 키보드 포커스가 있는 옵션의 ID를 aria-activedescendant에 사용
    // - activeIndex가 null이면 undefined 반환
    // -----------------------------------------------------
    const activeDescendantId =
      activeIndex !== null && filteredOptions[activeIndex]
        ? filteredOptions[activeIndex].id
        : undefined;

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
      const target = event.target as Node | null;

      const isInsideContainer =
        containerRef.current && target && containerRef.current.contains(target);

      const isInsidePortal = portalRef.current && target && portalRef.current.contains(target);

      if (!isInsideContainer && !isInsidePortal) {
        setIsOpen(false);
      }
    }, []);

    // -----------------------------------------------------
    // 🎯 [Focus] Input 포커스 핸들러
    // - ignoreNextFocusRef를 통한 중복 포커스 이벤트 방지
    // - 포커스 시 activeIndex 리셋
    // - 키보드 네비게이션으로 리스트 열기
    // -----------------------------------------------------
    const handleInputFocus = useCallback(() => {
      if (ignoreNextFocusRef.current) {
        ignoreNextFocusRef.current = false;
        return;
      }

      setActiveIndex(null); // 포커스 시 activeIndex 리셋
      openList('keyboard'); // 포커스만으로 리스트 열기
    }, [openList]);

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
    // ✨ [Effect] 입력값 변경 시 activeIndex 리셋
    // - internalValue가 변경되면 무조건 activeIndex 초기화
    // - 새로운 필터 결과에 맞춰 포커스 상태 리셋
    // -----------------------------------------------------
    useEffect(() => {
      setActiveIndex(null);
    }, [internalValue]);

    // -----------------------------------------------------
    // ✨ [Accessibility] 활성 옵션 스크롤 동기화
    // - aria-activedescendant 기반 포커싱에서는
    //   브라우저가 자동으로 스크롤하지 않으므로 수동 처리
    // - scrollIntoView()로 화면 밖 옵션을 뷰포트로 이동
    // - block: 'nearest'로 최소한의 스크롤만 발생
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
    // const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [announceMsg, setAnnounceMsg] = useState('');
    const [announceRole, setAnnounceRole] = useState<'assertive' | 'polite'>('polite');

    useEffect(() => {
      // 이전 타이머 취소
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // 검색어 없으면 안내 초기화
      if (!internalValue.trim()) {
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
    }, [internalValue, filteredOptions.length]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
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
            /* 식별/형태 */
            id={inputId}
            type='search'
            role={role}
            /* 사용자 입력 */
            value={internalValue}
            placeholder={placeholder}
            disabled={disabled}
            /* 접근성 */
            aria-autocomplete='list'
            aria-haspopup='listbox'
            aria-controls={listboxId}
            aria-expanded={isOpen}
            aria-activedescendant={activeDescendantId}
            /* 이벤트 */
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
          />
          {actions?.utilityAction && internalValue !== '' && (
            <IconButton
              /* 식별/형태 */
              variant='ghost'
              color={color}
              size={size}
              shape={shape}
              type='button'
              className={clsx('adorned-end', 'delete-btn')}
              /* 접근성 */
              aria-label={
                actions.utilityAction.ariaLabel ?? defaultAriaLabel[actions.utilityAction.type]
              }
              /* 상태 */
              disabled={actions.utilityAction.disabled}
              /* 이벤트 */
              onClick={handleUtilityClick}
              /* 커스텀 렌더링 */
              icon={actions.utilityAction.icon}
            />
          )}
        </div>
        {actions?.submitAction && (
          <IconButton
            /* 식별/형태 */
            variant='ghost'
            color={color}
            size={size}
            shape={shape}
            type='submit'
            className={clsx('adorned-end', 'submit-btn')}
            /* 접근성 */
            aria-label={
              actions.submitAction.ariaLabel ?? defaultAriaLabel[actions.submitAction.type]
            }
            /* 상태 */
            disabled={actions.submitAction.disabled}
            /* 이벤트 */
            onClick={actions.submitAction.onClick}
            /* 커스텀 렌더링 */
            icon={actions.submitAction.icon}
          />
        )}

        {/* 최적화된 OptionList 렌더링 */}
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
