import { commentNotifications } from './comment-notifications';
import { proposalNotifications } from './proposals-notifications';
import { serviceRequestNotifications } from './service-request-notifications';
import { systemNotifications } from './system-notifications';

type NotificationDetailsReturn = {
  message: string;
  imageUrl: string;
  url?: string;
};

export const notificationConfigs = {
  ...serviceRequestNotifications,
  ...commentNotifications,
  ...proposalNotifications,
  ...systemNotifications,
};

export type NotificationConfigTypes = keyof typeof notificationConfigs;
