import { CONVERSATIONS_CHUNK } from '../../constants';
import {
  getConversations,
  getOrCreateConversation,
} from './conversations.repository';
import { type GetConversationsInput } from './conversations.validations';

export const getOrCreateConversationService = async (inputs: {
  profileOneId: string;
  profileTwoId: string;
}) => {
  const conversation = await getOrCreateConversation({ inputs });

  return { conversation, success: true };
};

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
