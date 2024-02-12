import {
  type IntersectionOptions,
  useInView as useInViewObserver,
} from 'react-intersection-observer';

import { useScrollAreaRef } from '../use-scroll-area-ref';

export function useInView(options?: IntersectionOptions) {
  const node = useScrollAreaRef();
  return useInViewObserver({ root: node?.current, ...options });
}
