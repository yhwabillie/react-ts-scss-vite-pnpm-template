import { forwardRef, useState, useId } from 'react';
import Styles from '@/components/ui/molecules/Accordion/Accordion.module.scss';
import clsx from 'clsx';
import IconFrame from '../IconFrame/IconFrame';
import Icon from '../../atoms/Icon/Icon';

interface AccordionProps {
  title: string;
  content: string;
  items?: AccordionProps[];
  isNested?: boolean;
  level?: number; // 제목 수준 (1depth 기본값 h3)
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'tertiary';
  defaultOpen?: boolean;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      title,
      content,
      items,
      isNested = false,
      level = 3,
      size = 'md',
      color = 'primary',
      defaultOpen = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const hasChildren = items && items.length > 0;

    // 웹 접근성을 위한 고유 ID 생성
    const headerId = useId();
    const panelId = useId();

    const toggleAccordion = () => setIsOpen(prev => !prev);

    // JSX에서 인식 가능한 문자열 리터럴 타입으로 캐스팅
    const HeadingTag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    return (
      <div
        ref={ref}
        className={clsx(
          `${Styles['accordion']} size--${size} color--${color}`,
          isNested ? 'accordion__nested' : 'is-first',
        )}
      >
        <HeadingTag className='accordion__header'>
          <button
            type='button'
            id={headerId}
            className='accordion__trigger'
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={toggleAccordion}
          >
            <span className='accordion__title'>{title}</span>
            <Icon
              name={isOpen ? 'arrow-up' : 'arrow-down'}
              size='md'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
              className='icon'
            />
          </button>
        </HeadingTag>

        <div
          id={panelId}
          className='accordion__panel'
          role='region'
          aria-labelledby={headerId}
          // 애니메이션 사용 시 hidden 대신 스타일로 제어하는 것이 유리
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <div className='accordion__content-inner'>
            <div className='accordion__content'>{content}</div>

            {/* 재귀적 2depth 렌더링: level을 1 증가시켜 전달 */}
            {hasChildren && (
              <div className='accordion__nested-group'>
                {items.map((item, index) => (
                  <Accordion
                    key={`${item.title}-${index}`}
                    {...item}
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
