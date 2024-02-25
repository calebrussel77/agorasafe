/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import '@/assets/styles/globals.css';
import { APP_URL, isMaintenanceMode } from '@/constants';
import { MainLayout } from '@/layouts';
import { AppProvider } from '@/providers/app-provider';
import { type ProfileStore } from '@/stores/profile-store';
import { getInitialState } from '@/stores/profile-store/initial-state';
import { getCookies } from 'cookies-next';
import { type NextPage } from 'next';
import { type Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import App, { type AppContext, type AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

import { DefaultSeo } from '@/components/default-seo';
import { Meta } from '@/components/meta';

import { api } from '@/utils/api';
import { isWindowDefined } from '@/utils/type-guards';

import { buildCanonical } from '@/lib/next-seo-config';
import { displayProgressBarOnRouteChange } from '@/lib/progress-bar';

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

function handleExitComplete() {
  if (isWindowDefined()) {
    window.scrollTo({ top: 0 });
  }
}

const MyApp = (props: AppPageProps) => {
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
    () =>
      Component.getLayout ??
      ((page: React.ReactElement) => (
        <MainLayout {...page.props}>{page}</MainLayout>
      )),
    [Component.getLayout]
  );

  return (
    <>
      <Meta />
      <GoogleAnalytics trackPageViews={!shouldDisableAnalytics} />
      <DefaultSeo
        canonical={buildCanonical({
          path: router.asPath ?? '/',
          origin: APP_URL,
        })}
      />
      <AppProvider
        {...{
          session,
          initialProfileState,
        }}
      >
        {getLayout(<Component {...pageProps} key={router.asPath} />, router)}
      </AppProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const initialProps = await App.getInitialProps(appContext);
  const url = appContext.ctx?.req?.url;
  const isClient = !url || url?.startsWith('/_next/data');

  const { pageProps, ...appProps } = initialProps;

  const cookies = getCookies(appContext.ctx);

  if (isMaintenanceMode) {
    return {
      pageProps: {
        ...pageProps,
        isMaintenanceMode,
      },
      ...appProps,
    };
  } else {
    const hasAuthCookie =
      !isClient && Object.keys(cookies).some(x => x.endsWith('session-token'));

    const session = hasAuthCookie ? await getSession(appContext.ctx) : null;
    const initialProfileState = appContext.ctx.req
      ? getInitialState(appContext.ctx.req?.headers)
      : null;

    // Pass this via the request so we can use it in SSR
    if (session && appContext.ctx.req) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (appContext.ctx.req as any)['session'] = session;
    }

    return {
      pageProps: {
        ...pageProps,
        session,
        initialProfileState,
      },
      ...appProps,
    };
  }
};

export default api.withTRPC(MyApp);
