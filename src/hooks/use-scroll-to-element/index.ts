import {
  type ElementRef,
  type MutableRefObject,
  useEffect,
  useState,
} from 'react';

type TUseScrollToElementProps = {
  containerRef?: MutableRefObject<HTMLDivElement>;
  condition: boolean;
  duration?: number;
};

export const useScrollToElement = ({
  containerRef,
  condition,
  duration = 100,
}: TUseScrollToElementProps) => {
  const [elementRef, setElementRef] = useState<ElementRef<'div'> | null>(null);

  useEffect(() => {
    if (elementRef && containerRef) {
      //Calcules the position of the element within the scrollable div container
      const y = elementRef?.offsetTop - containerRef?.current?.clientHeight / 2;
      if (condition) {
        setTimeout(function () {
          //Scroll within the conatiner not the viewport after duration ms
          containerRef?.current?.scrollTo({
            top: y,
            left: 0,
            behavior: 'smooth',
          }),
            duration;
        });
      }
    }
  }, [condition, containerRef, duration, elementRef, elementRef?.offsetTop]);

  return {
    elementRef,
    setElementRef,
  };
};
