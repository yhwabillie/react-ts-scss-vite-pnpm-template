import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Styles from '@/components/ui/guide/MeshBanner.module.scss';

gsap.registerPlugin(ScrollTrigger);

interface MeshBannerProps {
  title?: string;
  description?: string;
}

const MeshBanner = ({
  title = 'UI System Guide',
  description = 'Archive of Accessibility & Theming',
}: MeshBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mesh-banner__content > *', {
        y: 50,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.6,
        stagger: 0.2,
        // ease: 애니메이션의 속도 곡선을 설정, "power1.out"은 부드럽게 가속 후 감속
        ease: 'power1.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          end: 'bottom 0%',
          // toggleActions: 스크롤 이벤트가 발생했을 때 실행할 애니메이션 동작 정의
          // - onEnter: 트리거 영역에 처음 들어올 때 실행되는 동작
          // - onLeave: 트리거 영역을 벗어날 때 실행되는 동작
          // - onEnterBack: 트리거 영역에 다시 들어올 때 실행되는 동작
          // - onLeaveBack: 트리거 영역을 다시 벗어날 때 실행되는 동작
          toggleActions: 'play reverse play reverse',
          // markers: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={Styles['mesh-banner']}>
      <div className='mesh-banner__bg'>
        <div className='mesh-banner__spot--blue' />
        <div className='mesh-banner__spot--purple' />
        <div className='mesh-banner__spot--pink' />
        <div className='mesh-banner__spot--cyan' />
      </div>
      <div className='mesh-banner__content'>
        <h1 className='mesh-banner__title'>{title}</h1>
        <strong className='mesh-banner__sub'>{description}</strong>
        <p className='mesh-banner__desc'>웹 접근성 & 테마 & 다국어를 지원하는 UI 컴포넌트 시스템</p>
      </div>
    </section>
  );
};

export default MeshBanner;
