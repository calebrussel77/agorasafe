import { MainLayout } from '@/layouts';
import { BellOff, ListChecks } from 'lucide-react';
import { type ReactElement, useMemo } from 'react';

import { ActionTooltip } from '@/components/action-tooltip';
import { InViewLoader } from '@/components/in-view/in-view-loader';
import { NotificationList } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';

import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { api } from '@/utils/api';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const NotificationsPage = ({ profile, session }: PageProps) => {
  const queryUtils = api.useContext();

  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  } = api.notifications.getInfinite.useInfiniteQuery({ limit: 30 });

  const notifications = useMemo(
    () => notificationsData?.pages.flatMap(page => page.notifications) ?? [],
    [notificationsData?.pages]
  );

  const readNotificationMutation = api.notifications.markRead.useMutation({
    async onSuccess() {
      await queryUtils.notifications.getCount.invalidate();
      await queryUtils.notifications.getInfinite.invalidate();
    },
  });

  const handleMarkAsRead = ({ id, all }: { id?: string; all?: boolean }) => {
    readNotificationMutation.mutate({ id, all });
  };

  return (
    <>
      <MainContent>
        <ContentTitle
          actions={
            <ActionTooltip label="Marquer tous comme lus">
              <Button
                size="sm"
                disabled={readNotificationMutation.isLoading}
                onClick={() => handleMarkAsRead({ all: true })}
                variant="outline"
              >
                <ListChecks className="h-5 w-5" />
              </Button>
            </ActionTooltip>
          }
        >
          Notifications
        </ContentTitle>
        <div className="mx-auto w-full max-w-3xl rounded-bl-md rounded-br-md border-b border-l border-r border-gray-200 px-3 py-6">
          <div className="flex flex-col space-y-1">
            {isLoadingNotifications ? (
              <CenterContent>
                <Spinner variant="primary" />
              </CenterContent>
            ) : notifications && notifications.length > 0 ? (
              <>
                <NotificationList
                  items={notifications}
                  onItemClick={notification => handleMarkAsRead(notification)}
                  shouldTruncate={false}
                  isOnDropdownMenu={false}
                  textSize="md"
                />

                {hasNextPage && (
                  <InViewLoader
                    loadFn={fetchNextPage}
                    loadCondition={!isRefetching}
                    className="w-full"
                  >
                    <CenterContent className="mt-3">
                      <Spinner variant="primary" />
                    </CenterContent>
                  </InViewLoader>
                )}
              </>
            ) : (
              <CenterContent>
                <EmptyState
                  icon={<BellOff />}
                  name="Aucune notification"
                  description="Vous n'avez aucune notification disponible."
                />
              </CenterContent>
            )}
          </div>
        </div>
      </MainContent>
    </>
  );
};

NotificationsPage.getLayout = function getLayout(
  page: ReactElement<PageProps>
) {
  const profile = page?.props?.profile;
  const pageTitle = `Notifications - ${profile?.name}`;
  return (
    <MainLayout title={pageTitle} footer={null}>
      <Sidebar />
      {page}
    </MainLayout>
  );
};

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  shouldUseSession: true,
  resolver: ({ ctx, profile, session }) => {
    if (!session || !profile) return { notFound: true };

    return { props: { profile, session } };
  },
});

export default NotificationsPage;
