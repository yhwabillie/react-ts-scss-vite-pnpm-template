import styles from './A11yGuide.module.scss';
import clsx from 'clsx';

interface A11yGuideProps {
  id?: string;
  title?: string;
}

interface A11yAxis {
  icon: string;
  title: string;
  criteria: string;
  tools: React.ReactNode;
}

const A11yGuide = ({ id, title }: A11yGuideProps) => {
  const AXES: A11yAxis[] = [
    {
      icon: '🎨',
      title: '시각적 명확성',
      criteria: 'WCAG 2.1 AA (Contrast 4.5:1)',
      tools: 'Storybook Axe 기반 테스트 수행',
    },
    {
      icon: '⌨️',
      title: '키보드 네비게이션',
      criteria: 'Logical Tab Order & Focus Trap',
      tools: 'Focus-trap 및 논리적 탭 순서 보장',
    },
    {
      icon: '🔊',
      title: '스크린 리더',
      criteria: 'Apple VoiceOver 표준 준수',
      tools: 'Semantic Markup & ARIA Role 적용',
    },
    {
      icon: '📋',
      title: '시스템 표준',
      criteria: 'KRDS 가이드라인 및 WCAG 표준',
      tools: '설계 가이드라인 반영',
    },
  ];

  return (
    <section id={id} className={clsx(styles['a11y-guide'], 'a11y-guide-container')}>
      <h2 className='a11y-guide__title'>{title}</h2>
      <div className='a11y-guide__grid'>
        {AXES.map((axis, index) => (
          <div key={index} className={clsx(`${styles['a11y-card']}`, 'a11y-card-gsap-container')}>
            <h4 className='a11y-card__header'>
              <span>{axis.icon}</span>
              <span>{axis.title}</span>
            </h4>
            <div className='a11y-card__body'>
              <p className='a11y-card__text'>
                <strong className='a11y-card__label'>기준:</strong> {axis.criteria}
              </p>
              <p className='a11y-card__text'>
                <strong className='a11y-card__label'>검증/도구:</strong> {axis.tools}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default A11yGuide;
