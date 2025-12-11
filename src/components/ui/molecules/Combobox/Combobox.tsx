import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/Combobox/Combobox.module.scss';
import Icon from '@/components/ui/atoms/Icon/Icon';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import OptionListPortal from '@/components/ui/molecules/OptionListPortal/OptionListPortal';
import type { PortalPosition } from '../OptionListPortal/OptionListPortal';
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

type ComboboxProps = BaseProps & Omit<React.HTMLAttributes<HTMLInputElement>, keyof BaseProps>;

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
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
    const customInputRef = React.useRef<HTMLDivElement>(null);
    const hasScrolledRef = useRef(false);

    // -----------------------------
    // 🗂️ labelCache
    // - ReactNode → string 매핑을 캐싱
    // -----------------------------
    const labelCache = useRef(new Map<React.ReactNode, string>());

    // -----------------------------
    // 🗂️ extractLabelText
    // - ReactNode(children)를 문자열로 변환
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
    // ------------------------------------------------------
    const optionList = React.Children.toArray(children).find(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionListProps>;
    if (!optionList) return null;

    const optionItemArr = React.Children.toArray(optionList.props.children).filter(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionItemProps>[];

    // -------------------------------------
    // 📦 ParsedOptions 파싱
    // - label: extractLabelText 사용
    // - value: label 폴백 사용
    // - id: 인덱스 폴백 사용
    // -------------------------------------
    const parsedOptions = useMemo(() => {
      return optionItemArr.map((item, idx) => {
        const id = item.props.id ?? `opt-${idx}`; // ID는 prop이 없으면 자동 생성
        const labelText = extractLabelText(item.props.children); // 레이블은 children에서 텍스트 추출
        const value = item.props.value ?? labelText; // Value는 prop이 없으면 레이블 사용
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
    //   • disabled 옵션은 제외
    //   • 값이 없는 옵션은 제외
    //   • 초기값: parsedOptions에서 selected가 true인 첫 번째 유효 옵션
    // - selectedValue: 현재 선택된 옵션의 value
    //   • 초기값: parsedOptions에서 selected가 true인 첫 번째 옵션 값
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

    // -----------------------------------------------------
    // 📌 prevSelectedValue 상태 관리
    // - OptionList 열기 직전 값 저장
    // - 이전 selectedValue 상태를 저장하여 포커스 아웃 시 복원에 사용
    // -----------------------------------------------------
    const [prevSelectedValue, setPrevSelectedValue] = useState(selectedValue);

    // ------------------------------------------------------
    // ⚡️ handleSelect
    // - 옵션 선택 시 호출되는 이벤트 핸들러
    // - selectedId, selectedValue, prevSelectedValue 업데이트
    // - onValueChange 콜백 실행
    // - 드롭다운 메뉴 닫기(isOpen = false)
    // - 선택 완료 후 포커스(focusedIndex) 초기화
    // ------------------------------------------------------
    const handleSelect = useCallback(
      (id: string, value: string) => {
        setSelectedId(id);
        setSelectedValue(value);
        setPrevSelectedValue(value);
        onValueChange?.(value);
        setIsOpen(false);
        setFocusedIndex(null); // 선택 완료 시 포커스 인덱스 초기화
      },
      [onValueChange],
    );

    // ------------------------------------------------------
    // ⚡️ handleChange
    // - Select 입력값 변경 시 호출
    // - selectedValue 업데이트 및 onValueChange 콜백 실행
    // - 입력 시작 시 드롭다운 메뉴 열기(isOpen = true)
    // - 기존 선택 ID 초기화(setSelectedId('')) → 필터링 충돌 방지
    // - 포커스(focusedIndex) 초기화
    // ------------------------------------------------------
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setSelectedValue(val);
        onValueChange?.(val);

        // 검색어를 입력하면 무조건 OptionList 열기
        if (!isOpen) setIsOpen(true);

        // 타이핑 시작 시 기존 선택 ID를 무조건 초기화
        // filteredOptions 로직이 선택된 ID에 기반하여 필터링을 유지하는 것을 방지
        setSelectedId('');

        // 검색어를 입력하면 기존 포커싱을 초기화
        setFocusedIndex(null);
      },
      [onValueChange, isOpen],
    );

    // ------------------------------------------------------
    // ⚡️ handleBlur
    // - 입력 요소 포커스가 벗어날 때 호출
    // - 콤보박스 내부로 이동하지 않으면 드롭다운 닫기(isOpen = false)
    // - 포커스(focusedIndex) 초기화
    // - 값 유효성 검사:
    //   • 입력값이 parsedOptions와 일치하지 않으면 selectedValue, selectedId 초기화
    //   • 일치하면 해당 옵션 id 유지
    // ------------------------------------------------------
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const nextFocusedElement = e.relatedTarget as Node | null;

        // 포커스가 콤보박스 내부로 이동하지 않는 경우에만 값 유효성 검사 실행
        const isMovingInsideCombobox =
          (containerRef.current && containerRef.current.contains(nextFocusedElement)) ||
          (portalRef.current && portalRef.current.contains(nextFocusedElement));

        if (!isMovingInsideCombobox) {
          setIsOpen(false);
          setFocusedIndex(null);

          // 유효성 검사 및 초기화
          const isValueMatchedInOptions = parsedOptions.some(
            // 💡 수정: value가 일치하고 AND disabled가 아닌 옵션만 유효함
            opt => opt.value === selectedValue && !opt.disabled,
          );

          if (!isValueMatchedInOptions) {
            // 현재 입력된 값이 유효한 옵션 값과 일치하지 않으면 초기화
            setSelectedValue('');
            setSelectedId('');
          } else {
            // 현재 입력된 값이 유효한 옵션 값과 일치하면 해당 값을 유지
            // 💡 disabled가 아닌 옵션 중에서만 찾도록 find도 수정
            const matchedOption = parsedOptions.find(
              opt => opt.value === selectedValue && !opt.disabled,
            );
            if (matchedOption) {
              setSelectedId(matchedOption.id);
            }
          }
        }
      },
      [parsedOptions, selectedValue, setSelectedValue, setSelectedId, setIsOpen, setFocusedIndex],
    );

    // ------------------------------------------------------
    // 🔍 filteredOptions
    // - 입력값(selectedValue)에 따라 옵션 목록 필터링
    // - selectedValue가 없거나, 선택된 옵션 값과 정확히 일치하면 전체 옵션 반환
    // - 입력값이 선택된 값과 다르거나 타이핑 중이면:
    //   • disabled가 아닌 옵션만 포함
    //   • 입력값 포함 여부(value.includes) 기준으로 필터링
    // ------------------------------------------------------
    const filteredOptions = useMemo(() => {
      // 1. 선택된 값이 없거나, 현재 input 값이 이미 선택된 옵션의 값과 정확히 일치하는 경우
      if (
        !selectedValue ||
        parsedOptions.find(opt => opt.value === selectedValue && opt.id === selectedId)
      ) {
        // 전체 목록 반환
        return parsedOptions;
      }

      // 2. 검색 중이거나, input 값이 선택된 값과 일치하지 않는 경우 (즉, 타이핑 중인 상황)
      return parsedOptions.filter(
        opt =>
          // 🚨 [핵심 수정]: disabled가 아닌 항목만 포함하고,
          !opt.disabled &&
          // 검색어와 일치하는지 확인합니다.
          opt.value.toLowerCase().includes(selectedValue.toLowerCase()),
      );
    }, [parsedOptions, selectedValue, selectedId]);

    // ------------------------------------------------------
    // ✨ filteredOptions 변경 시 포커스 초기화
    // - 드롭다운이 열려 있는 상태(isOpen)에서만 적용
    // - 검색어 입력 등으로 filteredOptions가 변경되면 focusedIndex 초기화
    //   → 사용자가 새로운 옵션을 탐색할 때 포커스 혼동 방지
    // ------------------------------------------------------
    useEffect(() => {
      if (isOpen) {
        setFocusedIndex(null);
      }
    }, [filteredOptions.length, isOpen]);

    // -----------------------------
    // ⚡️ 키보드 이벤트 처리
    // - 화살표 키, Enter, Space, Escape, Tab 대응
    // - 포커스 이동 및 선택 로직 관리
    // - 입력 필드의 기본 문자 입력은 handleChange에 위임
    // -----------------------------
    const handleKeyDown = useCallback(
      <T extends HTMLElement>(e: React.KeyboardEvent<T>) => {
        e.stopPropagation();

        const isNavigationKey = ['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Escape'].includes(e.key);
        if (isNavigationKey) {
          e.preventDefault(); // 탐색 키에 대해서만 기본 동작 차단
        }

        let nextFocusedIndex = focusedIndex;

        if (!isOpen && isNavigationKey) {
          setIsOpen(true);

          if (e.key === 'ArrowDown') {
            nextFocusedIndex = null;
          } else {
            let focusIdx = filteredOptions.findIndex(opt => opt.id === selectedId && !opt.disabled);
            if (focusIdx === -1) focusIdx = filteredOptions.findIndex(opt => !opt.disabled);
            nextFocusedIndex = focusIdx !== -1 ? focusIdx : null;
          }

          setFocusedIndex(nextFocusedIndex);
          return;
        }

        if (isOpen) {
          switch (e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
              if (filteredOptions.length === 0) {
                nextFocusedIndex = null;
              } else {
                if (e.key === 'ArrowDown') {
                  if (nextFocusedIndex === null) {
                    nextFocusedIndex = filteredOptions.findIndex(
                      opt => opt.id === selectedId && !opt.disabled,
                    );
                    if (nextFocusedIndex === -1)
                      nextFocusedIndex = filteredOptions.findIndex(opt => !opt.disabled);
                  } else {
                    let i = nextFocusedIndex + 1;
                    while (i < filteredOptions.length && filteredOptions[i].disabled) i++;
                    if (i < filteredOptions.length) nextFocusedIndex = i;
                  }
                } else if (e.key === 'ArrowUp') {
                  if (nextFocusedIndex === null) {
                    nextFocusedIndex = filteredOptions.findIndex(
                      opt => opt.id === selectedId && !opt.disabled,
                    );
                    if (nextFocusedIndex === -1) {
                      let lastIdx = filteredOptions.length - 1;
                      while (lastIdx >= 0 && filteredOptions[lastIdx].disabled) lastIdx--;
                      nextFocusedIndex = lastIdx >= 0 ? lastIdx : null;
                    }
                  } else {
                    let i = nextFocusedIndex - 1;
                    while (i >= 0 && filteredOptions[i].disabled) i--;
                    if (i >= 0) nextFocusedIndex = i;
                  }
                }
              }
              setFocusedIndex(nextFocusedIndex);
              break;

            case 'Enter':
            case ' ':
              if (
                focusedIndex !== null &&
                focusedIndex >= 0 &&
                focusedIndex < filteredOptions.length
              ) {
                const selectedOption = filteredOptions[focusedIndex];
                if (!selectedOption.disabled) handleSelect(selectedOption.id, selectedOption.value);
              }

              // input에 포커스 복귀
              const inputEl = customInputRef.current?.firstChild;
              if (inputEl instanceof HTMLInputElement) {
                inputEl.focus();
                setIsOpen(false);
              }
              break;

            case 'Escape':
              setIsOpen(false);
              setFocusedIndex(null);

              const escInputEl = customInputRef.current?.firstChild;
              if (escInputEl instanceof HTMLInputElement) escInputEl.focus();

              const isValueMatched = parsedOptions.some(
                opt => opt.value === selectedValue && !opt.disabled,
              );
              if (!isValueMatched) {
                setSelectedValue('');
                setSelectedId('');
              } else {
                // disabled가 아닌 옵션 중에서만 찾도록 find도 수정
                const matchedOption = parsedOptions.find(
                  opt => opt.value === selectedValue && !opt.disabled,
                );
                if (matchedOption) setSelectedId(matchedOption.id);
              }
              break;

            case 'Tab':
              const isValueMatchedTab = parsedOptions.some(
                opt => opt.value === selectedValue && !opt.disabled,
              );
              if (!isValueMatchedTab) {
                setSelectedValue('');
                setSelectedId('');
              } else {
                // disabled가 아닌 옵션 중에서만 찾도록 find도 수정
                const matchedOption = parsedOptions.find(
                  opt => opt.value === selectedValue && !opt.disabled,
                );
                if (matchedOption) setSelectedId(matchedOption.id);
              }
              if (isOpen) setIsOpen(false);
              break;
          }
        }
      },
      [
        isOpen,
        filteredOptions,
        focusedIndex,
        handleSelect,
        selectedId,
        selectedValue,
        parsedOptions,
      ],
    );

    // ------------------------------------------------------
    // 🧩 filteredOptionRefs
    // - OptionListChildren 각 OptionItem의 DOM 요소를 참조
    // - 포커스 이동, 키보드 내비게이션 관리용
    // - 렌더링 직전에 useMemo 내에서 초기화 후 재할당
    // ------------------------------------------------------
    const filteredOptionRefs = useRef<HTMLLIElement[]>([]);

    // ------------------------------------------------------
    // 🧩 optionListChildrenWithRef
    // - OptionList 내부 children을 map하여 OptionItem에 필요한 props 주입
    // - index, tabIndex, selected, disabled, value, 이벤트 핸들러(onSelect, onKeyDown) 설정
    // - onMount를 통해 optionRefs에 DOM 요소 저장 → 포커스 관리용
    // - parsedOptions 기반으로 selected/disabled 상태 동기화
    // ------------------------------------------------------
    const optionListChildrenWithRef = useMemo(() => {
      if (filteredOptions.length === 0) {
        // Empty state 처리
        return (
          <li key='empty-state' className='empty-state'>
            <Icon name='search-x' className='icon' strokeLinecap='round' strokeLinejoin='round' />
            <span className='title'>검색 결과가 없습니다.</span>
            <span className='desc'>다른 키워드로 다시 검색해 보세요.</span>
          </li>
        );
      }

      // 렌더링 직전에 refs 초기화
      filteredOptionRefs.current = [];

      return filteredOptions.map((filteredOpt, filteredIndex) => {
        const originalOptionItem = optionItemArr.find(item => item.props.id === filteredOpt.id);
        if (!originalOptionItem) return null;

        // ref 콜백을 사용하여 filteredOptionRefs에 DOM 요소 저장
        const setRef = (el: HTMLLIElement | null) => {
          if (el) {
            // OptionItem이 HTMLLIElement를 참조한다고 가정합니다.
            filteredOptionRefs.current[filteredIndex] = el;
          }
        };

        const selected = filteredOpt.id === selectedId;
        const focused = isOpen && focusedIndex === filteredIndex; // isOpen 조건 추가하여 닫혔을 땐 포커스 클래스 제거

        // 🚨 [핵심 수정 2-1]: focused일 때 0, 아니면 -1을 전달합니다.
        const itemTabIndex = focused ? 0 : -1;

        // [핵심 수정: ref 타입 단언]
        return React.cloneElement(
          originalOptionItem as React.ReactElement<OptionItemProps & { ref: typeof setRef }>,
          {
            key: filteredOpt.id, // React Key 추가
            id: filteredOpt.id,
            index: filteredIndex, // filteredIndex를 전달
            tabIndex: itemTabIndex, // ✅ 동적으로 전달
            selected: selected,
            disabled: !!filteredOpt.disabled,
            value: filteredOpt.value,
            onSelect: handleSelect,
            // [제거] OptionItem에는 onKeyDown이 필요 없습니다.
            // onKeyDown: handleKeyDown,
            // 🚨 [핵심 수정 2-2]: OptionItem에 onKeyDown을 다시 바인딩합니다.
            // 포커스가 Input에서 OptionItem으로 이동하면, OptionItem이 화살표 키를 잡아야 합니다.
            onKeyDown: handleKeyDown,
            ref: setRef,
            className: clsx(originalOptionItem.props.className, focused && 'focused-by-keyboard'),
          },
        );
      });
    }, [
      filteredOptions,
      optionItemArr,
      selectedId,
      focusedIndex,
      handleSelect,
      handleKeyDown,
      isOpen,
    ]);

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
        children: optionListChildrenWithRef,
      });
    }, [optionList, optionListChildrenWithRef, selectedValue, handleSelect, isOpen]);

    // -----------------------------------------------------
    // ♿️ [ARIA] activeDescendant 계산
    // - focusedIndex를 기준으로 현재 키보드 포커스가 있는 옵션 ID 반환
    // - 포커스가 없으면 선택된 옵션(selectedId) ID 반환
    // - 둘 다 없으면 공백 반환
    // - 웹 접근성: aria-activedescendant 속성에 사용
    // -----------------------------------------------------
    const activeDescendant = useMemo(() => {
      // 키보드로 포커스된 옵션 우선 (filteredOptions 기준)
      if (focusedIndex !== null && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
        const opt = filteredOptions[focusedIndex];
        if (opt) return `${opt.id}`;
      }

      // 클릭으로 선택된 옵션 (포커스는 사라졌지만 선택은 유지됨)
      if (selectedId) return `${selectedId}`;

      // 아무것도 없으면 공백
      return '';
    }, [focusedIndex, filteredOptions, selectedId]);

    // -----------------------------------------------------
    // ✨ [Scroll] 드롭다운 열릴 때 선택된 옵션으로 자동 스크롤
    // - isOpen이 true일 때만 실행
    // - 이미 스크롤된 경우(hasScrolledRef) 중복 실행 방지
    // - filteredOptions에서 selectedId에 해당하는 요소를 찾아 scrollIntoView
    // - setTimeout 0ms 사용 → DOM 렌더링 후 스크롤 보장
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) {
        hasScrolledRef.current = false;
        return;
      }

      if (hasScrolledRef.current) return;

      const timeout = setTimeout(() => {
        const selectedIdxInFiltered = filteredOptions.findIndex(opt => opt.id === selectedId);
        if (selectedIdxInFiltered === -1) return;

        const selectedEl = filteredOptionRefs.current[selectedIdxInFiltered];
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'nearest' });
          hasScrolledRef.current = true;
        }
      }, 0);

      return () => clearTimeout(timeout);
    }, [isOpen, selectedId, filteredOptions]);

    // -----------------------------------------------------
    // ✨ [Scroll] focusedIndex 변경 시 스크롤 이동
    // - filteredOptions 기준으로 현재 포커스된 옵션을 찾아 스크롤 이동
    // - isOpen이 true이고 focusedIndex가 존재할 때만 동작
    // - 웹 접근성: 키보드 탐색 시 포커스된 옵션이 항상 보이도록 보장
    // -----------------------------------------------------
    useEffect(() => {
      if (isOpen && focusedIndex !== null) {
        const focusedEl = filteredOptionRefs.current[focusedIndex];
        if (focusedEl) {
          focusedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, [focusedIndex, isOpen, filteredOptions]);

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
    // ✨ [Portal] 외부 클릭 처리
    // - 드롭다운 관련 요소(container + portal) 외부 클릭 감지
    // - 외부 클릭 시 메뉴를 닫고(isOpen=false) 포커스(focusedIndex) 초기화
    // - 선택 값 복원 로직 제거 (Escape 키나 유효성 검사 시만 처리)
    // - 의존성 배열: parsedOptions, selectedValue, selectedId, prevSelectedValue
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
    }, [parsedOptions, selectedValue, selectedId, prevSelectedValue]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={containerRef}
        className={clsx(
          `${styles['combobox']} variant--${variant} color--${color} size--${size}`,
          className,
        )}
      >
        {/* 커스텀 셀렉트 트리거 */}
        <div ref={customInputRef} className='custom-input'>
          <input
            ref={ref}
            id={id}
            className='custom-input-text'
            {...(disabled ? { tabIndex: -1 } : {})}
            disabled={disabled}
            value={selectedValue}
            placeholder={placeholder}
            required={required}
            type='text'
            role='combobox'
            aria-controls={ariaControls}
            aria-activedescendant={isOpen ? activeDescendant : ''}
            aria-expanded={isOpen}
            aria-haspopup='listbox'
            aria-labelledby={ariaLabelledBy}
            onFocus={() => {
              if (!disabled) {
                setPrevSelectedValue(selectedValue);
                setIsOpen(true);
              }
            }}
            onClick={() => {
              if (!isOpen) {
                setPrevSelectedValue(selectedValue);
                setIsOpen(true);
              }
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
          />
          <IconButton
            color={color}
            size={size}
            variant='ghost'
            shape='rounded'
            className='adorned-end'
            type='button'
            disabled={disabled}
            icon={
              <Icon
                name='arrow-down'
                className='icon'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
            onClick={() => {
              setPrevSelectedValue(selectedValue);
              setIsOpen(prev => !prev);
              if (!isOpen) setFocusedIndex(null);
            }}
          />
        </div>

        {/* OptionList */}
        {isOpen && positioned && portalPos && (
          <OptionListPortal isOpen={isOpen} position={portalPos} portalRef={portalRef}>
            {memoizedOptionList}
          </OptionListPortal>
        )}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';

export default Combobox;
