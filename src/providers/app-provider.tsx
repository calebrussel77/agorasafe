import { type ProfileStore } from '@/stores/profile-store';
import ProfileStoreProvider from '@/stores/profile-store/profile-store-provider';
import { motion } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import { type FC, type PropsWithChildren } from 'react';

import { Toaster } from '@/components/ui/toast';

import { type AppPageProps } from '@/pages/_app';

export type AppPagePropsWithChildren = {
  session?: AppPageProps['pageProps']['session'];
  initialProfileState?: AppPageProps['pageProps']['initialProfileState'];
};

const AppProvider: FC<PropsWithChildren<AppPagePropsWithChildren>> = ({
  session,
  initialProfileState,
  children,
}) => {
  return (
    <>
      <SessionProvider
        session={session ?? undefined}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
        refetchInterval={5 * 60}
      >
        <ProfileStoreProvider
          {...((initialProfileState as ProfileStore) ?? undefined)}
        >
          {children}
          <Toaster />
        </ProfileStoreProvider>
      </SessionProvider>
    </>
  );
};

export { AppProvider };
