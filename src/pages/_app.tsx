import '@/styles/globals.css';
import ProgressBar from '@badrap/bar-of-progress';
import { Wifi } from 'lucide-react';
import { WifiOff } from 'lucide-react';
import type { NextPage } from 'next';
import { type Session } from 'next-auth';
import { type AppType } from 'next/app';
import { Router, useRouter } from 'next/router';
import { type ReactElement, type ReactNode } from 'react';

import { DefaultSeo } from '@/components/default-seo';
import { Button } from '@/components/ui/button/button';
import { Notification } from '@/components/ui/notification';

import { api } from '@/utils/api';

import { useNewDeploy } from '@/hooks/use-new-deploy';
import { useNotificationNetwork } from '@/hooks/use-notification-network';

import { AppContext } from '@/contexts/app-context';

const progress = new ProgressBar({
  size: 4,
  className: 'bar-of-progress shadow-md',
  delay: 100,
  color: '#30389d',
});

// this fixes safari jumping to the bottom of the page
// when closing the search modal using the `esc` key
if (typeof window !== 'undefined') {
  progress.start();
  progress.finish();
}

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', () => {
  progress.finish();
  window.scrollTo(0, 0);
  Router.events.on('routeChangeError', progress.finish);
});

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { reload } = useRouter();

  useNewDeploy({
    notificationToast: (
      <Notification
        variant="info"
        title="Une nouvelle version de l'application est disponible."
        actions={
          <Button size="sm" onClick={reload} className="whitespace-nowrap">
            Recharger votre page
          </Button>
        }
      />
    ),
  });

  useNotificationNetwork({
    activeNetworkNotification: (
      <Notification
        icon={<Wifi className="h-5 w-5" />}
        variant="success"
        title="Votre connexion internet a été rétablie."
      />
    ),
    failedNetworkNotification: (
      <Notification
        icon={<WifiOff className="h-5 w-5" />}
        variant="warning"
        title="Vous êtes actuellement hors ligne."
      />
    ),
  });

  // Use the layout defined at the page level, if available
  const getLayout =
    (Component as NextPageWithLayout).getLayout ?? (page => page);

  return (
    <>
      <DefaultSeo />
      <AppContext session={session}>
        {getLayout(<Component {...pageProps} />)}
      </AppContext>
    </>
  );
};

export default api.withTRPC(MyApp);
