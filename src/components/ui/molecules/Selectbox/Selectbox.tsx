import React, { forwardRef, useRef, useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/Selectbox/Selectbox.module.scss';
import type { OptionListProps } from '../OptionList/OptionList';
import type { OptionItemProps } from '../OptionItem/OptionItem';
import Icon from '../../atoms/Icon/Icon';
import type OptionItem from '../OptionItem/OptionItem';

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
  className?: string;
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

type SelectboxProps = BaseProps & Omit<React.HTMLAttributes<HTMLSelectElement>, keyof BaseProps>;

const Selectbox = forwardRef<HTMLSelectElement, SelectboxProps>(
  (
    { variant, color, size, className, children, required, disabled, onValueChange, ...rest },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<HTMLLIElement[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // -----------------------------
    // 외부 클릭 시 닫기
    // -----------------------------
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setFocusedIndex(null);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // -----------------------------
    // OptionList + OptionItem 추출
    // -----------------------------
    const optionList = React.Children.toArray(children).find(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionListProps> | undefined;
    if (!optionList) return null;

    const optionItemArr = React.Children.toArray(optionList.props.children).filter(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionItemProps>[];

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
        return {
          key: idx,
          label: labelText,
          value,
          disabled: item.props['aria-disabled'] === true,
        };
      });
    }, [optionItemArr]);

    // -----------------------------
    // 선택값 상태 관리
    // -----------------------------
    const selectedValue = rest.value ?? internalValue;

    const handleSelect = React.useCallback(
      (value: string) => {
        if (!rest.value) setInternalValue(value);
        onValueChange?.(value);
        setIsOpen(false);
        setFocusedIndex(null);
      },
      [rest.value, onValueChange],
    );

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
      handleSelect(e.target.value);
    };

    // -----------------------------
    // custom-select 포커스 제어 ref
    // -----------------------------
    const customSelectRef = React.useRef<HTMLDivElement>(null);

    // -----------------------------
    // custom-select 포커스 시 첫 옵션 포커싱
    // -----------------------------
    const handleCustomSelectFocus = React.useCallback(() => {
      if (isOpen) {
        const idx = parsedOptions.findIndex(o => o.value === selectedValue && !o.disabled);
        setFocusedIndex(idx >= 0 ? idx : parsedOptions.findIndex(o => !o.disabled));
      }
    }, [isOpen, parsedOptions, selectedValue]);

    // -----------------------------
    // 키보드 이벤트
    // -----------------------------
    const handleKeyDown = React.useCallback(
      <T extends HTMLElement>(e: React.KeyboardEvent<T>) => {
        if (!isOpen) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
            const selectedIdx = parsedOptions.findIndex(
              o => o.value === selectedValue && !o.disabled,
            );
            const firstActiveIdx = parsedOptions.findIndex(o => !o.disabled);
            setFocusedIndex(selectedIdx >= 0 ? selectedIdx : firstActiveIdx);
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
                handleSelect(parsedOptions[focusedIndex].value);
                customSelectRef.current?.focus();
              }
              break;
          }
        }
      },
      [isOpen, parsedOptions, selectedValue, focusedIndex, handleSelect],
    );

    const optionListChildren = useMemo(() => {
      return React.Children.map(optionList.props.children, (child, idx) => {
        if (!React.isValidElement(child)) return child;

        const childTyped = child as React.ReactElement<OptionItemProps>;

        return React.cloneElement(childTyped, {
          tabIndex: -1,
          selected: parsedOptions[idx].value === selectedValue,
          onSelect: handleSelect, // useCallback 적용
          onKeyDown: handleKeyDown, // useCallback 적용
          index: idx,
          onMount: (el: HTMLLIElement | null, index?: number) => {
            if (index !== undefined && optionRefs.current[index] !== el) {
              optionRefs.current[index] = el!;
            }
          },
        });
      });
    }, [optionList.props.children, parsedOptions, selectedValue, handleSelect, handleKeyDown]);

    const memoizedOptionList = useMemo(() => {
      if (!optionList) return null;

      return React.cloneElement(optionList, {
        selectedValue: String(selectedValue),
        onOptionSelect: handleSelect,
        className: clsx(optionList.props.className, isOpen && 'is-show'),
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
        <select
          ref={ref}
          tabIndex={-1}
          {...rest}
          value={selectedValue}
          onChange={handleChange}
          required={required}
          disabled={disabled}
        >
          {parsedOptions.map(opt => (
            <option key={opt.key} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div
          ref={customSelectRef}
          className='custom-select'
          tabIndex={disabled ? -1 : 0}
          onFocus={handleCustomSelectFocus} // tab 포커싱 진입 시
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span className='custom-select-text'>
            {parsedOptions.find(o => o.value === selectedValue)?.label}
          </span>
          <Icon
            name={isOpen ? 'arrow-up' : 'arrow-down'} // 열려있으면 up, 아니면 down
            className='icon'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </div>

        {memoizedOptionList}
      </div>
    );
  },
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;
