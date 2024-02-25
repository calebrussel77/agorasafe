import { ClientHistoryStore } from '@/stores/client-history-store';
import { type ProfileStore } from '@/stores/profile-store';
import { ProfileStoreProvider } from '@/stores/profile-store';
import { SocketStoreProvider } from '@/stores/socket-store';
import { SessionProvider } from 'next-auth/react';
import { type FC, type PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { BrowserRouterProvider } from '@/components/BrowserRouter';
import { RoutedDialogProvider } from '@/components/ui/dialog';
import { DialogProvider } from '@/components/ui/dialog/dialog-provider';
import { FullPageError } from '@/components/ui/error';
import { Toaster } from '@/components/ui/toast';

import { type AppPageProps } from '@/pages/_app';

import { ChangeProfileProvider } from './change-profile-provider';
import { CustomModalsProvider } from './custom-modal-provider';
import { IsClientProvider } from './is-client-provider';
import { UserOnboardingProvider } from './user-ònboarding-provider';

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
    <ErrorBoundary FallbackComponent={FullPageError}>
      <IsClientProvider>
        <ClientHistoryStore />
        <SessionProvider
          session={session ?? undefined}
          refetchOnWindowFocus={false}
          refetchWhenOffline={false}
          refetchInterval={5 * 60}
        >
          <BrowserRouterProvider>
            <ProfileStoreProvider
              {...((initialProfileState as ProfileStore) ?? undefined)}
            >
              <SocketStoreProvider>
                <CustomModalsProvider>
                  <UserOnboardingProvider>
                    <ChangeProfileProvider>{children}</ChangeProfileProvider>
                    <DialogProvider />
                    <RoutedDialogProvider />
                  </UserOnboardingProvider>
                  <Toaster />
                </CustomModalsProvider>
              </SocketStoreProvider>
            </ProfileStoreProvider>
          </BrowserRouterProvider>
        </SessionProvider>
      </IsClientProvider>
    </ErrorBoundary>
  );
};

export { AppProvider };
