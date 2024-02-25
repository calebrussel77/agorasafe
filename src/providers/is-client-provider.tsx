import { createContext, useContext, useState } from 'react';

import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect';

const IsClientContext = createContext<boolean | null>(null);
export const useIsClient = () => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const context = useContext(IsClientContext);
  if (context === null) throw new Error('missing IsClientContext');
  return context;
};
export const IsClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isClient, setClient] = useState(false);

  useIsomorphicEffect(() => {
    setClient(true);
  }, []);

  return (
    <IsClientContext.Provider value={isClient}>
      {children}
    </IsClientContext.Provider>
  );
};
