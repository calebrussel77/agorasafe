/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import React, {
  type ComponentProps,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  useRef,
} from 'react';
import type SwiperType from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { makeRandomId, randomBetween } from '@/utils/misc';

import { cn } from '@/lib/utils';

import { Button, type ButtonProps } from '../ui/button';

type SwiperCarouselProps<T extends unknown> = {
  className?: string;
  options: T[];
  renderItem: ({ item, idx }: { item: T; idx: number }) => ReactNode;
  swiperRef: React.MutableRefObject<SwiperType | undefined>;
} & ComponentProps<typeof Swiper>;

const useSwiperRef = () => {
  const swiperRef = useRef<SwiperType | undefined>();

  const onHandlePrevSlide = (e: MouseEvent) => {
    e.preventDefault();
    swiperRef.current?.slidePrev();
  };

  const onHandleNextSlide = (e: MouseEvent) => {
    e.preventDefault();
    swiperRef.current?.slideNext();
  };

  return { onHandleNextSlide, onHandlePrevSlide, swiperRef };
};

const id = randomBetween(10, 1999);

const prevClass = `swiper-button-prev-${id}`;
const nextClass = `swiper-button-next-${id}`;

const SwiperButton = ({
  onClick,
  className,
  mode,
  children,
  ...rest
}: ButtonProps & { mode: 'prev' | 'next' }) => {
  const activeStyles =
    'active:scale-[0.97] opacity-100 hover:scale-105 bg-white';

  return (
    <Button
      className={cn(
        activeStyles,
        mode === 'prev' ? prevClass : nextClass,
        'transition disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      variant="ghost"
      size="sm"
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};
const SwiperCarousel = <T extends unknown>({
  options,
  renderItem,
  swiperRef,
  autoplay = false,
  modules = [],
  ...rest
}: PropsWithChildren<SwiperCarouselProps<T>>) => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      updateOnWindowResize
      onBeforeInit={swiper => {
        swiperRef.current = swiper;
      }}
      className="w-full"
      breakpoints={{
        500: {
          slidesPerView: 2,
        },
        720: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
        1480: {
          slidesPerView: 4,
        },
        1700: {
          slidesPerView: 5,
        },
      }}
      navigation={{
        nextEl: `.${nextClass}`,
        prevEl: `.${prevClass}`,
      }}
      autoplay={
        autoplay
          ? { pauseOnMouseEnter: true, disableOnInteraction: true }
          : false
      }
      modules={[Pagination, Navigation, ...modules]}
      {...rest}
    >
      {options?.map((item, idx) => {
        return (
          <SwiperSlide key={idx} className="w-full py-6">
            {renderItem({ item, idx })}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export { SwiperCarousel, useSwiperRef, SwiperButton };
