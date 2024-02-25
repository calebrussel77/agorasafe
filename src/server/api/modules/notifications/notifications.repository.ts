import { type Prisma } from '@prisma/client';

import { isDefined } from '@/utils/type-guards';

import { prisma } from '@/server/db';
import { throwNotFoundError } from '@/server/utils/error-handling';

import { type GetByIdQueryInput } from '../../validations/base.validations';
import { NotificationSelect } from './notifications.select';
import { notificationConfigs } from './notifications.utils';
import {
  type GetNotificationsInput,
  type MarkReadNotificationInput,
  type NotificationConnectorInput,
} from './notifications.validations';

export function createNotification<
  Type extends keyof typeof notificationConfigs
>(
  type: Type,
  details: Parameters<
    (typeof notificationConfigs)[Type]['notificationDetails']
  >[0] & { profileId: string }
) {
  const config = notificationConfigs[type];

  if (!config) {
    throwNotFoundError(`Notification type '${type}' not supported.`);
  }

  const notification = {
    title: config.title,
    ...config.notificationDetails(details as never),
  };

  return prisma.notification.create({
    data: {
      type,
      profileId: details.profileId,
      ...notification,
    },
  });
}

export const getNotification = async ({ id }: GetByIdQueryInput) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
    select: NotificationSelect,
  });

  if (!notification) throw throwNotFoundError();

  return notification;
};

export const getNotifications = async <
  TSelect extends Prisma.NotificationSelect
>({
  limit,
  cursor,
  isRead,
  select,
  profileId,
}: GetNotificationsInput & { profileId: string } & {
  select: TSelect;
}) => {
  const orderBy: Prisma.Enumerable<Prisma.NotificationOrderByWithRelationInput> =
    [];
  const where: Prisma.NotificationWhereInput | undefined = { profileId };

  orderBy.push({ createdAt: 'desc' });

  if (isDefined(isRead)) {
    where.isRead = isRead;
  }

  return await prisma.notification.findMany({
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    orderBy,
    select,
  });
};

export const deleteNotification = ({ id }: { id: string }) => {
  return prisma.notification.delete({ where: { id } });
};

export const markNotificationsRead = ({
  id,
  all = false,
  profileId,
}: MarkReadNotificationInput & {
  profileId: string;
}) => {
  if (all) {
    return prisma.notification.updateMany({
      where: { profileId },
      data: { isRead: true },
    });
  }
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

export const getNotificationsCount = async ({
  isRead = false,
  profileId,
}: NotificationConnectorInput & { profileId: string }) => {
  const where: Prisma.NotificationWhereInput | undefined = {
    profileId,
    isRead,
  };

  return await prisma.notification.count({
    where,
  });
};
