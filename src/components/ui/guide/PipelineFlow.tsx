import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Icon from '../atoms/Icon/Icon';
import styles from './ColorPipeline.module.scss';

// 5단계 공정 그리드 컴포넌트
const PipelineFlow = ({ title }: { title?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // gsap 애니메이션
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 제목
      gsap.from('.pipeline-flow__title', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        },
      });

      gsap.from('.pipeline-flow__step-list', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 10%',
          toggleActions: 'play none none reset',
        },
      });

      gsap.fromTo(
        '.pipeline-flow__step',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pipeline-flow__step-list',
            start: 'top 0%',
            toggleActions: 'play none none reset',
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id='theme-color-token' ref={containerRef} className={styles['pipeline-flow']}>
      {title && <h2 className='pipeline-flow__title'>{title}</h2>}

      <ol className='pipeline-flow__step-list'>
        <li className='pipeline-flow__step'>
          <span className='pipeline-flow__step-dot' aria-hidden>
            <Icon
              name='check'
              strokeWidth={3}
              stroke-linecap='round'
              stroke-linejoin='round'
              className='icon'
            />
          </span>
          <span className='pipeline-flow__step-title'>1단계</span>
          <span className='pipeline-flow__step-desc'>HSL 기반 자동 분류</span>
        </li>
        <li className='pipeline-flow__step'>
          <span className='pipeline-flow__step-dot' aria-hidden>
            <Icon
              name='check'
              strokeWidth={3}
              stroke-linecap='round'
              stroke-linejoin='round'
              className='icon'
            />
          </span>
          <span className='pipeline-flow__step-title'>2단계</span>
          <span className='pipeline-flow__step-desc'>명도 기반 스텝 생성</span>
        </li>
        <li className='pipeline-flow__step'>
          <span className='pipeline-flow__step-dot' aria-hidden>
            <Icon
              name='check'
              strokeWidth={3}
              stroke-linecap='round'
              stroke-linejoin='round'
              className='icon'
            />
          </span>
          <span className='pipeline-flow__step-title'>3단계</span>
          <span className='pipeline-flow__step-desc'>
            역방향 참조 <br /> (Hex-to-Var)
          </span>
        </li>
        <li className='pipeline-flow__step'>
          <span className='pipeline-flow__step-dot' aria-hidden>
            <Icon
              name='check'
              strokeWidth={3}
              stroke-linecap='round'
              stroke-linejoin='round'
              className='icon'
            />
          </span>
          <span className='pipeline-flow__step-title'>4단계</span>
          <span className='pipeline-flow__step-desc'>다중 테마 자동 지원</span>
        </li>
        <li className='pipeline-flow__step'>
          <span className='pipeline-flow__step-dot' aria-hidden>
            <Icon
              name='check'
              strokeWidth={3}
              stroke-linecap='round'
              stroke-linejoin='round'
              className='icon'
            />
          </span>
          <span className='pipeline-flow__step-title'>5단계</span>
          <span className='pipeline-flow__step-desc'>자동 문서화</span>
        </li>
      </ol>
    </section>
    // <section className={styles['pipeline-flow']}>
    //   {title && <h2 className='pipeline-flow__title'>{title}</h2>}
    //   <div className='pipeline-flow__container'>
    //     {steps.map((step, i) => (
    //       <div key={i} className={styles['pipeline-flow__step']}>
    //         <div className={styles['pipeline-flow__num']}>{step.num}</div>
    //         <div className={styles['pipeline-flow__title']}>{step.title}</div>
    //         <div className={styles['pipeline-flow__desc']}>{step.desc}</div>
    //       </div>
    //     ))}
    //   </div>
    // </section>
  );
};

export default PipelineFlow;
