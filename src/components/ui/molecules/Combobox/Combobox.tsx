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
  variant: 'solid' | 'outline';
  color: Color;
  size: Size;
}

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof StyleProps | keyof ComboboxA11yProps
>;

export interface ComboboxProps extends StyleProps, ComboboxA11yProps, NativeDivProps {
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
      value,
      onValueChange,
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
    const customInputRef = React.useRef<HTMLDivElement>(null);
    const nativeInputRef = React.useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const openReasonRef = useRef<'input' | 'keyboard' | 'button' | null>(null);

    // -----------------------------
    // 🔑 [ID] 컴포넌트/리스트박스 식별자
    // -----------------------------
    const baseId = id ?? useId();
    const listboxId = `${baseId}-listbox`;

    // -----------------------------
    // 🏁 초기 선택값
    // - selected && !disabled && value !== ''만 허용
    // -----------------------------
    const initialSelectedOption = useMemo(
      () => options.find(opt => opt.selected && !opt.disabled && opt.value !== '') ?? null,
      [options],
    );

    const [selectedId, setSelectedId] = useState<string | null>(initialSelectedOption?.id ?? null);
    const [inputValue, setInputValue] = useState<string>(initialSelectedOption?.value ?? '');

    const selectedOption = useMemo(
      () => options.find(opt => opt.id === selectedId) ?? null,
      [options, selectedId],
    );

    // -----------------------------
    // 🎯 [Controlled] value 동기화
    // -----------------------------
    useEffect(() => {
      if (value === undefined) return; // uncontrolled 모드

      setInputValue(value);

      const matchedOption = options.find(opt => opt.value === value);
      setSelectedId(matchedOption?.id ?? null);
    }, [value, options]);

    // -----------------------------
    // 🔎 [필터링] inputValue 기준 옵션 필터링
    // -----------------------------
    const filteredOptions = useMemo(() => {
      if (!inputValue) return options;

      const keyword = inputValue.toLowerCase();

      return options.filter(opt => opt.value.toLowerCase().includes(keyword));
    }, [options, inputValue]);

    // -----------------------------
    // ♿️ [ARIA] 활성 옵션 ID
    // -----------------------------
    const activeDescendantId =
      focusedIndex !== null ? filteredOptions[focusedIndex]?.id : undefined;

    // -----------------------------------------------------
    // ⚡️ [Input] 입력 변화 처리
    // -----------------------------------------------------
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setInputValue(value);
      setIsOpen(true);
      openReasonRef.current = 'input';

      setFocusedIndex(null);

      if (selectedOption && selectedOption.value !== value) {
        setSelectedId(null);
      }

      inputProps?.onChange?.(e);
    };

    // -----------------------------------------------------
    // ⚡️ [Option] 옵션 선택 처리
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
    // 🔁 [Keyboard] 다음/이전 활성 인덱스 계산
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
    // ⌨️ [Keyboard] 키보드 인터랙션
    // -----------------------------------------------------
    const lastKeyEventRef = useRef<{ key: string; timestamp: number } | null>(null);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const now = Date.now();

        // 50ms 이내 중복 키 입력 방지
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
              // 초기 진입: 선택된 옵션 또는 첫 활성 옵션
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
              // 기존 포커스가 있으면 다음/이전
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
    // ✨ [A11y] 활성 옵션 스크롤 동기화
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
    // 🖱️ [Interaction] 외부 클릭 감지
    // -----------------------------------------------------
    const handleOutsideClick = useCallback((event: MouseEvent) => {
      const target = event.target as Node | null;

      // 1. 트리거 컨테이너 내부 클릭인지 확인
      const isInsideContainer = containerRef.current?.contains(target);
      // 2. 실제 커스텀 셀렉트 영역 클릭인지 확인
      const isInsideCustomSelect = customInputRef.current?.contains(target);
      // 3. 옵션 목록(Portal) 내부 클릭인지 확인
      const isInsidePortal = portalRef.current?.contains(target);

      if (isInsideContainer || isInsideCustomSelect || isInsidePortal) {
        return;
      }

      setIsOpen(false);
      setFocusedIndex(null);
    }, []);

    // -----------------------------------------------------
    // ✨ [Focus Sync] 활성 옵션 스크롤 동기화
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
    // ✨ 외부 클릭 이벤트 등록/해제
    // -----------------------------------------------------
    useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [handleOutsideClick]);

    // -----------------------------------------------------
    // 🔧 [Portal] 위치 계산
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
    // ✨ [Portal] 열림/닫힘에 따른 위치 초기화
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
    // ✨ [Portal] 리사이즈/스크롤 시 위치 재계산
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
    // 🔊 [A11y] 검색 결과 안내 (i18n 포인트)
    // -----------------------------------------------------
    const prevAnnounceRef = useRef<string>('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [announceMsg, setAnnounceMsg] = useState('');
    const [announceRole, setAnnounceRole] = useState<'assertive' | 'polite'>('polite');

    useEffect(() => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      if (!inputValue.trim()) {
        setAnnounceMsg('');
        prevAnnounceRef.current = '';
        return;
      }

      typingTimeoutRef.current = setTimeout(() => {
        let newMsg = '';
        let liveType: 'assertive' | 'polite' = 'polite';

        if (filteredOptions.length === 0) {
          newMsg = '검색 결과가 없습니다.';
          liveType = 'assertive';
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
    }, [inputValue, filteredOptions.length]);

    // storybook 상태 클래스: 일반 클래스만
    const filteredClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => {
          if (!name.startsWith('pseudo-')) return true;

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

    // 인터랙션 차단 여부
    const isInteractive = !disabled && !readOnly;

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={ref}
        className={clsx(
          `${styles['combobox']} variant--${variant} color--${color} size--${size}`,
          // pseudo- 가 제외된 순수 외부 클래스들
          filteredClassName,
        )}
      >
        <div ref={customInputRef} className='custom-input'>
          <input
            ref={nativeInputRef}
            id={inputId}
            type='text'
            className={clsx('custom-input-text', pseudoClassName)}
            {...inputProps}
            role={role}
            aria-activedescendant={activeDescendantId}
            aria-controls={isOpen ? listboxId : undefined}
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
          <span id={ariaLabelledBy} className='sr-only'>
            {inputProps?.placeholder}
          </span>
          <IconButton
            color={color}
            size={size}
            variant='ghost'
            shape='rounded'
            className='adorned-end'
            type='button'
            aria-label={isOpen ? '옵션 닫기' : '옵션 열기'}
            disabled={disabled || readOnly}
            icon={
              <Icon
                name={isOpen ? 'arrow-up' : 'arrow-down'}
                className='icon'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
            onClick={e => {
              if (!isInteractive) return;
              e.stopPropagation(); // document mousedown close 방지
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
                    // filteredOptions 순서가 optionRefs 인덱스와 일치해야 함
                    optionRefs.current[idx] = el;
                  }}
                  key={opt.id}
                  variant='ghost'
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
                    strokeWidth={2.5}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <span className='title'>검색 결과가 없습니다.</span>
                  <span className='desc'>다른 키워드로 다시 검색해 보세요.</span>
                </li>
              )}
            </OptionList>

            {/* 스크린리더 전용 안내 */}
            <div className='sr-only' role='status' aria-live={announceRole} aria-atomic='true'>
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
