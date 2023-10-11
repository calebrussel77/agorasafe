import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const usePrefetch = (url: string) => {
  const router = useRouter();

  useEffect(() => {
    void router.prefetch(url);
  }, [router, url]);
};
