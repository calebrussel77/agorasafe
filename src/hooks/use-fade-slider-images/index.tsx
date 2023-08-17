import { useKeenSlider } from 'keen-slider/react';
import { useState } from 'react';

type UseFadeSliderImagesProps = {
  images: Array<string>;
  defaultOpacities?: Array<number>;
  duration?: number;
};

const DEFAULT_DURATION_MS = 8_000;

export const useFadeSliderImages = ({
  images,
  duration = DEFAULT_DURATION_MS,
  defaultOpacities = [],
}: UseFadeSliderImagesProps) => {
  const [opacities, setOpacities] = useState<number[]>(defaultOpacities);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      slides: images.length,
      loop: true,
      detailsChanged(s) {
        const newOpacities = s.track.details.slides.map(slide => slide.portion);
        setOpacities(newOpacities);
      },
    },
    [
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
          }, duration);
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
  );

  return { sliderRef, opacities };
};
