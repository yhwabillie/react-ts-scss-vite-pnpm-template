import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import styles from '@/components/ui/molecules/LanguageSelector/LanguageSelector.module.scss';
import clsx from 'clsx';
import type { Size, Variant, Color, Shape } from '@/types/design/design-tokens.types';
import type { LanguageSelectItem } from './LanguageSelector.mock';
import Button from '../Button/Button';
import Icon from '../../atoms/Icon/Icon';
import OptionListPortal, { type PortalPosition } from '../OptionListPortal/OptionListPortal';
import { mergeRefs } from '@/utils/option/mergeRefs';
import IconFrame from '../IconFrame/IconFrame';

interface StyleProps {
  variant: Variant;
  color: Color;
  size: Size;
}

type NativeDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof StyleProps>;

interface LanguageSelectorProps extends StyleProps, NativeDivProps {
  id?: string;
  buttonProps?: {
    shape?: Shape;
  };
  value?: LanguageSelectItem['lang'];
  options?: LanguageSelectItem[];
  onValueChange?: (value: LanguageSelectItem['lang']) => void;
}

const LanguageSelector = forwardRef<HTMLDivElement, LanguageSelectorProps>(
  ({ variant, color, size, className, buttonProps = {}, value, options, onValueChange }, ref) => {
    const { shape = 'rounded' } = buttonProps;

    const selectedOption = options?.find(opt => opt.lang === value);
    const buttonLabel = selectedOption ? selectedOption.value : 'Language';

    // -----------------------------
    // 📌 상태
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);

    // -----------------------------
    // 🧩 Ref
    // -----------------------------
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const portalRef = useRef<HTMLDivElement | null>(null);
    const firstItemRef = useRef<HTMLAnchorElement | null>(null);
    const nextFocusRef = useRef<HTMLElement | null>(null);

    const toggle = useCallback(() => {
      setIsOpen(prev => !prev);
    }, []);

    function getNextFocusable(from: HTMLElement): HTMLElement | null {
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
          ].join(','),
        ),
      ).filter(el => el.offsetParent !== null);

      const index = focusable.indexOf(from);
      return focusable[index + 1] ?? null;
    }

    const handleSelect = useCallback(
      (lang: LanguageSelectItem['lang']) => {
        onValueChange?.(lang);
        setIsOpen(false);
        buttonRef.current?.focus();
      },
      [onValueChange],
    );

    // -----------------------------------------------------
    // 🔧 [Portal] 위치 계산
    // -----------------------------------------------------
    const updatePosition = useCallback(() => {
      if (!isOpen) return null;

      const el = buttonRef.current ?? containerRef.current;
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
      if (!target) return;

      // 1. 컨테이너(버튼 포함) 내부 클릭인지 확인
      const isInsideContainer = containerRef.current?.contains(target);

      // 2. 포털(옵션 리스트) 내부 클릭인지 확인
      const isInsidePortal = portalRef.current?.contains(target);

      // 둘 다 아니라면 닫기
      if (!isInsideContainer && !isInsidePortal) {
        setIsOpen(false);
      }
    }, []);

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
    // ✨ [Effect] Portal 위치 초기화
    // -----------------------------------------------------
    useEffect(() => {
      if (!isOpen) {
        setPortalPos(null);
        return;
      }

      const pos = updatePosition();
      if (pos) {
        setPortalPos(pos);
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

    useEffect(() => {
      if (!isOpen) return;

      requestAnimationFrame(() => {
        firstItemRef.current?.focus();
      });
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;
      if (!buttonRef.current) return;

      nextFocusRef.current = getNextFocusable(buttonRef.current);
    }, [isOpen]);

    // -----------------------------
    // ▶️ 렌더링
    // -----------------------------
    return (
      <div
        ref={mergeRefs(containerRef, ref)}
        className={clsx(
          `${styles['language-selector']} variant--${variant} color--${color} size--${size}`,
          className,
        )}
      >
        <Button
          ref={buttonRef}
          variant={variant}
          color={color}
          size={size}
          shape={shape}
          aria-label={`언어 선택 (현재: ${buttonLabel})`}
          aria-haspopup='menu'
          aria-expanded={isOpen}
          startIcon={
            <IconFrame size={size} color={color} shape={shape}>
              <Icon name='globe' strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round' />
            </IconFrame>
          }
          endIcon={
            <IconFrame size={size} color={color} shape={shape}>
              <Icon
                name={isOpen ? 'arrow-up' : 'arrow-down'}
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </IconFrame>
          }
          onMouseDown={e => {
            e.stopPropagation();
          }}
          onClick={toggle}
          onKeyDown={e => {
            if (e.key === 'Tab' && isOpen) {
              e.preventDefault();
              firstItemRef.current?.focus();
            }

            // (옵션) Enter / Space로도 열기
            if ((e.key === 'Enter' || e.key === ' ') && !isOpen) {
              e.preventDefault();
              setIsOpen(true);
            }

            if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
            }
          }}
        >
          {buttonLabel}
        </Button>

        {isOpen && portalPos && (
          <OptionListPortal isOpen={isOpen} position={portalPos} portalRef={portalRef}>
            <div
              className={clsx(
                `${styles['drop-down-menu']} variant--${variant} color--${color} size--${size}`,
              )}
            >
              <div className='drop-down-menu-container'>
                <ul className='drop-list' role='menu'>
                  {options?.map((opt, idx) => {
                    const isSelected = opt.lang === value;

                    return (
                      <li key={opt.id} className='drop-list-item'>
                        <a
                          ref={idx === 0 ? firstItemRef : undefined}
                          role='menuitemradio'
                          aria-checked={isSelected}
                          href={opt.href}
                          target={opt.target}
                          rel={
                            opt.target === '_blank' ? (opt.rel ?? 'noopener noreferrer') : undefined
                          }
                          lang={opt.lang}
                          className={clsx({
                            'is-selected': isSelected,
                          })}
                          onKeyDown={e => {
                            if (e.key === 'Tab' && !e.shiftKey && idx === options.length - 1) {
                              e.preventDefault();
                              setIsOpen(false);
                              nextFocusRef.current?.focus();
                            }

                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsOpen(false);
                              buttonRef.current?.focus();
                            }
                          }}
                          onClick={e => {
                            // Storybook: 이동 대신 상태 변경
                            e.preventDefault();
                            handleSelect(opt.lang);
                          }}
                        >
                          <span className='drop-list-item-label' lang={opt.lang}>
                            {opt.value}
                          </span>

                          {isSelected && (
                            <Icon
                              name='round-check'
                              className='icon'
                              strokeWidth={3}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </OptionListPortal>
        )}
      </div>
    );
  },
);

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;
