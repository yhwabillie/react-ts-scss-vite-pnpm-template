import React, {
  forwardRef,
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/Selectbox/Selectbox.module.scss';
import Icon from '@/components/ui/atoms/Icon/Icon';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import OptionListPortal from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import type { PortalPosition } from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import type { OptionListProps } from '../OptionList/OptionList';
import type { OptionItemProps } from '../OptionItem/OptionItem';

type BaseProps = {
  variant: 'solid' | 'soft' | 'outline' | 'ghost';
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'brand-sub'
    | 'success'
    | 'warning'
    | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  ariaControls?: string;
  ariaLabelledBy?: string;
  value?: string;
  placeholder?: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
};

type SelectboxProps = BaseProps & Omit<React.HTMLAttributes<HTMLSelectElement>, keyof BaseProps>;

const Selectbox = forwardRef<HTMLSelectElement, SelectboxProps>(
  (
    {
      variant,
      color,
      size,
      id,
      className,
      required,
      disabled,
      ariaControls,
      ariaLabelledBy,
      value,
      placeholder,
      children,
      onValueChange,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);

    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<HTMLLIElement[]>([]);

    // -----------------------------
    // custom-select 포커스 제어 ref
    // -----------------------------
    const customSelectRef = React.useRef<HTMLDivElement>(null);

    // -----------------------------
    // 선택된 옵션 스크롤 이동 (한 번만)
    // -----------------------------
    const hasScrolledRef = useRef(false);

    // --------------------------------------------
    // OptionList + OptionItem (children에서 추출)
    // --------------------------------------------
    const optionList = React.Children.toArray(children).find(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionListProps>;
    if (!optionList) return null;

    const optionItemArr = React.Children.toArray(optionList.props.children).filter(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionItemProps>[];

    // -----------------------------
    // 포지션 업데이트
    // -----------------------------
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

    // -----------------------------
    // 외부 클릭 시 닫기
    // -----------------------------
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node | null;
        const insideContainer =
          containerRef.current && target && containerRef.current.contains(target);
        const insidePortal = portalRef.current && target && portalRef.current.contains(target);

        if (!insideContainer && !insidePortal) {
          setIsOpen(false);
          setFocusedIndex(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // -----------------------------
    // OptionItem → label / value 변환
    // -----------------------------
    const labelCache = useRef(new Map<React.ReactNode, string>());

    const extractLabelText = (node: React.ReactNode): string => {
      if (labelCache.current.has(node)) return labelCache.current.get(node)!;
      let result = '';
      if (!node) result = '';
      else if (typeof node === 'string' || typeof node === 'number') result = String(node);
      else if (Array.isArray(node)) result = node.map(extractLabelText).join('');
      else if (React.isValidElement(node)) {
        const element = node as React.ReactElement<{ children?: React.ReactNode }>;
        result = extractLabelText(element.props.children);
      }
      labelCache.current.set(node, result);
      return result;
    };

    // placeholder가 없으면 optionRefs[0]가 실제 첫 옵션과 항상 일치
    const parsedOptions = useMemo(() => {
      return optionItemArr.map((item, idx) => {
        const labelText = extractLabelText(item.props.children);
        const value = item.props.value ?? labelText;
        const selected = item.props.selected; // id 포함
        const id = item.props.id ?? `opt-${idx}`; // id 포함
        return {
          key: idx,
          id,
          label: labelText,
          value,
          selected: selected,
          disabled: item.props['aria-disabled'] === true,
        };
      });
    }, [optionItemArr]);

    // -----------------------------
    // 선택값 상태 관리
    // -----------------------------
    const [selectedId, setSelectedId] = useState<string | undefined>(
      parsedOptions.find(opt => opt.selected)?.id ?? parsedOptions[0].id,
    );
    // 선택된 value는 id 기준으로 가져옴
    const [selectedValue, setSelectedValue] = useState<string>(
      parsedOptions.find(opt => opt.selected)?.value ?? '',
    );

    const handleSelect = useCallback(
      (id: string, value: string) => {
        setSelectedId(id);
        setSelectedValue(value);
        onValueChange?.(value);
        setIsOpen(false);
        setFocusedIndex(null);
      },
      [onValueChange],
    );

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
      handleSelect(e.target.id, e.target.value);
    };

    // -----------------------------
    // custom-select 포커스 시 첫 옵션 포커싱
    // -----------------------------
    // 1️⃣ custom select focus 시 index만 세팅
    const handleCustomSelectFocus = useCallback(() => {
      if (disabled) return;
      // tab으로 들어와도 바로 열지 않음
      // 포커스 상태만 유지
    }, [disabled]);

    // 2️⃣ focusedIndex나 isOpen 변경 시 포커스 적용
    useEffect(() => {
      if (!isOpen) return;
      if (focusedIndex === null) return;

      const el = optionRefs.current[focusedIndex];
      if (el) {
        el.focus();
      }
    }, [focusedIndex, isOpen]);

    // focusedIndex가 바뀔 때 포커스 적용
    useEffect(() => {
      if (!isOpen) return; // 열려있을 때만
      if (focusedIndex === null) return;

      const el = optionRefs.current[focusedIndex];
      if (el) {
        el.focus({ preventScroll: true });
      }
    }, [focusedIndex, isOpen]);

    // -----------------------------
    // 키보드 이벤트
    // -----------------------------
    // 키보드 이벤트
    const handleKeyDown = useCallback(
      <T extends HTMLElement>(e: React.KeyboardEvent<T>) => {
        if (!isOpen) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);

            // 1️⃣ 현재 선택된 id 기준으로 포커스
            let focusIdx = parsedOptions.findIndex(opt => opt.id === selectedId && !opt.disabled);

            // 2️⃣ 없으면 첫 번째 활성 옵션
            if (focusIdx === -1) {
              focusIdx = parsedOptions.findIndex(opt => !opt.disabled);
            }

            setTimeout(() => setFocusedIndex(focusIdx), 0);
          }
        } else {
          switch (e.key) {
            case 'Escape':
              e.preventDefault();
              setIsOpen(false);
              setFocusedIndex(null);
              customSelectRef.current?.focus();
              break;
            case 'ArrowDown':
              e.preventDefault();
              setFocusedIndex(prev => {
                if (prev === null) return parsedOptions.findIndex(o => !o.disabled);
                let next = prev + 1;
                while (next < parsedOptions.length && parsedOptions[next].disabled) next++;
                return next < parsedOptions.length ? next : prev;
              });
              break;
            case 'ArrowUp':
              e.preventDefault();
              setFocusedIndex(prev => {
                if (prev === null) return parsedOptions.length - 1;
                let next = prev - 1;
                while (next >= 0 && parsedOptions[next].disabled) next--;
                return next >= 0 ? next : prev;
              });
              break;
            case 'Enter':
            case ' ':
              e.preventDefault();
              if (focusedIndex !== null && !parsedOptions[focusedIndex].disabled) {
                handleSelect(parsedOptions[focusedIndex].id, parsedOptions[focusedIndex].value);
                customSelectRef.current?.focus();
              }
              break;
          }
        }
      },
      [isOpen, parsedOptions, focusedIndex, handleSelect],
    );

    const optionListChildren = useMemo(() => {
      return React.Children.map(optionList.props.children, (child, idx) => {
        if (!React.isValidElement(child)) return child;

        const childTyped = child as React.ReactElement<OptionItemProps>;

        return React.cloneElement(childTyped, {
          index: idx,
          tabIndex: -1,
          selected: parsedOptions[idx].id === selectedId,
          disabled: parsedOptions[idx].disabled, // ★ 여기 추가
          value: parsedOptions[idx].value,
          onSelect: handleSelect,
          onKeyDown: handleKeyDown, // useCallback 적용
          onMount: (el: HTMLLIElement | null, index?: number) => {
            // 변경 후 (포커스 즉시 처리)
            if (index === undefined) return;
            optionRefs.current[index] = el!;
          },
        });
      });
    }, [optionList.props.children, parsedOptions, selectedValue, handleSelect, handleKeyDown]);

    const memoizedOptionList = useMemo(() => {
      if (!optionList) return null;

      return React.cloneElement(optionList, {
        selectedId: selectedId,
        onOptionSelect: handleSelect,
        className: optionList.props.className,
        children: optionListChildren, // useMemo로 미리 만들어둔 children
      });
    }, [optionList, optionListChildren, selectedValue, handleSelect, isOpen]);

    // -----------------------------
    // 포커싱 효과
    // -----------------------------
    useEffect(() => {
      if (focusedIndex !== null && optionRefs.current[focusedIndex]) {
        optionRefs.current[focusedIndex].focus();
      }
    }, [focusedIndex, isOpen]);

    // -----------------------------
    // 포탈 위치 계산(useLayoutEffect)
    // -----------------------------
    useLayoutEffect(() => {
      if (!isOpen) {
        setPositioned(false);
        setPortalPos(null);
        return;
      }

      // 동기적으로 위치 계산
      const pos = updatePosition();
      if (pos) {
        setPortalPos(pos);
        setPositioned(true);
      }
    }, [isOpen, updatePosition]);

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

    useEffect(() => {
      if (!isOpen) {
        hasScrolledRef.current = false; // 닫히면 다시 초기화
        return;
      }

      if (hasScrolledRef.current) return; // 이미 스크롤 완료 시 더 이상 실행하지 않음

      const timeout = setTimeout(() => {
        const selectedIdx = parsedOptions.findIndex(opt => opt.id === selectedId);
        if (selectedIdx === -1) return;

        const selectedEl = optionRefs.current[selectedIdx];
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'nearest' });
          hasScrolledRef.current = true; // 한 번만 실행 표시
        }
      }, 0);

      return () => clearTimeout(timeout);
    }, [isOpen, selectedId, parsedOptions]);

    // -----------------------------
    // focusedIndex 기반으로 activeDescendant 계산
    // -----------------------------
    const activeDescendant = useMemo(() => {
      // 1) 키보드로 포커스된 옵션 우선
      if (focusedIndex !== null) {
        const opt = parsedOptions[focusedIndex];
        if (opt) return `${opt.id}`;
      }

      // 2) 클릭으로 선택된 옵션 (포커스는 사라졌지만 선택은 유지됨)
      if (selectedId) return `${selectedId}`;

      // 3) 아무것도 없으면 공백
      return '';
    }, [focusedIndex, parsedOptions, selectedId]);

    // -----------------------------
    // 렌더링
    // -----------------------------
    return (
      <div
        ref={containerRef}
        className={clsx(
          `${styles['selectbox']} variant--${variant} color--${color} size--${size}`,
          className,
        )}
      >
        {/* native select (보조기기 동기화용) */}
        <select
          ref={ref}
          id={id}
          value={selectedValue}
          tabIndex={-1}
          required={required}
          disabled={disabled}
          onChange={handleChange}
        >
          {parsedOptions.map(opt => (
            <option key={opt.key} value={opt.value} disabled={opt.disabled}>
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
          onFocus={handleCustomSelectFocus}
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen(prev => !prev)}
          role='combobox'
          aria-controls={ariaControls}
          aria-activedescendant={isOpen ? activeDescendant : ''}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-labelledby={ariaLabelledBy}
        >
          <span className='custom-select-text'>{selectedValue || placeholder}</span>

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

        {isOpen && portalPos && (
          <OptionListPortal isOpen={isOpen} position={portalPos} portalRef={portalRef}>
            {memoizedOptionList}
          </OptionListPortal>
        )}
      </div>
    );
  },
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;
