import { type DirectMessage } from '@prisma/client';

import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

import { type SimpleProfile } from '@/server/api/modules/profiles';

export type GetOrCreateConversationOptions =
  ReactQueryOptions['conversations']['getOrCreateConversation'];
export type GetOrCreateConversationOutput =
  RouterOutputs['conversations']['getOrCreateConversation'];
export type GetOrCreateConversationInput =
  RouterInputs['conversations']['getOrCreateConversation'];

export type MessageWithWithProfile = DirectMessage & {
  profile: SimpleProfile;
};
