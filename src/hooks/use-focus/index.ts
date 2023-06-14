import { useEffect, useRef } from 'react';

export const useFocus = (shouldFocus = true) => {
  const elementRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [shouldFocus]);

  return { elementRef };
};
