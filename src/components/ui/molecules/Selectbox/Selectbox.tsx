import React, { forwardRef, useState } from 'react';
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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const optionRefs = React.useRef<HTMLLIElement[]>([]); // optionItem ref 배열
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // -----------------------------
    // 외부 클릭 시 닫기
    // -----------------------------
    React.useEffect(() => {
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
    const extractLabelText = (node: React.ReactNode): string => {
      if (!node) return '';
      if (typeof node === 'string' || typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractLabelText).find(Boolean) ?? '';
      if (React.isValidElement(node)) {
        const props: any = node.props ?? {};
        if (props.className === 'label') return extractLabelText(props.children);
        return extractLabelText(props.children);
      }
      return '';
    };

    // placeholder가 없으면 optionRefs[0]가 실제 첫 옵션과 항상 일치
    const parsedOptions = optionItemArr.map((item, idx) => {
      const labelText = extractLabelText(item.props.children);
      const value = item.props.value ?? labelText;
      return {
        key: idx,
        label: labelText,
        value,
        disabled: item.props['aria-disabled'] === true,
      };
    });

    // -----------------------------
    // 선택값 상태 관리
    // -----------------------------
    const selectedValue = rest.value ?? internalValue;

    const handleSelect = (value: string) => {
      if (!rest.value) setInternalValue(value);
      onValueChange?.(value);
      setIsOpen(false);
      setFocusedIndex(null);
    };

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
    const handleCustomSelectFocus = () => {
      if (isOpen) {
        // selectedValue가 있으면 해당 옵션, 없으면 첫 번째 활성 옵션
        const idx = parsedOptions.findIndex(o => o.value === selectedValue && !o.disabled);
        setFocusedIndex(idx >= 0 ? idx : parsedOptions.findIndex(o => !o.disabled));
      }
    };

    // -----------------------------
    // 키보드 이벤트
    // -----------------------------
    const handleKeyDown = <T extends HTMLElement>(e: React.KeyboardEvent<T>) => {
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
    };

    // -----------------------------
    // 포커싱 효과
    // -----------------------------
    React.useEffect(() => {
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

        {React.cloneElement(optionList, {
          selectedValue: String(selectedValue),
          onOptionSelect: handleSelect,
          className: clsx(optionList.props.className, isOpen && 'is-show'),
          children: React.Children.map(optionList.props.children, (child, idx) => {
            if (!React.isValidElement(child)) return child;

            const childTyped = child as React.ReactElement<
              OptionItemProps & { ref?: React.Ref<HTMLLIElement> },
              typeof OptionItem
            >;

            return React.cloneElement(childTyped, {
              ref: (el: HTMLLIElement | null) => {
                optionRefs.current[idx] = el!;
              },
              tabIndex: -1, // S에서 focus 가능하도록
              onKeyDown: handleKeyDown, // li에서 키보드 이벤트 처리
            });
          }),
        })}
      </div>
    );
  },
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;
