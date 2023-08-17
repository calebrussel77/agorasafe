import { type NextRouter } from 'next/router';
import { useEffect } from 'react';

export const usePrefetch = (url: string, router: NextRouter) => {
  useEffect(() => {
    void router.prefetch(url);
  }, [router, url]);
};
