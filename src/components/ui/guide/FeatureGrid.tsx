import styles from './FeatureGrid.module.scss';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface FeatureItem {
  emoji: string;
  title: string;
  description: string;
  href: string;
}

const FEATURES: FeatureItem[] = [
  {
    emoji: '📦',
    title: '43개 컴포넌트',
    description: '실무에서 가장 많이 사용했던 Form, Layout, Display 관련 컴포넌트 아카이빙',
    href: '#component-inventory',
  },
  {
    emoji: '🎨',
    title: '테마 컬러 토큰 자동화',
    description: '5단계 파이프라인으로 컬러 추출 & 동기화 자동화',
    href: '#theme-color-token',
  },
  {
    emoji: '⚡',
    title: 'SCSS Module',
    description: 'BEM + 모듈 캡슐화로 클래스 오염 원천 차단',
    href: '#scss-module',
  },
  {
    emoji: '♿',
    title: '웹 접근성',
    description: 'WCAG 2.1 AA 표준 + VoiceOver 최적화 및 키보드 포커싱 스크립트 적용',
    href: '#a11y',
  },
  {
    emoji: '🌍',
    title: '다국어 & 테마',
    description: '여러 테마 및 다국어 환경에서 컴포넌트 동작 동시 테스트',
    href: '#theme',
  },

  {
    emoji: '📕',
    title: '한 곳에서 관리',
    description: 'Storybook으로 모든 컴포넌트 상태 & 케이스 테스트',
    href: '#requirements',
  },
];

const FeatureGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-grid__title', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'restart reset restart reset',
        },
      });

      gsap.fromTo(
        '.feature-card',
        {
          y: 10,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',

          onComplete: () => {
            gsap.set('.feature-card', { y: 0, opacity: 1 });
          },

          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'restart reset restart reset',
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // 세로 방향 중앙 정렬
          inline: 'nearest', // 가로 방향은 가장 가까운 곳으로
        });

        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <section ref={containerRef} className={styles['feature-grid']}>
      <h2 className='feature-grid__title'>한눈에 보기</h2>
      <div className='feature-grid__list'>
        {FEATURES.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className='feature-card'
            onClick={e => handleScroll(e, item.href)}
          >
            <h3 className='feature-card__title'>
              {item.emoji} {item.title}
            </h3>
            <p className='feature-card__desc'>{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
