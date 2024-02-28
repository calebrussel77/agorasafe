import { commentNotifications } from './comment-notifications';
import { proposalNotifications } from './proposals-notifications';
import { reviewNotifications } from './reviews-notifications';
import { serviceRequestNotifications } from './service-request-notifications';
import { systemNotifications } from './system-notifications';

export const notificationConfigs = {
  ...serviceRequestNotifications,
  ...commentNotifications,
  ...proposalNotifications,
  ...systemNotifications,
  ...reviewNotifications,
};

export type NotificationConfigTypes = keyof typeof notificationConfigs;
