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
import type { OptionBase, OptionItemProps } from '../OptionItem/OptionItem';

interface BaseProps extends Pick<OptionBase, 'id' | 'disabled'> {
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
  required?: boolean;
  placeholder: string;
  className?: string;
  ariaControls?: string;
  ariaLabelledBy?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

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
      placeholder,
      children,
      onValueChange,
    },
    ref,
  ) => {
    // -----------------------------
    // 📌 상태 선언
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [positioned, setPositioned] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);

    // -----------------------------
    // 🧩 Ref 플래그 선언
    // -----------------------------
    const portalRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<HTMLLIElement[]>([]);
    const customSelectRef = React.useRef<HTMLDivElement>(null);
    const hasScrolledRef = useRef(false);

    // -----------------------------
    // 🗂️ labelCache
    // - ReactNode → string 매핑을 캐싱
    // - 동일한 JSX 요소를 반복 처리하지 않도록 성능 최적화
    // -----------------------------
    const labelCache = useRef(new Map<React.ReactNode, string>());

    // -----------------------------
    // 🗂️ extractLabelText
    // - ReactNode(children)를 문자열로 변환
    // - 문자열/숫자 → 그대로 반환
    // - 배열 → 재귀적으로 각 요소를 합쳐서 반환
    // - ReactElement → children 재귀 처리
    // - 변환 결과를 labelCache에 저장
    // -----------------------------
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

    // ------------------------------------------------------
    // 📦 OptionList & OptionItem 파싱
    // - children 중 첫 번째 유효한 ReactElement를 OptionList로 간주
    // - OptionList 내부의 OptionItem들을 배열로 정규화
    // ------------------------------------------------------
    const optionList = React.Children.toArray(children).find(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionListProps>;
    if (!optionList) return null;

    const optionItemArr = React.Children.toArray(optionList.props.children).filter(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionItemProps>[];

    // -----------------------------
    // 📦 parsedOptions 파싱
    // - OptionItem JSX → 순수 데이터 객체 배열
    // - label: extractLabelText 사용
    // - value: props.value가 없으면 label 사용
    // - id: props.id 없으면 자동 생성
    // - disabled: aria-disabled 기준
    // -----------------------------
    const parsedOptions = useMemo(() => {
      return optionItemArr.map((item, idx) => {
        const id = item.props.id ?? `opt-${idx}`; // id 포함
        const labelText = extractLabelText(item.props.children);
        const value = item.props.value ?? labelText;
        const selected = item.props.selected;
        const disabled = item.props.disabled;

        return {
          key: idx,
          id,
          value,
          label: labelText,
          selected,
          disabled,
        };
      });
    }, [optionItemArr]);

    // ----------------------------------------------------------------------------
    // 📌 선택 상태 관리
    // - selectedId: 현재 선택된 옵션의 id
    //   • 초기값: parsedOptions에서 selected가 true인 옵션 id
    //   • 없으면 첫 번째 옵션(parsedOptions[0].id) 사용
    // - selectedValue: 현재 선택된 옵션의 value
    //   • selectedId 기준으로 가져옴
    // ----------------------------------------------------------------------------
    const [selectedId, setSelectedId] = useState<string>(() => {
      const selectedOption = parsedOptions.find(
        opt => opt.selected && !opt.disabled && opt.value !== '',
      );
      if (selectedOption) return selectedOption.id;
      return '';
    });

    const [selectedValue, setSelectedValue] = useState<string>(
      parsedOptions.find(opt => opt.selected)?.value ?? '',
    );

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
        onValueChange?.(value);
        setIsOpen(false);
        setFocusedIndex(null);
      },
      [onValueChange],
    );

    // -----------------------------
    // ⚡️ handleChange
    // - Select 요소 변경 이벤트 핸들러
    // - 사용자가 옵션 선택 시 handleSelect 호출 (id, value 전달)
    // -----------------------------
    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
      handleSelect(e.target.id, e.target.value);
    };

    // ------------------------------------------------------
    // ⚡️ handleCustomSelectFocus
    // - custom-select 요소에 포커스가 들어올 때 호출
    // - disabled 상태면 아무 동작하지 않음
    // - Tab 키로 포커스 들어와도 드롭다운은 열지 않고
    //   포커스 상태만 유지
    // ------------------------------------------------------
    const handleCustomSelectFocus = useCallback(() => {
      if (disabled) return;
    }, [disabled]);

    // -----------------------------------------------------
    // ✨ 포커스 이동 처리
    // - 드롭다운이 열려(isOpen) 있고 focusedIndex가 존재할 때
    // - focusedIndex에 해당하는 옵션 DOM 요소에 포커스(focus()) 적용
    // - 키보드 방향키 이동 등으로 focus 관리 용도
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) return;
      if (focusedIndex === null) return;

      const el = optionRefs.current[focusedIndex];
      if (el) {
        el.focus();
      }
    }, [focusedIndex, isOpen]);

    // -----------------------------
    // ✨ focusedIndex 변화 시 해당 옵션에 포커스 적용
    // - focusedIndex가 null이 아니면 optionRefs 배열에서 해당 요소 focus
    // - 키보드 이동이나 검색 결과 변경 시 포커스 동기화
    // -----------------------------
    useEffect(() => {
      if (focusedIndex !== null && optionRefs.current[focusedIndex]) {
        optionRefs.current[focusedIndex].focus();
      }
    }, [focusedIndex, isOpen]);

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
    const handleKeyDown = useCallback(
      <T extends HTMLElement>(e: React.KeyboardEvent<T>) => {
        if (!isOpen) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);

            // 현재 선택된 id 기준으로 포커스
            let focusIdx = parsedOptions.findIndex(opt => opt.id === selectedId && !opt.disabled);

            // 없으면 첫 번째 활성 옵션
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

    // ------------------------------------------------------
    // 🧩 optionListChildren 생성
    // - OptionList 내부 children을 map하여 OptionItem에 필요한 props 주입
    // - index, tabIndex, selected, disabled, value, 이벤트 핸들러(onSelect, onKeyDown) 설정
    // - onMount를 통해 optionRefs에 DOM 요소 저장 → 포커스 관리용
    // - parsedOptions 기반으로 selected/disabled 상태 동기화
    // ------------------------------------------------------
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

    // ------------------------------------------------------
    // 🧩 memoizedOptionList
    // - OptionList를 클론하여 필요한 props 주입
    //   • selectedId: 현재 선택된 옵션 id
    //   • onOptionSelect: 옵션 선택 핸들러
    //   • className: 기존 OptionList 클래스 유지
    //   • children: useMemo로 생성한 OptionItem 리스트
    // - useMemo 적용 → optionList 또는 children 변경 시에만 리렌더링
    // ------------------------------------------------------
    const memoizedOptionList = useMemo(() => {
      if (!optionList) return null;

      return React.cloneElement(optionList, {
        selectedId: selectedId,
        onOptionSelect: handleSelect,
        className: optionList.props.className,
        children: optionListChildren, // useMemo로 미리 만들어둔 children
      });
    }, [optionList, optionListChildren, selectedValue, handleSelect, isOpen]);

    // -----------------------------------------------------
    // ♿️ [KWCAG] activeDescendant 계산
    // - focusedIndex를 기준으로 현재 키보드 포커스가 있는 옵션 ID 반환
    // - 포커스가 없으면 선택된 옵션(selectedId) ID 반환
    // - 둘 다 없으면 공백 반환
    // - 웹 접근성: aria-activedescendant 속성에 사용
    // -----------------------------------------------------
    const activeDescendant = useMemo(() => {
      if (focusedIndex !== null) {
        const opt = parsedOptions[focusedIndex];
        if (opt) return `${opt.id}`;
      }

      // 클릭으로 선택된 옵션 (포커스는 사라졌지만 선택은 유지됨)
      if (selectedId) return `${selectedId}`;

      // 아무것도 없으면 공백
      return '';
    }, [focusedIndex, parsedOptions, selectedId]);

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
    // 🔧 [Portal] updatePosition
    // - Select 컴포넌트 위치 계산 함수
    // - Portal/Dropdown 위치를 화면에 맞춰 동적으로 계산
    // - 기준 요소: customSelectRef 또는 containerRef
    // - 반환: { top, left, width } 형태의 PortalPosition
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

      // 동기적으로 위치 계산
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
    // ✨ [Portal] 외부 클릭 감지
    // - containerRef + portalRef 외부 클릭 시 드롭다운 메뉴 닫기
    // - 외부 클릭 시 포커스(focusedIndex) 초기화
    // - useEffect 의존성 배열 [] → 컴포넌트 마운트 시 한 번만 이벤트 등록
    // - container 내부 클릭은 메뉴 유지
    // -----------------------------------------------------
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
    // ▶️ 렌더링
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

        {/* OptionList */}
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
