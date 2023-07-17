import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';

import { FullSpinner } from '../ui/spinner';

interface RedirectProps {
  to: string;
}

const Redirect: FC<RedirectProps> = ({ to }) => {
  const router = useRouter();

  useEffect(() => {
    if (to && router.isReady) {
      void router.replace(to);
    }
  }, [router, to]);

  return <FullSpinner />;
};

export { Redirect };
