import { commentNotifications } from './comment-notifications';
import { proposalNotifications } from './proposals-notifications';
import { serviceRequestNotifications } from './service-request-notifications';

type NotificationDetailsReturn = {
  message: string;
  imageUrl: string;
  url?: string;
};

export const notificationConfigs = {
  ...serviceRequestNotifications,
  ...commentNotifications,
  ...proposalNotifications,
};

export type NotificationConfigTypes = keyof typeof notificationConfigs;
