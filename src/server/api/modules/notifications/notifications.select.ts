import { Prisma } from '@prisma/client';

import { simpleProfileSelect } from '../profiles';

export const NotificationSelect = Prisma.validator<Prisma.NotificationSelect>()(
  {
    id: true,
    createdAt: true,
    title: true,
    message: true,
    imageUrl: true,
    url: true,
    type: true,
    isRead: true,
    profile: { select: simpleProfileSelect },
  }
);

const notificationModel = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: NotificationSelect,
});

export type NotificationModel = Prisma.ProfileGetPayload<
  typeof notificationModel
>;
