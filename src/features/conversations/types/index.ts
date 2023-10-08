import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

export type GetOrCreateConversationOptions =
  ReactQueryOptions['conversations']['getOrCreateConversation'];
export type GetOrCreateConversationOutput =
  RouterOutputs['conversations']['getOrCreateConversation'];
export type GetOrCreateConversationInput =
  RouterInputs['conversations']['getOrCreateConversation'];
