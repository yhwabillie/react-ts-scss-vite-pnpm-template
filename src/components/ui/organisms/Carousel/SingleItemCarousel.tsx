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
  // 사용자가 마지막으로 선택한 슬라이드 인덱스(리사이즈 시 동일 시작 슬라이드 유지).
  const lastUserActiveIndexRef = useRef(0);
  // 리사이즈 중 Swiper가 내부적으로 activeIndex를 바꾸는 것을 사용자 변경으로 보지 않음.
  const isResizingRef = useRef(false);
  // 리사이즈 중 떨림을 줄이기 위한 보정 디바운스.
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

  // 현재 per-view 기준으로 시작 인덱스가 유효 범위를 벗어나지 않게 보정.
  const clampStartIndex = (swiper: SwiperInstance, index: number) => {
    const perView = getSlidesPerViewForViewport(swiper);
    const maxStartIndex = Math.max(swiper.slides.length - perView, 0);
    if (index < 0) return 0;
    if (index > maxStartIndex) return maxStartIndex;
    return index;
  };

  const getTranslateX = (element: HTMLElement) => {
    const transform = window.getComputedStyle(element).transform;
    if (!transform || transform === 'none') return 0;
    if (transform.startsWith('matrix3d')) {
      const values = transform.replace('matrix3d(', '').replace(')', '').split(',');
      return Number(values[12] ?? 0);
    }
    if (transform.startsWith('matrix')) {
      const values = transform.replace('matrix(', '').replace(')', '').split(',');
      return Number(values[4] ?? 0);
    }
    return 0;
  };

  // 현재 activeIndex와 slidesPerView 기준으로 prev/next 버튼 상태 갱신.
  const updateEdgeState = (swiper: SwiperInstance, activeIndex = swiper.activeIndex) => {
    const perView = getSlidesPerViewForViewport(swiper);
    const maxStartIndex = Math.max(swiper.slides.length - perView, 0);
    const isAtStart = activeIndex <= 0;
    setIsBeginning(isAtStart);
    setIsEnd(activeIndex >= maxStartIndex);
  };

  // Swiper 내부 상태에 의존하지 않고 wrapper translate/active 클래스를 강제로 맞춤.
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

  // 레이아웃이 안정된 다음 프레임에 translate 적용.
  const slideToIndex = (swiper: SwiperInstance, index: number) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applyTranslateForIndex(swiper, index);
        isResizingRef.current = false;
      });
    });
  };

  // 탭 이동 시 포커스된 슬라이드가 화면에 보이도록 유지.
  const handleFocusCapture = (event: FocusEvent<HTMLElement>) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const slideEl = (event.target as HTMLElement).closest('.swiper-slide') as HTMLElement | null;
    if (!slideEl) return;

    // data-slide-index는 Swiper DOM 재정렬에도 안정적으로 유지됨.
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
            'swiper-button-disabled': isBeginning,
          })}
          disabled={isBeginning}
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
            const targetIndex = clampStartIndex(instance, instance.activeIndex);
            lastUserActiveIndexRef.current = targetIndex;
            updateEdgeState(instance, targetIndex);
          }}
          onSlideChange={instance => {
            if (isResizingRef.current) {
              const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
              updateEdgeState(instance, targetIndex);
              return;
            }

            lastUserActiveIndexRef.current = instance.activeIndex;
            updateEdgeState(instance);
          }}
          onBeforeResize={instance => {
            isResizingRef.current = true;
          }}
          onResize={instance => {
            isResizingRef.current = true;

            if (resizeTimerRef.current !== null) {
              window.clearTimeout(resizeTimerRef.current);
            }

            resizeTimerRef.current = window.setTimeout(() => {
              const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
              lastUserActiveIndexRef.current = targetIndex;
              updateEdgeState(instance, targetIndex);
              slideToIndex(instance, targetIndex);
            }, 120);

            const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
            lastUserActiveIndexRef.current = targetIndex;
            updateEdgeState(instance, targetIndex);
            applyTranslateForIndex(instance, targetIndex);
          }}
          onBreakpoint={instance => {
            const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
            lastUserActiveIndexRef.current = targetIndex;
            updateEdgeState(instance, targetIndex);
            slideToIndex(instance, targetIndex);
          }}
          onSetTranslate={instance => {
            if (!isResizingRef.current) return;
            const targetIndex = clampStartIndex(instance, lastUserActiveIndexRef.current);
            lastUserActiveIndexRef.current = targetIndex;
            updateEdgeState(instance, targetIndex);
            applyTranslateForIndex(instance, targetIndex);
          }}
          onInit={instance => {
            instance.setTranslate(0);
            const targetIndex = clampStartIndex(instance, instance.activeIndex);
            lastUserActiveIndexRef.current = targetIndex;
            updateEdgeState(instance, targetIndex);
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
            'swiper-button-disabled': isEnd,
          })}
          disabled={isEnd}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default SingleItemCarousel;
