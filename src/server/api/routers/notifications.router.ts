import {
  createTRPCRouter,
  profileProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  deleteNotificationHandler,
  getInfiniteNotificationsHandler,
  getNotificationHandler,
  getNotificationsCountHandler,
  getNotificationsSchema,
  markNotificationsReadHandler,
  markReadNotificationSchema,
  notificationConnectorSchema,
} from '../modules/notifications';
import { getByIdQuerySchema } from '../validations/base.validations';

export const notificationsRouter = createTRPCRouter({
  getInfinite: profileProcedure
    .input(getNotificationsSchema)
    .query(getInfiniteNotificationsHandler),

  getCount: profileProcedure
    .input(notificationConnectorSchema)
    .query(getNotificationsCountHandler),

  get: publicProcedure.input(getByIdQuerySchema).query(getNotificationHandler),

  delete: profileProcedure
    .input(getByIdQuerySchema)
    .mutation(deleteNotificationHandler),

  markRead: profileProcedure
    .input(markReadNotificationSchema)
    .mutation(markNotificationsReadHandler),
});
