import { z } from 'zod';

export type NotificationConnectorInput = z.infer<
  typeof notificationConnectorSchema
>;
export const notificationConnectorSchema = z.object({
  isRead: z.boolean().optional(),
});

export type MarkReadNotificationInput = z.infer<typeof markReadNotificationSchema>;
export const markReadNotificationSchema = z.object({
  id: z.string().optional(),
  all: z.boolean().optional(),
});

export type GetNotificationsInput = z.infer<typeof getNotificationsSchema>;
export const getNotificationsSchema = z.object({
  limit: z.number().min(0).max(100).default(20),
  cursor: z.string().nullish(),
  isRead: z.boolean().optional(),
});

export type UpsertNotificationInput = z.infer<typeof upsertNotificationSchema>;
export const upsertNotificationSchema = notificationConnectorSchema.extend({
  id: z.string().optional(),
  type: z.string(),
  imageUrl: z.string().optional(),
  title: z.string(),
  message: z.string(),
  url: z.string().optional(),
});
