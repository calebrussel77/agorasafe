import { throwDbError } from '@/server/utils/error-handling';

import { CONVERSATIONS_CHUNK } from '../../constants';
import { type Context } from '../../create-context';
import {
  getConversations,
  getOrCreateConversation,
} from './conversations.repository';
import { type GetConversationsInput } from './conversations.validations';

export const getConversationsHandler = async ({
  ctx,
  input,
}: {
  input: GetConversationsInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const conversations = await getConversations(input);

    let nextCursor = undefined;

    if (conversations && conversations.length === CONVERSATIONS_CHUNK) {
      nextCursor = conversations?.[CONVERSATIONS_CHUNK - 1]?.id;
    }

    return { conversations, nextCursor };
  } catch (e) {
    throwDbError(e);
  }
};

export const getOrCreateConversationHandler = async ({
  ctx,
  input,
}: {
  input: { profileOneId: string; profileTwoId: string };
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const conversation = await getOrCreateConversation({ input });

    return conversation;
  } catch (e) {
    throwDbError(e);
  }
};
