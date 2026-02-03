import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import Style from './AutoCarousel.module.scss';

import clsx from 'clsx';

import Icon from '../../atoms/Icon/Icon';

import IconButton from '../../molecules/IconButton/IconButton';
import { useCallback, useRef, useState } from 'react';

const AutoCarousel = () => {
  const swiperWrapRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const paginationRef = useRef<HTMLSpanElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlay = () => {
    swiperRef.current?.autoplay.start();
    setIsPlaying(true);
  };

  const handleStop = () => {
    swiperRef.current?.autoplay.stop();
    setIsPlaying(false);
  };

  const updateTabIndex = useCallback((swiper: SwiperInstance) => {
    const root = swiperWrapRef.current;
    if (!root) return;

    // Swiper 내부에서 생성된 slide DOM들(루프면 복제 포함)
    const slides = Array.from(root.querySelectorAll<HTMLElement>('.auto-carousel .swiper-slide'));
    const slideLen = slides.length;

    // 🔹 원본 코드: view_len = this.loopedSlides;
    // loopedSlides는 loop일 때 복제 계산에 쓰이는 값이라 "보이는 개수"로 쓰는 용도로는 애매할 수 있음.
    // 그래도 "그대로" 느낌 내고 싶으면 loopedSlides 우선, 없으면 동적으로 계산.
    const computedViewLen =
      typeof swiper.params.slidesPerView === 'number'
        ? swiper.params.slidesPerView
        : (swiper.slidesPerViewDynamic?.() ?? 1);

    const viewLen = (computedViewLen || 1) as number;

    // 🔹 원본 코드: idx = $(".swiper li.swiper-slide-active").index();
    // Swiper에서 active slide의 인덱스는 activeIndex로 바로 얻는 게 정확함(루프 복제 포함 인덱스).
    const idx = swiper.activeIndex;

    // 1) 전부 tabindex=-1로 초기화 (접근성에 훨씬 안전)
    slides.forEach(slide => {
      const a = slide.querySelector<HTMLAnchorElement>('a');
      if (a) a.setAttribute('tabindex', '-1');
    });

    // 2) 원본 코드의 분기: slideLen > 1 이면 idx부터 viewLen개를 0으로
    if (slideLen > 1) {
      for (let i = 0; i < viewLen; i++) {
        const targetIndex = (idx + i) % slideLen; // 루프/끝 처리
        const a = slides[targetIndex]?.querySelector<HTMLAnchorElement>('a');
        if (a) a.setAttribute('tabindex', '0');
      }
    } else {
      // 슬라이드 1개면 active의 a만 0
      const a = slides[idx]?.querySelector<HTMLAnchorElement>('a');
      if (a) a.setAttribute('tabindex', '0');
    }
  }, []);

  return (
    <div className={clsx(Style['auto-carousel'], 'auto-carousel')}>
      <div className='auto-carousel__title-area'>
        <h3 className='auto-carousel__title'>오토 캐러샐</h3>
        <div className='auto-carousel__controls'>
          <span ref={paginationRef} className='swiper-paination' aria-hidden='true'></span>

          <div className='swiper-btn-controls'>
            <IconButton
              className='swiper-btn-prev'
              color='primary'
              shape='pill'
              size='md'
              variant='outline'
              icon={<Icon name='chevron-left' className='icon' strokeWidth={2.5} />}
            />
            <IconButton
              className='swiper-btn-next'
              color='primary'
              shape='pill'
              size='md'
              variant='outline'
              icon={<Icon name='chevron-right' className='icon' strokeWidth={2.5} />}
            />
          </div>

          {isPlaying ? (
            <IconButton
              type='button'
              onClick={handleStop}
              aria-label='자동 재생 정지'
              className='swiper-btn-stop'
              color='primary'
              shape='pill'
              size='md'
              variant='outline'
              icon={<Icon name='pause' className='icon' strokeWidth={2.5} />}
            />
          ) : (
            <IconButton
              type='button'
              onClick={handlePlay}
              aria-label='자동 재생 시작'
              className='swiper-btn-play'
              color='primary'
              shape='pill'
              size='md'
              variant='outline'
              icon={<Icon name='play' className='icon' strokeWidth={2.5} />}
            />
          )}
        </div>
      </div>
      <div ref={swiperWrapRef} className='auto-carousel__content-area'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={8}
          slidesPerView={1}
          breakpoints={{
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            480: {
              slidesPerView: 2,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 1,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: '.auto-carousel .swiper-btn-prev',
            nextEl: '.auto-carousel .swiper-btn-next',
          }}
          loop={true}
          pagination={{
            type: 'fraction',
            el: paginationRef.current!,
          }}
          onSwiper={swiper => (swiperRef.current = swiper)}
          // init 대체
          onInit={swiper => updateTabIndex(swiper)}
          // 슬라이드 바뀔 때마다 갱신 (원본엔 init만 있었는데 실무에선 꼭 필요)
          onSlideChange={swiper => updateTabIndex(swiper)}
          // loop + 복제 업데이트 후 타이밍 보강
          onAfterInit={swiper => updateTabIndex(swiper)}
          onBeforeInit={(swiper: SwiperInstance) => {
            // ✅ 여기서 pagination el 강제 연결
            swiper.params.pagination = {
              ...(swiper.params.pagination as any),
              el: paginationRef.current,
              type: 'fraction',
            };
          }}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <SwiperSlide key={n} className='auto-carousel__item'>
              <a href='#'>Slide {n}</a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AutoCarousel;
