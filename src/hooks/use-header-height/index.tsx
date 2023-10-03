import { useEffect, useRef, useState } from 'react';

const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

  useEffect(() => {
    const headerElement = document?.querySelector('header');
    if (headerElement && headerElement?.clientHeight) {
      setHeaderHeight(headerElement?.clientHeight);
    }
  }, [headerHeight]);

  return { height: headerHeight };
};

export { useHeaderHeight };
