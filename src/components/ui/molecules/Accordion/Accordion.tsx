import { forwardRef, useState, useId } from 'react';
import Styles from '@/components/ui/molecules/Accordion/Accordion.module.scss';
import clsx from 'clsx';

interface AccordionProps {
  title: string;
  content: string;
  children?: AccordionProps[];
  isNested?: boolean;
  level?: number; // 제목 수준 (1depth 기본값 h3)
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ title, content, children, isNested = false, level = 3 }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = children && children.length > 0;

    // 웹 접근성을 위한 고유 ID 생성
    const headerId = useId();
    const panelId = useId();

    const toggleAccordion = () => setIsOpen(prev => !prev);

    // TS 에러 해결: JSX에서 인식 가능한 문자열 리터럴 타입으로 캐스팅
    const HeadingTag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    return (
      <div ref={ref} className={clsx(Styles['accordion'], isNested && Styles['nested'])}>
        <HeadingTag className={Styles['accordion-header']}>
          <button
            type='button'
            id={headerId}
            className={Styles['accordion-trigger']}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={toggleAccordion}
          >
            <span className={Styles['title']}>{title}</span>
            {/* 시각적 아이콘은 스크린 리더에서 무시 */}
            <span className={clsx(Styles['icon'], isOpen && Styles['rotate'])} aria-hidden='true'>
              ▼
            </span>
          </button>
        </HeadingTag>

        <div
          id={panelId}
          className={Styles['accordion-panel']}
          role='region'
          aria-labelledby={headerId}
          // 애니메이션 사용 시 hidden 대신 스타일로 제어하는 것이 유리
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <div className={Styles['content-inner']}>
            <div className={Styles['text-content']}>{content}</div>

            {/* 재귀적 2depth 렌더링: level을 1 증가시켜 전달 */}
            {hasChildren && (
              <div className={Styles['nested-group']}>
                {children.map((child, index) => (
                  <Accordion
                    key={`${child.title}-${index}`}
                    {...child}
                    isNested={true}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';

export default Accordion;
