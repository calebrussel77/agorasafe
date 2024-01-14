import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/future/image';
import { useRef } from 'react';
import type SwiperType from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { cn } from '@/lib/utils';

interface ImagesSliderProps {
  images: Array<{ url: string; alt: string }>;
  className?: string;
}

const ImagesSlider = ({ images, className }: ImagesSliderProps) => {
  const swiperRef = useRef<SwiperType>();

  const activeStyles =
    'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-30 place-items-center rounded-full border-2 bg-white border-zinc-300';

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="rounded-full bg-brand-600 transition ${className}"></span>`;
    },
  };

  return (
    <div
      className={cn('group relative overflow-hidden bg-zinc-100', className)}
    >
      <button
        onClick={e => {
          e.preventDefault();
          swiperRef.current?.slidePrev();
        }}
        className={cn(
          activeStyles,
          'swiper-button-prev left-3 transition disabled:opacity-0'
        )}
        aria-label="previous image"
      >
        <ChevronLeft className="h-4 w-4 text-zinc-700" />{' '}
      </button>

      <Swiper
        pagination={pagination}
        onBeforeInit={swiper => {
          swiperRef.current = swiper;
        }}
        updateOnWindowResize
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        className="h-full w-full"
      >
        {images?.map((image, i) => (
          <SwiperSlide key={i} className="relative h-full w-full">
            <Image
              fill
              loading="eager"
              className="h-full w-full object-cover object-center"
              src={image.url}
              alt={image.alt}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={e => {
          e.preventDefault();
          swiperRef.current?.slideNext();
        }}
        className={cn(
          activeStyles,
          'swiper-button-next right-3 transition disabled:opacity-0'
        )}
        aria-label="next image"
      >
        <ChevronRight className="h-4 w-4 text-zinc-700" />{' '}
      </button>
    </div>
  );
};

export { ImagesSlider };
