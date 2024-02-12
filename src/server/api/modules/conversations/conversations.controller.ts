import { throwDbError } from '@/server/utils/error-handling';

import { type Context } from '../../create-context';
import { getOrCreateConversation } from './conversations.repository';
import { getConversationsService } from './conversations.service';
import { type GetConversationsInput } from './conversations.validations';

export const getConversationsController = async (
  inputs: GetConversationsInput
) => {
  try {
    return await getConversationsService(inputs);
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
    const conversation = await getOrCreateConversation({
      inputs: input,
    });

    return conversation;
  } catch (e) {
    throwDbError(e);
  }
};
