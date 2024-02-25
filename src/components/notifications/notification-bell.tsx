import { Bell, BellOff, ListChecks } from 'lucide-react';
import React, { useState } from 'react';

import { api } from '@/utils/api';

import { cn } from '@/lib/utils';

import { useCurrentUser } from '@/hooks/use-current-user';

import { ActionTooltip } from '../action-tooltip';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { DropdownMenu } from '../ui/dropdown-menu';
import { EmptyState } from '../ui/empty-state';
import { CenterContent } from '../ui/layout';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Spinner } from '../ui/spinner';
import { Typography } from '../ui/typography';
import { NotificationList } from './notification-list';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthWithProfile } = useCurrentUser();
  const queryUtils = api.useContext();

  const { data: notificationCount, isLoading: isLoadingCheck } =
    api.notifications.getCount.useQuery(
      {},
      { refetchInterval: isAuthWithProfile ? 1_000 * 2 : false }
    );

  const { data: notificationsData, isInitialLoading: isLoadingNotifications } =
    api.notifications.getInfinite.useQuery({ limit: 10 }, { enabled: isOpen });

  const readNotificationMutation = api.notifications.markRead.useMutation({
    async onSuccess() {
      await queryUtils.notifications.getCount.invalidate();
      await queryUtils.notifications.getInfinite.invalidate();
    },
  });

  const handleMarkAsRead = ({ id, all }: { id?: string; all?: boolean }) => {
    readNotificationMutation.mutate({ id, all });
  };

  const renderCount =
    notificationCount && notificationCount > 9 ? '+9' : notificationCount;

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenu.Trigger>
        <Badge
          content={isLoadingCheck || !notificationCount ? null : renderCount}
          variant="danger"
          size="xs"
          placement="top-right"
          className="right-2 top-1"
        >
          <span
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'cursor-pointer focus:ring-transparent focus-visible:ring-transparent',
              isOpen && 'bg-gray-100'
            )}
          >
            <Bell className="h-6 w-6" />
          </span>
        </Badge>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[370px] lg:w-[500px] 2xl:w-[580px]">
        <div className="ml-2 mt-2 flex items-center justify-between border-b border-gray-300 pb-2">
          <Typography as="h3">Notifications</Typography>
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
        </div>
        <div className="mt-4 flex flex-col space-y-1">
          {isLoadingNotifications ? (
            <CenterContent>
              <Spinner variant="primary" />
            </CenterContent>
          ) : notificationsData &&
            notificationsData.notifications.length > 0 ? (
            <>
              <ScrollArea>
                <NotificationList
                  items={notificationsData.notifications}
                  isOnDropdownMenu
                  onItemClick={notification => {
                    !notification.isRead
                      ? handleMarkAsRead({ id: notification.id })
                      : undefined;
                    setIsOpen(false);
                  }}
                />
              </ScrollArea>
              <Separator className="my-3" />
              <Button
                className="w-full"
                variant="ghost"
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
              >
                {notificationCount
                  ? `Voir tous (${notificationCount} Non lus)`
                  : 'Voir tous'}
              </Button>
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
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
