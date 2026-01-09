import Styles from '@/components/ui/molecules/Chip/Chip.module.scss';
import clsx from 'clsx';
import type React from 'react';
import Icon from '../../atoms/Icon/Icon';
import { forwardRef } from 'react';

// static -> div (정적 기능 = badge, tag와 동일 : 모두 사용자가 클릭해서 무언가를 실행하는 것이 아니라, 정보를 **'시각적으로 분류'**하거나 **'상태를 표시'**하는 데 목적)
// tag 컴포넌트가 인터랙션을 넣는 경우는 거의 a태그 (네비게이션의 성격이 강함)

// input -> div + 닫기 버튼
// choice -> button 태그 (라디오)
// filter -> button 태그 (체크박스)
// action -> a 호은 button 태그 (링크 및 다른 액션)

interface ChipProps {
  role?: 'static' | 'choice' | 'filter' | 'input' | 'action';
  variant?: 'solid' | 'outline';
  shape?: 'square' | 'rounded' | 'pill';
  size?: 'sm' | 'md';
  color?: 'primary' | 'secondary' | 'tertiary';
  label?: string;
  href?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  title?: string;
  target?: '_blank';
  className?: string;
}

const Chip = forwardRef<HTMLElement, ChipProps>((props, ref) => {
  const {
    role = 'static',
    variant = 'solid',
    shape = 'rounded',
    size = 'md',
    color = 'primary',
    label,
    href,
    startIcon,
    endIcon,
    selected,
    disabled,
    onSelect,
    onDelete,
    title,
    target,
    className,
    ...rest // 나머지 속성(ARIA 등)을 안전하게 받기 위함
  } = props;

  const isAction = role === 'action';
  const isLink = isAction && !!href;

  // 1. 태그 결정
  let Tag: any = 'span';
  if (role === 'input') Tag = 'div';
  else if (isLink) Tag = 'a';
  else if (role !== 'static') Tag = 'button';

  // 2. 접근성 속성 정교화
  const accessibilityProps = {
    ...(role === 'choice' && {
      role: 'radio' as const,
      'aria-checked': selected,
      onClick: onSelect,
    }),
    ...(role === 'filter' && {
      'aria-pressed': selected,
      onClick: onSelect,
    }),
    ...(isLink && {
      href: !disabled ? href : undefined,
      target,
      rel: target === '_blank' ? 'noopener noreferrer' : undefined,
      title,
    }),
    ...(Tag === 'button' &&
      role !== 'choice' &&
      role !== 'filter' && {
        type: 'button' as const,
        onClick: onSelect,
        disabled,
        title,
        ...(role === 'action' && { 'aria-pressed': selected }),
      }),
    ...(role === 'input' && {
      role: 'group' as const,
      tabIndex: -1, // 칩 자체는 포커스를 받지 않음 (내부 삭제 버튼이 받음)
      onClick: onSelect,
      title,
    }),
  };

  return (
    <Tag
      ref={ref}
      className={clsx(
        `${Styles['chip']} variant--${variant} shape--${shape} color--${color} size--${size}`,
        {
          'is-selected': selected, // 스타일용 클래스는 유지
          'is-input': role === 'input',
          'is-disabled': disabled,
        },
        className,
      )}
      aria-disabled={disabled}
      {...accessibilityProps}
      {...rest}
    >
      {startIcon}
      <span className='chip__label'>{label}</span>

      {role === 'input' && onDelete ? (
        <button
          type='button'
          className='chip__delete-btn'
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`${label} 삭제`}
          disabled={disabled}
        >
          <Icon
            name='x'
            className='icon'
            strokeWidth={2.5}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </button>
      ) : (
        endIcon
      )}
    </Tag>
  );
});

export default Chip;
