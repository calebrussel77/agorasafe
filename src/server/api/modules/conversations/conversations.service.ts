import { CONVERSATIONS_CHUNK } from '../../constants';
import { getConversations } from './conversations.repository';
import { type GetConversationsInput } from './conversations.validations';

export const getConversationsService = async (
  inputs: GetConversationsInput
) => {
  const conversations = await getConversations(inputs);

  let nextCursor = undefined;

  if (conversations && conversations.length === CONVERSATIONS_CHUNK) {
    nextCursor = conversations?.[CONVERSATIONS_CHUNK - 1]?.id;
  }

  return { conversations, nextCursor };
};
