import {
  throwDbError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type Context } from '../../create-context';
import { type GetByIdQueryInput } from '../../validations/base.validations';
import {
  type GetNotificationsInput,
  MarkReadNotificationInput,
  type NotificationConnectorInput,
  deleteNotification,
  getNotification,
  getNotifications,
  getNotificationsCount,
  markNotificationsRead,
} from '../notifications';
import { NotificationSelect } from './notifications.select';

export const getInfiniteNotificationsHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: GetNotificationsInput;
}) => {
  try {
    const limit = input.limit + 1;

    const notifications = await getNotifications({
      ...input,
      profileId: ctx.profile.id,
      limit,
      select: NotificationSelect,
    });

    let nextCursor: string | undefined;
    if (notifications.length > input.limit) {
      const nextItem = notifications.pop();
      nextCursor = nextItem?.id;
    }

    return {
      nextCursor,
      notifications,
    };
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getNotificationHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetByIdQueryInput;
}) => {
  try {
    return await getNotification({ ...input });
  } catch (error) {
    throw throwDbError(error);
  }
};

export const deleteNotificationHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: GetByIdQueryInput;
}) => {
  try {
    const deleted = await deleteNotification(input);
    if (!deleted)
      throw throwNotFoundError(`Aucun notification avec cet id: ${input.id}`);

    return deleted;
  } catch (error) {
    throw throwDbError(error);
  }
};

export const markNotificationsReadHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: MarkReadNotificationInput;
}) => {
  try {
    const notification = await markNotificationsRead({
      ...input,
      profileId: ctx.profile.id,
    });
    return notification;
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getNotificationsCountHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: NotificationConnectorInput;
}) => {
  try {
    return await getNotificationsCount({
      ...input,
      profileId: ctx.profile.id,
    });
  } catch (error) {
    throw throwDbError(error);
  }
};
