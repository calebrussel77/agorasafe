import { throwDbError } from '@/server/utils/error-handling';

import {
  createDirectMessageService,
  deleteDirectMessageService,
  getDirectMessagesService,
  updateDirectMessageService,
} from './messages.service';
import {
  type CreateDirectMessageInput,
  type DeleteDirectMessageInput,
  type GetDirectMessagesInput,
  type UpdateDirectMessageInput,
} from './messages.validations';

export const getDirectMessagesController = async (
  inputs: GetDirectMessagesInput
) => {
  try {
    return await getDirectMessagesService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const createDirectMessageController = async (
  inputs: CreateDirectMessageInput
) => {
  try {
    return await createDirectMessageService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const updateDirectMessageController = async (
  inputs: UpdateDirectMessageInput
) => {
  try {
    return await updateDirectMessageService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const deleteDirectMessageController = async (
  inputs: DeleteDirectMessageInput
) => {
  try {
    return await deleteDirectMessageService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};
