import { useState, useRef, useEffect, useId, forwardRef, useCallback, useMemo } from 'react';
import Styles from '@/components/ui/molecules/Tabs/Tabs.module.scss';
import clsx from 'clsx';
import IconButton from '../IconButton/IconButton';
import Icon from '../../atoms/Icon/Icon';

export interface TabItem {
  title: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  variant?: 'solid' | 'outline' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    { items, defaultIndex = 0, size = 'md', color = 'primary', variant = 'solid', className },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const tabListRef = useRef<HTMLDivElement>(null);
    const baseId = useId();

    // 스크롤 위치에 따라 화살표 노출 여부 판단
    const checkScroll = useCallback(() => {
      const el = tabListRef.current;
      if (el) {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setShowLeftArrow(scrollLeft > 1);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    }, []);

    // 탭을 중앙 근처로 스크롤 이동
    const scrollToTab = useCallback(
      (index: number, isImmediate = false) => {
        const targetTab = document.getElementById(`${baseId}-tab-${index}`);
        const parent = tabListRef.current;

        if (targetTab && parent) {
          targetTab.scrollIntoView({
            behavior: isImmediate ? 'auto' : 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      },
      [baseId],
    );

    // activeIndex 변경 시 선택 탭 노출
    useEffect(() => {
      scrollToTab(activeIndex);
    }, [activeIndex, scrollToTab]);

    useEffect(() => {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }, [checkScroll]);

    const handleScroll = (direction: 'left' | 'right') => {
      if (tabListRef.current) {
        const scrollAmount = 200;
        tabListRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
        // 애니메이션 이후 체크
        setTimeout(checkScroll, 350);
      }
    };

    // 키보드 이동: 포커스만 이동, Enter/Space로 확정
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      let nextIndex = -1;
      if (e.key === 'ArrowRight') nextIndex = (index + 1) % items.length;
      if (e.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length;

      if (nextIndex !== -1) {
        e.preventDefault();
        const targetTab = document.getElementById(`${baseId}-tab-${nextIndex}`);
        targetTab?.focus({ preventScroll: true });
        scrollToTab(nextIndex);
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveIndex(index);
      }
    };

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
        .filter(name => name.startsWith('pseudo-'))
        .join(' ');
    }, [className]);

    return (
      <div
        ref={ref}
        className={clsx(
          `${Styles['tabs']} variant--${variant} size--${size} color--${color}`,
          filteredClassName,
        )}
      >
        <div className='tabs__scroll-area'>
          <IconButton
            variant='outline'
            size='xs'
            shape='pill'
            color='primary'
            type='button'
            aria-label='이전 탭 보기'
            className={clsx('tabs__scroll-btn', Styles['left'])}
            onClick={() => showLeftArrow && handleScroll('left')}
            aria-disabled={!showLeftArrow}
            icon={
              <Icon
                className='icon'
                name='chevron-left'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />

          <div ref={tabListRef} className='tabs__list-area' onScroll={checkScroll}>
            <div role='tablist' aria-label='메뉴 선택' className='tabs__list'>
              {items.map((item, index) => (
                <button
                  key={index}
                  role='tab'
                  id={`${baseId}-tab-${index}`}
                  className={clsx(
                    'tabs__tab-item',
                    activeIndex === index && 'active',
                    index === 2 && pseudoClassName,
                  )}
                  aria-selected={activeIndex === index}
                  tabIndex={activeIndex === index ? 0 : -1}
                  onMouseDown={e => {
                    if (e.button === 0) {
                      setActiveIndex(index);
                      scrollToTab(index, true);
                    }
                  }}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => {
                    scrollToTab(index);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <IconButton
            variant='outline'
            size='xs'
            shape='pill'
            color='primary'
            type='button'
            aria-label='다음 탭 보기'
            className={clsx('tabs__scroll-btn', Styles['right'])}
            onClick={() => showRightArrow && handleScroll('right')}
            aria-disabled={!showRightArrow}
            icon={
              <Icon
                className='icon'
                name='chevron-right'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            }
          />
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            role='tabpanel'
            id={`${baseId}-panel-${index}`}
            aria-labelledby={`${baseId}-tab-${index}`}
            className='tabs__panel'
            hidden={activeIndex !== index}
            tabIndex={0}
          >
            {item.content}
          </div>
        ))}
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';
export default Tabs;
