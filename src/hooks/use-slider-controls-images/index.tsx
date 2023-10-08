import { type KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import { useState } from 'react';

interface UseSliderControlsImagesProps extends KeenSliderOptions {
  autoSlide?: boolean;
}
export const useSliderControlsImages = (
  { loop, autoSlide, ...rest }: UseSliderControlsImagesProps = {
    autoSlide: true,
    loop: true,
  }
) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isLoaded, setisLoaded] = useState<boolean>(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setisLoaded(true);
      },
      ...rest,
    },
    autoSlide
      ? [
          slider => {
            let timeout: ReturnType<typeof setTimeout>;
            let isMouseOver = false;
            function clearNextTimeout() {
              clearTimeout(timeout);
            }
            function nextTimeout() {
              clearTimeout(timeout);
              if (isMouseOver) return;
              timeout = setTimeout(() => {
                slider.next();
              }, 2000);
            }
            slider.on('created', () => {
              slider.container.addEventListener('mouseover', () => {
                isMouseOver = true;
                clearNextTimeout();
              });
              slider.container.addEventListener('mouseout', () => {
                isMouseOver = false;
                nextTimeout();
              });
              nextTimeout();
            });
            slider.on('dragStarted', clearNextTimeout);
            slider.on('animationEnded', nextTimeout);
            slider.on('updated', nextTimeout);
          },
        ]
      : undefined
  );

  return { sliderRef, isLoaded, currentSlide, instanceRef };
};
