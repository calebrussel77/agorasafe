import { throwDbError } from '@/server/utils/error-handling';

import {
  getConversationsService,
  getOrCreateConversationService,
} from './conversations.service';
import { type GetConversationsInput } from './conversations.validations';

export const getOrCreateConversationController = async (
  currentProfileId: string,
  profileTwoId: string
) => {
  try {
    return await getOrCreateConversationService({
      profileOneId: currentProfileId,
      profileTwoId,
    });
  } catch (e) {
    console.log({ e });
    return null;
  }
};

export const getConversationsController = async (
  inputs: GetConversationsInput
) => {
  try {
    return await getConversationsService(inputs);
  } catch (e) {
    throwDbError(e);
  }
};
