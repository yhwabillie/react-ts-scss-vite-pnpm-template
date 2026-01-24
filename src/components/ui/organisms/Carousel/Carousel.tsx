import { useRef, type FocusEvent } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperRoot, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Style from './Carousel.module.scss';

const Carousel = () => {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const lastFocusedSlideIndex = useRef<number | null>(null);
  const slideItems = [
    [
      { title: '아이템1', logo: '아이템1 로고' },
      { title: '아이템2', logo: '아이템2 로고' },
      { title: '아이템3', logo: '아이템3 로고' },
      { title: '아이템4', logo: '아이템4 로고' },
      { title: '아이템5', logo: '아이템5 로고' },
      { title: '아이템6', logo: '아이템6 로고' },
      { title: '아이템7', logo: '아이템7 로고' },
      { title: '아이템8', logo: '아이템8 로고' },
    ],
    [
      { title: '아이템9', logo: '아이템9 로고' },
      { title: '아이템10', logo: '아이템10 로고' },
      { title: '아이템11', logo: '아이템11 로고' },
      { title: '아이템12', logo: '아이템12 로고' },
      { title: '아이템13', logo: '아이템13 로고' },
      { title: '아이템14', logo: '아이템14 로고' },
      { title: '아이템15', logo: '아이템15 로고' },
      { title: '아이템16', logo: '아이템16 로고' },
    ],
  ];

  const handleFocusCapture = (event: FocusEvent<HTMLElement>) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const slideEl = (event.target as HTMLElement).closest('.swiper-slide') as HTMLElement | null;
    if (!slideEl) return;

    const nextIndex = swiper.slides.indexOf(slideEl);
    if (nextIndex < 0) return;
    if (lastFocusedSlideIndex.current === nextIndex) return;

    lastFocusedSlideIndex.current = nextIndex;

    if (swiper.slidesGrid.length === 0) {
      swiper.update();
    }

    swiper.slideTo(nextIndex, 0);
  };

  return (
    <div className={Style.carousel} onFocusCapture={handleFocusCapture}>
      <div className='carousel__title-area'>
        <h3 className='carousel__title'>캐러샐 타이틀</h3>
      </div>
      <div className='carousel__content-area'>
        <button type='button' className='swiper-button-prev'>
          prev
        </button>
        <SwiperRoot
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          slidesPerView='auto'
          spaceBetween={8}
          loop={false}
          observer
          observeParents
          slidesOffsetBefore={0}
          autoHeight
          onSwiper={instance => {
            swiperRef.current = instance;
          }}
          onInit={instance => {
            instance.setTranslate(0);
          }}
          className={Style.swiper}
        >
          {slideItems.map((items, index) => (
            <SwiperSlide key={`slide-${index}`} aria-label={`${index + 1}/${slideItems.length}`}>
              <div className='carousel__bundle'>
                {items.map(item => (
                  <a key={item.title} href='#' title={item.title} className='carousel__item'>
                    <i>{item.logo}</i>
                    <span>{item.title}</span>
                  </a>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </SwiperRoot>
        <span className='carousel__notification' aria-live='assertive' aria-atomic='true'></span>
        <button type='button' className='swiper-button-next'>
          next
        </button>
      </div>
      <div className='carousel__more-area'>
        <button type='button' className='carousel__more-btn'>
          <span className='sr-only'>캐러샐 타이틀</span>펼쳐보기
        </button>
      </div>
    </div>
  );
};

export default Carousel;
