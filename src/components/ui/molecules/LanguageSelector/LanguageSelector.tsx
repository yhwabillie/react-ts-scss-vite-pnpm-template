import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import styles from '@/components/ui/molecules/LanguageSelector/LanguageSelector.module.scss';
import clsx from 'clsx';
import type { Size, Variant, Color, Shape } from '@/types/design/design-tokens.types';
import type { LanguageSelectItem } from './LanguageSelector.mock';
import Button from '../Button/Button';
import Icon from '../../atoms/Icon/Icon';
import OptionListPortal, { type PortalPosition } from '../OptionListPortal/OptionListPortal';
import { mergeRefs } from '@/utils/option/mergeRefs';

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
    labelText?: string;
  };
  value?: LanguageSelectItem['lang'];
  options?: LanguageSelectItem[];
  onValueChange?: (value: LanguageSelectItem['lang']) => void;
}

const LanguageSelector = forwardRef<HTMLDivElement, LanguageSelectorProps>(
  ({ variant, color, size, className, buttonProps = {}, value, options, onValueChange }, ref) => {
    // buttonProps 구조분해
    const { shape = 'rounded', labelText } = buttonProps;

    // -----------------------------
    // 📌 상태 선언
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [portalPos, setPortalPos] = useState<PortalPosition | null>(null);
    const [positioned, setPositioned] = useState(false);

    // -----------------------------
    // 🧩 Ref 선언
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
    // - customInputRef 또는 containerRef 기준으로 위치 측정
    // - getBoundingClientRect() + window.scrollY/X로 스크롤 반영
    // - top: 요소 하단, left/width: 요소 좌측 및 너비
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

    useEffect(() => {
      if (!isOpen) return;

      // Portal 렌더 후 포커스 이동
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
          aria-haspopup='menu'
          aria-expanded={isOpen}
          startIcon={<Icon name='globe' />}
          endIcon={<Icon name={isOpen ? 'arrow-up' : 'arrow-down'} />}
          onMouseDown={e => {
            e.stopPropagation();
          }}
          onClick={() => {
            toggle();
          }}
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
          {labelText}
        </Button>

        {isOpen && portalPos && (
          <OptionListPortal isOpen={isOpen} position={portalPos} portalRef={portalRef}>
            <div className='drop-menu'>
              <div className='drop-in'>
                <ul className='drop-list' role='menu'>
                  {options?.map((opt, idx) => {
                    const isSelected = opt.lang === value;

                    return (
                      <li key={opt.id}>
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
                        >
                          {opt.value}
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
