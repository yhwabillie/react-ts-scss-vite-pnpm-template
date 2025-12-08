import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import styles from '@/components/ui/molecules/Selectbox/Selectbox.module.scss';
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
  className?: string;
  children: React.ReactNode;
  required?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
};

type SelectboxProps = BaseProps & Omit<React.HTMLAttributes<HTMLSelectElement>, keyof BaseProps>;

const Selectbox = forwardRef<HTMLSelectElement, SelectboxProps>(
  ({ variant, color, size, className, children, required, onValueChange, ...rest }, ref) => {
    /** -------------------------
     * 1) OptionList + OptionItem 추출
     --------------------------*/
    const optionList = React.Children.toArray(children).find(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionListProps> | undefined;

    if (!optionList) return null;

    const optionItemArr = React.Children.toArray(optionList.props.children).filter(child =>
      React.isValidElement(child),
    ) as React.ReactElement<OptionItemProps>[];

    /** -------------------------
     * 2) OptionItem → label / value 변환
     --------------------------*/
    const extractLabelText = (node: React.ReactNode): string => {
      if (node == null) return '';

      if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
      }

      if (Array.isArray(node)) {
        for (const child of node) {
          const found = extractLabelText(child);
          if (found) return found;
        }
        return '';
      }

      if (React.isValidElement(node)) {
        const props: any = node.props ?? {};
        const { className, children } = props;

        if (className === 'label') {
          return extractLabelText(children);
        }

        return extractLabelText(children);
      }

      return '';
    };

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

    /** -------------------------
     * 3) Selectbox 내부에서 선택값 상태 관리
     --------------------------*/
    // value prop이 있으면 controlled, 없으면 내부 state
    const [internalValue, setInternalValue] = useState(parsedOptions[0]?.value ?? '');
    const selectedValue = rest.value ?? internalValue; // controlled mode 지원

    const handleSelect = (value: string) => {
      if (!rest.value) setInternalValue(value); // uncontrolled인 경우 내부 state 업데이트
      onValueChange?.(value); // 부모로 이벤트 전달
    };

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
      handleSelect(e.target.value);
    };

    /** -------------------------
     * 4) 렌더링
     --------------------------*/
    return (
      <div
        className={clsx(
          `${styles['selectbox']} variant--${variant} color--${color} size--${size}`,
          className,
        )}
      >
        {/* 실제 select */}
        <select
          ref={ref}
          {...rest}
          required={required}
          value={selectedValue}
          onChange={handleChange}
        >
          {parsedOptions.map(opt => (
            <option key={opt.key} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* UI 표시부 */}
        <div className='custom-select' tabIndex={0}>
          <span className='custom-select-text'>
            {parsedOptions.find(o => o.value === selectedValue)?.label}
          </span>
        </div>

        {/* OptionList에 선택값 + 선택 이벤트 전달 */}
        {React.cloneElement(optionList, {
          selectedValue: String(selectedValue),
          onOptionSelect: handleSelect,
        })}
      </div>
    );
  },
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;
