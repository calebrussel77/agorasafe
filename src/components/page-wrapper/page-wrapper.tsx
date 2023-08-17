import { WEBSITE_URL } from '@/constants';
import Head from 'next/head';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { useMemo } from 'react';

import { buildCanonical } from '@/lib/next-seo-config';

import { AppContext, type AppPageProps } from '../../contexts/app-context';
import { DefaultSeo } from '../default-seo';
import { ProfileSession } from '../profile-session';
import { NoSSR } from '../ui/no-ssr';

export interface AgorasafePageWrapper {
  (props?: AppPageProps): JSX.Element;
  PageWrapper?: AppPageProps['Component']['PageWrapper'];
}

function PageWrapper(props: AppPageProps) {
  const { Component, pageProps, err, router } = props;

  const providerProps = {
    ...props,
    pageProps: {
      ...props.pageProps,
    },
  };

  // Use the layout defined at the page level, if available
  const getLayout = useMemo(
    () => Component.getLayout ?? ((page: React.ReactElement) => page),
    [Component.getLayout]
  );

  const path = router.asPath;

  return (
    <AppContext {...providerProps}>
      <GoogleAnalytics trackPageViews={!Component.shouldDisableAnalytics} />
      <DefaultSeo canonical={buildCanonical({ path, origin: WEBSITE_URL })} />
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="agorasafe" />
        <meta name="apple-mobile-web-app-title" content="agorasafe" />
        <meta name="theme-color" content="#ffff" />
        <meta name="msapplication-navbutton-color" content="#ffff" />
        <meta name="author" content="Caleb Russel" />
        <meta
          name="keywords"
          content="agorasafe, mise en relation, services à domicile, cameroun, prestataire amateurs, prix abordables, services abordables, vente, shop"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="msapplication-starturl" content="/" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
      </Head>
      <NoSSR>
        {getLayout(
          Component.hasProfileSession ? (
            <ProfileSession>
              <Component {...pageProps} err={err} />
            </ProfileSession>
          ) : (
            <Component {...pageProps} err={err} />
          ),
          router
        )}
      </NoSSR>
    </AppContext>
  );
}

export { PageWrapper };
