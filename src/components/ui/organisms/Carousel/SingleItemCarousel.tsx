import { useRef, useState, type FocusEvent } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperRoot, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Style from './SingleItemCarousel.module.scss';
import clsx from 'clsx';

const SingleItemCarousel = () => {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const lastFocusedSlideIndex = useRef<number | null>(null);
  const lastUserActiveIndexRef = useRef(0);
  const isResizingRef = useRef(false);
  const resizeTimerRef = useRef<number | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const slideItems = [
    { title: '아이템1', logo: '아이템1 로고' },
    { title: '아이템2', logo: '아이템2 로고' },
    { title: '아이템3', logo: '아이템3 로고' },
    { title: '아이템4', logo: '아이템4 로고' },
  ];

  const isMobileViewport = () => window.matchMedia('(max-width: 480px)').matches;

  const getSlidesPerViewForViewport = (swiper: SwiperInstance) => {
    const perView = swiper.params.slidesPerView;
    if (typeof perView === 'number') return perView;

    if (isMobileViewport()) return 1;
    if (window.matchMedia('(max-width: 767px)').matches) return 2;
    return 3;
  };

  const clampStartIndex = (swiper: SwiperInstance, index: number) => {
    const perView = getSlidesPerViewForViewport(swiper);
    const maxStartIndex = Math.max(swiper.slides.length - perView, 0);
    if (index < 0) return 0;
    if (index > maxStartIndex) return maxStartIndex;
    return index;
  };

  const updateEdgeState = (swiper: SwiperInstance, activeIndex = swiper.activeIndex) => {
    if (isMobileViewport()) {
      const perView = getSlidesPerViewForViewport(swiper);
      const maxStartIndex = Math.max(swiper.slides.length - perView, 0);
      setIsBeginning(activeIndex <= 0);
      setIsEnd(activeIndex >= maxStartIndex);
    } else {
      setIsBeginning(false);
      setIsEnd(false);
    }
  };

  const applyTranslateForIndex = (swiper: SwiperInstance, index: number) => {
    if (swiper.destroyed) return;
    const slide = swiper.slides[index] as HTMLElement | undefined;
    const spaceBetween =
      typeof swiper.params.spaceBetween === 'number' ? swiper.params.spaceBetween : 0;
    const width = slide?.getBoundingClientRect().width ?? 0;
    const step = width + spaceBetween;
    const translate = -(step * index);

    const wrapperEl = swiper.wrapperEl as HTMLElement;
    wrapperEl.style.transform = `translate3d(${translate}px, 0px, 0px)`;
    wrapperEl.style.transitionDuration = '0ms';
    wrapperEl.style.transitionDelay = '0ms';

    swiper.slides.forEach((item, itemIndex) => {
      item.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next');
      if (itemIndex === index) item.classList.add('swiper-slide-active');
      if (itemIndex === index - 1) item.classList.add('swiper-slide-prev');
      if (itemIndex === index + 1) item.classList.add('swiper-slide-next');
    });

    swiper.activeIndex = index;
    swiper.realIndex = index;
    swiper.previousIndex = index - 1;
  };

  const slideToIndex = (swiper: SwiperInstance, index: number) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applyTranslateForIndex(swiper, index);
        isResizingRef.current = false;
      });
    });
  };

  const handleFocusCapture = (event: FocusEvent<HTMLElement>) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const slideEl = (event.target as HTMLElement).closest('.swiper-slide') as HTMLElement | null;
    if (!slideEl) return;

    const dataIndex = Number(slideEl.getAttribute('data-slide-index'));
    const nextIndex = Number.isFinite(dataIndex) ? dataIndex : swiper.slides.indexOf(slideEl);
    if (nextIndex < 0) return;
    if (lastFocusedSlideIndex.current === nextIndex) return;

    lastFocusedSlideIndex.current = nextIndex;
    lastUserActiveIndexRef.current = nextIndex;
    updateEdgeState(swiper, nextIndex);

    const isWideViewport = window.matchMedia('(min-width: 481px)').matches;
    if (!isWideViewport) return;

    if (swiper.slidesGrid.length === 0) {
      swiper.update();
    }

    swiper.slideTo(nextIndex, 0);
  };

  const isMobile = isMobileViewport();

  return (
    <div
      className={clsx(Style['single-item-carousel'], 'single-item-carousel')}
      onFocusCapture={handleFocusCapture}
    >
      <div className='single-item-carousel__title-area'>
        <h3 className='single-item-carousel__title'>캐러샐 타이틀</h3>
      </div>
      <div className='single-item-carousel__content-area'>
        <button
          type='button'
          className={clsx('swiper-button-prev', {
            'swiper-button-disabled': isMobile && isBeginning,
          })}
          disabled={isMobile && isBeginning}
        >
          prev
        </button>
        <SwiperRoot
          id='single-item-carousel-swiper'
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: '.single-item-carousel .swiper-button-prev',
            nextEl: '.single-item-carousel .swiper-button-next',
          }}
          slidesPerView={3}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            481: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
          }}
          spaceBetween={8}
          loop={false}
          observer
          observeParents
          slidesOffsetBefore={0}
          autoHeight
          onSwiper={instance => {
            swiperRef.current = instance;
            lastUserActiveIndexRef.current = instance.activeIndex;
            updateEdgeState(instance);
          }}
          onSlideChange={instance => {
            if (!isResizingRef.current) {
              lastUserActiveIndexRef.current = instance.activeIndex;
            }
            updateEdgeState(instance);
          }}
          onBeforeResize={instance => {
            isResizingRef.current = true;
          }}
          onResize={instance => {
            isResizingRef.current = true;
            updateEdgeState(instance);

            if (resizeTimerRef.current !== null) {
              window.clearTimeout(resizeTimerRef.current);
            }

            resizeTimerRef.current = window.setTimeout(() => {
              const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
              slideToIndex(instance, targetIndex);
            }, 120);

            const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
            applyTranslateForIndex(instance, targetIndex);
          }}
          onBreakpoint={instance => {
            updateEdgeState(instance);

            const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
            slideToIndex(instance, targetIndex);
          }}
          onSetTranslate={instance => {
            if (!isResizingRef.current) return;
            const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
            applyTranslateForIndex(instance, targetIndex);
          }}
          onInit={instance => {
            instance.setTranslate(0);
          }}
        >
          {slideItems.map((item, index) => (
            <SwiperSlide
              key={`slide-${index}`}
              data-slide-index={index}
              aria-label={`${index + 1}/${slideItems.length}`}
            >
              <a key={item.title} href='#' title={item.title} className='grid-carousel__item'>
                <i>{item.logo}</i>
                <span>{item.title}</span>
              </a>
            </SwiperSlide>
          ))}
        </SwiperRoot>
        <span
          className='grid-carousel__notification'
          aria-live='assertive'
          aria-atomic='true'
        ></span>
        <button
          type='button'
          className={clsx('swiper-button-next', {
            'swiper-button-disabled': isMobile && isEnd,
          })}
          disabled={isMobile && isEnd}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default SingleItemCarousel;
