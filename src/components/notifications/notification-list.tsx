/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRouter } from 'next/router';
import React, { type MouseEvent, cloneElement } from 'react';

import { type RouterOutputs } from '@/utils/api';

import { htmlParse } from '@/lib/html-helper';
import { QS } from '@/lib/qs';
import { cn } from '@/lib/utils';

import { type NotificationConfigTypes } from '@/server/api/modules/notifications';

import { Anchor } from '../anchor';
import { DaysFromNow } from '../days-from-now';
import { Avatar } from '../ui/avatar';
import { DropdownMenu } from '../ui/dropdown-menu';
import { Truncate } from '../ui/truncate';

export type NotificationItem =
  RouterOutputs['notifications']['getInfinite']['notifications'][number];

export const squaredImageTypes: Array<NotificationConfigTypes> = [
  'new-service-request-reservation',
];

type NotificationListProps = {
  items: Array<NotificationItem>;
  onItemClick: (notification: NotificationItem) => void;
  withDivider?: boolean;
  isOnDropdownMenu?: boolean;
  shouldTruncate?: boolean;
  textSize?: 'sm' | 'md';
};

export function NotificationList({
  items,
  onItemClick,
  isOnDropdownMenu = false,
  shouldTruncate = true,
  textSize = 'sm',
}: NotificationListProps) {
  const router = useRouter();
  const textSizeClassName = textSize === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="flex flex-col space-y-1">
      {items.map((notification, idx) => {
        const onHandleClick = (e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();

          if (!notification.url) return;

          // if (details.target === '_blank')
          //   return window.open(details.url, '_blank');

          const isToModal = notification.url.includes('?dialog=');
          if (isToModal) {
            const [pathname] = router.asPath.split('?');
            const [notificationPathname, query] = notification.url.split('?');

            if (
              notificationPathname &&
              query &&
              pathname !== notificationPathname
            ) {
              void router.push(notificationPathname).then(() =>
                router.push(
                  {
                    pathname: notificationPathname,
                    //@ts-ignore
                    query: QS.parse(query),
                  },
                  undefined,
                  {
                    shallow: true,
                  }
                )
              );
            } else {
              void router.push(notification.url, undefined, { shallow: true });
            }
          } else {
            void router.push(notification.url);
          }
        };
        const isSquared = squaredImageTypes.includes(
          notification.type as never
        );

        const className = cn(
          'relative flex cursor-default select-none items-center gap-x-1 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors duration-300 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          'line-clamp-2 flex min-h-[90px] cursor-pointer items-center justify-start gap-3 rounded-md px-3 py-2.5 text-gray-900 hover:bg-gray-100',
          !notification.isRead && 'bg-brand-100 hover:bg-brand-100',
          textSizeClassName
        );

        const item = (
          <Anchor href={notification.url || '#'}>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-2 w-2 rounded-full bg-brand-600',
                  notification.isRead && 'invisible'
                )}
              />
              <Avatar
                src={notification.imageUrl as string}
                size="lg"
                shape={isSquared ? 'square' : 'circle'}
                isBordered
                alt={notification.title}
              />
            </div>
            <div className="w-full flex-1">
              {shouldTruncate ? (
                <Truncate
                  lines={3}
                  className={textSizeClassName}
                  hasEllipsisText={false}
                >
                  {htmlParse(notification.message)}
                </Truncate>
              ) : (
                <div className={textSizeClassName}>
                  {htmlParse(notification.message)}
                </div>
              )}
            </div>
            <DaysFromNow
              date={notification.createdAt}
              addSuffix={false}
              className="mt-1 flex justify-end text-xs text-muted-foreground"
            />
          </Anchor>
        );

        if (!isOnDropdownMenu) {
          return cloneElement(item, {
            href: notification.url || '#',
            className: className,
            onClick: (e: never) => {
              onHandleClick(e);
              !notification.isRead ? onItemClick(notification) : undefined;
            },
          });
        }

        return (
          <DropdownMenu.Item
            key={notification.id}
            asChild
            className={className}
            onClick={e => {
              onHandleClick(e as never);
              !notification.isRead ? onItemClick(notification) : undefined;
            }}
          >
            {item}
          </DropdownMenu.Item>
        );
      })}
    </div>
  );
}
