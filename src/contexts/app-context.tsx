import ProfileStoreProvider from '@/stores/profile-store-provider';
import { type ProfileStore } from '@/stores/profiles';
import { type Prettify } from '@/types';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps as NextAppProps } from 'next/app';
import { type FC, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';

import { FullPageError } from '@/components/ui/error';

// Workaround for https://github.com/vercel/next.js/issues/8592
type UnPrettiFyAppPageProps = Omit<
  NextAppProps<
    {
      session: Session;
      initialProfileState: ProfileStore;
    } & Record<string, unknown>
  >,
  'Component'
> & {
  Component: NextAppProps['Component'] & {
    hasProfileSession?: boolean;
    requiredRolesAcess?: string[];
    shouldDisableAnalytics?:
      | boolean
      | ((arg: { router: NextAppProps['router'] }) => boolean);
    getLayout?: (
      page: React.ReactElement,
      router: NextAppProps['router']
    ) => ReactNode;
    PageWrapper?: (props: AppPageProps) => JSX.Element;
  };

  /** Will be defined only is there was an error */
  err?: Error;
};

export type AppPageProps = Prettify<UnPrettiFyAppPageProps>;

//For testing purpose i have to make it partial "AppPageProps"
export type AppPagePropsWithChildren = Partial<AppPageProps> & {
  children: ReactNode;
};

const AppContext: FC<AppPagePropsWithChildren> = props => {
  const { children, pageProps } = props;

  return (
    <ErrorBoundary FallbackComponent={FullPageError}>
      <ToastContainer
        hideProgressBar
        position="bottom-right"
        newestOnTop
        closeButton={false}
        className="w-full max-w-md bg-transparent px-3"
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <SessionProvider
        session={pageProps?.session ?? undefined}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
      >
        <ProfileStoreProvider
          {...((pageProps?.initialProfileState as ProfileStore) ?? undefined)}
        >
          {children}
        </ProfileStoreProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export { AppContext };
