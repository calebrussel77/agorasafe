import { DIRECT_MESSAGES_CHUNK } from '../../constants';
import {
  createDirectMessage,
  deleteDirectMessage,
  getDirectMessages,
  updateDirectMessage,
} from './messages.repository';
import {
  type CreateDirectMessageInput,
  type DeleteDirectMessageInput,
  type GetDirectMessagesInput,
  type UpdateDirectMessageInput,
} from './messages.validations';

export const getDirectMessagesService = async (
  inputs: GetDirectMessagesInput
) => {
  const directMessages = await getDirectMessages(inputs);

  let nextCursor = undefined;

  if (directMessages && directMessages.length === DIRECT_MESSAGES_CHUNK) {
    nextCursor = directMessages?.[DIRECT_MESSAGES_CHUNK - 1]?.id;
  }

  return {
    directMessages,
    nextCursor,
  };
};

export const createDirectMessageService = async (
  inputs: CreateDirectMessageInput
) => {
  const directMessage = await createDirectMessage(inputs);
  return {
    directMessage,
    success: true,
  };
};

export const updateDirectMessageService = async (
  inputs: UpdateDirectMessageInput
) => {
  const updatedDirectMessage = await updateDirectMessage(inputs);

  return {
    updatedDirectMessage,
    success: true,
  };
};

export const deleteDirectMessageService = async (
  inputs: DeleteDirectMessageInput
) => {
  const deletedDirectMessage = await deleteDirectMessage(inputs);

  return {
    deletedDirectMessage,
    success: true,
  };
};
