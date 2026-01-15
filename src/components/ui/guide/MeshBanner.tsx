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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mesh-banner__content > *', {
        y: 50,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'restart reset restart reset',
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
      <div ref={contentRef} className='mesh-banner__content'>
        <h1 className='mesh-banner__title'>{title}</h1>
        <strong className='mesh-banner__sub'>{description}</strong>
        <p className='mesh-banner__desc'>웹 접근성 & 테마 & 다국어를 지원하는 UI 컴포넌트 시스템</p>
      </div>
    </section>
  );
};

export default MeshBanner;
