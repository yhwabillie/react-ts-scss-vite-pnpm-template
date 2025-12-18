import { useState, useRef, useEffect, useId, forwardRef, useCallback } from 'react';
import Styles from '@/components/ui/molecules/Tabs/Tabs.module.scss';
import clsx from 'clsx';

interface TabItem {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(({ items, defaultIndex = 0 }, ref) => {
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

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % items.length;
    if (e.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length;

    if (nextIndex !== -1) {
      setActiveIndex(nextIndex);
      const targetTab = document.getElementById(`${baseId}-tab-${nextIndex}`);
      targetTab?.focus();
      targetTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div ref={ref} className={Styles['tabs-container']}>
      <div className={Styles['tab-controls-wrapper']}>
        {/* 왼쪽 화살표: 제거하지 않고 disabled로 상태 제어 */}
        <button
          type='button'
          className={clsx(Styles['scroll-button'], Styles['left'])}
          onClick={() => showLeftArrow && handleScroll('left')} // 상태 체크 후 실행
          aria-disabled={!showLeftArrow} // 실제 disabled 대신 사용
          aria-label='이전 탭 보기'
        >
          &lt;
        </button>

        <div className={Styles['tab-list-viewport']} ref={tabListRef} onScroll={checkScroll}>
          <div role='tablist' aria-label='메뉴 선택' className={Styles['tab-list']}>
            {items.map((item, index) => (
              <button
                key={index}
                role='tab'
                id={`${baseId}-tab-${index}`}
                className={clsx(Styles['tab-button'], activeIndex === index && Styles['active'])}
                aria-selected={activeIndex === index}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={activeIndex === index ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={e => handleKeyDown(e, index)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* 오른쪽 화살표: 포커스 유실 방지를 위해 DOM 유지 */}
        <button
          type='button'
          className={clsx(Styles['scroll-button'], Styles['right'])}
          onClick={() => showRightArrow && handleScroll('right')} // 상태 체크 후 실행
          aria-disabled={!showRightArrow} // 실제 disabled 대신 사용
          aria-label='다음 탭 보기'
        >
          &gt;
        </button>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          role='tabpanel'
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          className={Styles['tab-panel']}
          hidden={activeIndex !== index}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
});

Tabs.displayName = 'Tabs';
export default Tabs;
