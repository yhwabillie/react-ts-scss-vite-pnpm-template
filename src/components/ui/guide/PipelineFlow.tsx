import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Icon from '../atoms/Icon/Icon';
import styles from './ColorPipeline.module.scss';
import clsx from 'clsx';

// 5단계 공정 그리드 컴포넌트
const PipelineFlow = ({ title }: { title?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          end: 'bottom 0%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from('.pipeline-flow__title', {
        y: 10,
        opacity: 0,
        duration: 0.6,
        ease: 'power1.out',
      });

      tl.from(
        '.pipeline-flow__step-list',
        {
          y: 10,
          opacity: 0,
          duration: 0.6,
          ease: 'power1.out',
        },
        '>',
      );

      // ">" 는 이전 애니메이션의 종료 시점을 의미합니다.
      // ">-0.2" 처럼 쓰면 타이틀이 거의 끝나갈 때쯤 카드가 미리 시작하게 할 수도 있습니다.
      tl.fromTo(
        '.pipeline-flow__step',
        {
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power1.out',
          overwrite: 'auto',

          onComplete: () => {
            gsap.set('.pipeline-flow__step', { clearProps: 'all' });
          },
        },
        '>',
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='theme-color-token'
      ref={containerRef}
      className={clsx(styles['pipeline-flow'], 'pipeline-flow__ani-target')}
    >
      {title && <h2 className='pipeline-flow__title'>{title}</h2>}

      <ol className='pipeline-flow__step-list'>
        <li className='pipeline-flow__step'>
          <span className='pipeline-flow__step-dot' aria-hidden>
            <Icon
              name='check'
              strokeWidth={3}
              strokeLinecap='round'
              strokeLinejoin='round'
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
              strokeLinecap='round'
              strokeLinejoin='round'
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
              strokeLinecap='round'
              strokeLinejoin='round'
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
              strokeLinecap='round'
              strokeLinejoin='round'
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
              strokeLinecap='round'
              strokeLinejoin='round'
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
