/* eslint-disable @typescript-eslint/naming-convention */
import React, { type CSSProperties, useEffect, useState } from 'react';

import { useInView } from '@/hooks/use-in-view.ts';

export function InViewLoader({
  children,
  loadFn,
  loadCondition,
  loadTimeout = 500,
  className,
  style,
}: {
  children: React.ReactNode;
  loadFn: () => any | Promise<any>;
  loadCondition: boolean;
  loadTimeout?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView({ rootMargin: '1200px 0px' });
  const [isInitialCanLoad, setisInitialCanLoad] = useState(false);
  const [canLoad, setCanLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setisInitialCanLoad(true);
    }, loadTimeout);
  }, [loadTimeout]);

  useEffect(() => {
    if (inView && loadCondition && isInitialCanLoad && canLoad) {
      const handleLoad = async () => {
        await loadFn();
        setTimeout(() => setCanLoad(true), loadTimeout);
      };

      setCanLoad(false);
      void handleLoad();
    }
  }, [inView, loadCondition, isInitialCanLoad, canLoad]); // eslint-disable-line

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
