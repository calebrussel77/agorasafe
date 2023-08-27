/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import '@/assets/styles/globals.css';
import { WEBSITE_URL } from '@/constants';
import { AppProvider } from '@/providers/app-provider';
import { type ProfileStore } from '@/stores/profile-store';
import { type NextPage } from 'next';
import { type Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import App from 'next/app';
import { type AppContext, type AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { type ReactElement, type ReactNode, useMemo } from 'react';

import { DefaultSeo } from '@/components/default-seo';
import { Meta } from '@/components/meta';
import { ProfileSession } from '@/components/profile-session';
import { NoSSR } from '@/components/ui/no-ssr';

import { api } from '@/utils/api';

import { buildCanonical } from '@/lib/next-seo-config';
import { displayProgressBarOnRouteChange } from '@/lib/progress-bar';

import { useNewDeploy } from '@/hooks/use-new-deploy';
import { useNotificationNetwork } from '@/hooks/use-notification-network';

displayProgressBarOnRouteChange();

type CustomNextPage = NextPage & {
  getLayout?: (page: ReactElement, router: AppProps['router']) => ReactNode;
};

export type AppPageProps = {
  Component: CustomNextPage;
} & AppProps<{
  session: Session | null;
  initialProfileState: ProfileStore | null;
  isMaintenanceMode: boolean | undefined;
  shouldDisableAnalytics?: boolean;
}>;

const MyApp = (props: AppPageProps) => {
  useNewDeploy();
  useNotificationNetwork();
  const {
    Component,
    pageProps: {
      initialProfileState,
      isMaintenanceMode,
      session,
      shouldDisableAnalytics,
      ...pageProps
    },
    router,
  } = props;

  // Use the layout defined at the page level, if available
  const getLayout = useMemo(
    () => Component.getLayout ?? ((page: React.ReactElement) => page),
    [Component.getLayout]
  );

  return (
    <>
      <Meta />
      <GoogleAnalytics trackPageViews={!shouldDisableAnalytics} />
      <DefaultSeo
        canonical={buildCanonical({
          path: router.asPath ?? '/',
          origin: WEBSITE_URL,
        })}
      />
      <AppProvider
        {...{
          session,
          initialProfileState,
        }}
      >
        <ProfileSession />
        <NoSSR>{getLayout(<Component {...pageProps} />, router)}</NoSSR>
      </AppProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const initialProps = await App.getInitialProps(appContext);
  const pathname = appContext?.ctx?.pathname;
  const url = appContext.ctx?.req?.url;
  const isClient = !url || url?.startsWith('/_next/data');

  // getSession works both server-side and client-side but we want to avoid any calls to /api/auth/session
  // on page load, so we only call it server-side.
  const session = !isClient ? await getSession(appContext?.ctx) : null;

  if (
    session &&
    !session?.user?.hasBeenOnboarded &&
    !pathname?.startsWith('/onboarding')
  ) {
    appContext.ctx?.res?.writeHead(302, {
      Location: `/onboarding/choose-profile-type?redirectUrl=${pathname}`,
    });
    appContext.ctx?.res?.end();
  }

  return {
    pageProps: {
      ...initialProps.pageProps,
      session,
    },
  };
};

export default api.withTRPC(MyApp);
