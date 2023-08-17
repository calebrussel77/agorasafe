import '@/assets/styles/globals.css';

import { PageWrapper } from '@/components/page-wrapper';

import { api } from '@/utils/api';

import { displayProgressBarOnRouteChange } from '@/lib/progress-bar';

import { useNewDeploy } from '@/hooks/use-new-deploy';
import { useNotificationNetwork } from '@/hooks/use-notification-network';

import { type AppPageProps } from '@/contexts/app-context';

displayProgressBarOnRouteChange();

const MyApp = (props: AppPageProps) => {
  useNewDeploy();
  useNotificationNetwork();

  const { Component, pageProps } = props;

  return (
    <PageWrapper {...props}>
      <Component {...pageProps} />
    </PageWrapper>
  );
};

export default api.withTRPC(MyApp);
