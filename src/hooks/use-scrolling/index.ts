import React, { useEffect, useState } from 'react';

export type IScrollProps = {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  scrollPercent: number;
};

export const useScrolling = (
  scrollRef: React.RefObject<HTMLElement | null>
) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = React.useCallback(() => {
    const container = document.querySelector('#dialog__content');

    if (!container) return;

    const { scrollTop } = container;
    if (scrollTop > 5) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  }, []);

  // set up event listeners
  useEffect(() => {
    const container = document.querySelector('#dialog__content');

    console.log(container);

    const scrollListener = () => {
      if (container) {
        container.addEventListener('scroll', handleScroll);
      }
    };

    scrollListener();
    return () => {
      scrollListener();
    };
  }, [handleScroll]);

  return { hasScrolled };
};
