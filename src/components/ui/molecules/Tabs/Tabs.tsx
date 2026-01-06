import { useState, useRef, useEffect, useId, forwardRef, useCallback, useMemo } from 'react';
import Styles from '@/components/ui/molecules/Tabs/Tabs.module.scss';
import clsx from 'clsx';
import IconButton from '../IconButton/IconButton';
import Icon from '../../atoms/Icon/Icon';

interface TabItem {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
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

    // 스크롤 위치에 따라 화살표 활성화 여부 판단
    const checkScroll = useCallback(() => {
      const el = tabListRef.current;
      if (el) {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setShowLeftArrow(scrollLeft > 1);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    }, []);

    // 1. 스크롤 로직 개선: 더 정확한 중앙 정렬을 위해 수정
    const scrollToTab = useCallback(
      (index: number, isImmediate = false) => {
        const targetTab = document.getElementById(`${baseId}-tab-${index}`);
        const parent = tabListRef.current;

        if (targetTab && parent) {
          targetTab.scrollIntoView({
            // 빠르게 클릭하거나 드래그 중일 때는 'auto'로 즉시 이동시켜 애니메이션 중첩을 방지
            behavior: isImmediate ? 'auto' : 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      },
      [baseId],
    );

    // 3. activeIndex 감시를 통한 스크롤 강제
    useEffect(() => {
      // 컴포넌트 마운트 시나 activeIndex 변경 시 항상 해당 탭을 화면 안으로 소환
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

    // 2. 키보드 이동 로직 개선
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      let nextIndex = -1;
      if (e.key === 'ArrowRight') nextIndex = (index + 1) % items.length;
      if (e.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length;

      // 방향키 이동 시에는 포커스만 이동 (activeIndex는 그대로)
      if (nextIndex !== -1) {
        e.preventDefault();
        const targetTab = document.getElementById(`${baseId}-tab-${nextIndex}`);
        // { preventScroll: true }를 사용하여 브라우저의 기본 튀는 스크롤을 막고
        // 우리가 정의한 scrollToTab이 작동하게 합니다.
        targetTab?.focus({ preventScroll: true });
        scrollToTab(nextIndex); // 시각적으로만 따라감
      }

      // Enter나 Space를 눌러야 실제 탭이 활성화(Active)됨
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveIndex(index);
      }
    };

    // storybook states 스타일 클래스 적용 - 'pseudo-'로 시작하지 않는 것
    const filteredClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => {
          // 1. 'pseudo-'로 시작하지 않는 일반 클래스는 무조건 통과
          if (!name.startsWith('pseudo-')) return true;

          // 2. 'pseudo-'로 시작하더라도 'pseudo-hover'인 경우는 통과
          return name === 'pseudo-hover';
        })
        .join(' ');
    }, [className]);

    // storybook states 스타일 클래스 적용 - 'pseudo-'로 시작하는 것
    const pseudoClassName = useMemo(() => {
      if (!className) return '';

      return className
        .split(' ')
        .filter(name => name.startsWith('pseudo-')) // ✅ pseudo-로 시작
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
                  // onClick 대신 onMouseDown을 쓰면 클릭이 완료되기 전(스크롤 발생 전)에 상태를 선점합니다.
                  onMouseDown={e => {
                    // 마우스 왼쪽 버튼 클릭 시에만 동작
                    if (e.button === 0) {
                      setActiveIndex(index);
                      scrollToTab(index, true); // 빠른 반응을 위해 즉시 이동(auto)
                    }
                  }}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => {
                    // 핵심: 브라우저의 기본 포커스 스크롤을 방지하고 우리 로직으로 대체
                    // 단, 키보드 접근성(Tab 키 등)을 위해 scrollToTab은 호출해줍니다.
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
