import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';

import { FullSpinner } from '../ui/spinner';

interface RedirectProps {
  to: string;
}

/**
 * Renders a component that redirects the user to a specified location.
 *
 * @param {RedirectProps} to - The location to redirect to.
 * @return {JSX.Element} - The rendered redirect component.
 */
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
