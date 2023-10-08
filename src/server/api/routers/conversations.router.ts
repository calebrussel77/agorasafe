import { createTRPCRouter, profileProcedure } from '@/server/api/trpc';

import {
  getConversationsController,
  getOrCreateConversationController,
} from '../modules/conversations';
import {
  getConversationsSchema,
  getOrCreateConversationSchema,
} from '../modules/conversations/conversations.validations';

export const conversationsRouter = createTRPCRouter({
  getOrCreateConversation: profileProcedure
    .input(getOrCreateConversationSchema)
    .query(({ ctx: { profile }, input }) =>
      getOrCreateConversationController(profile?.id, input?.profileTwoId)
    ),
  getConversations: profileProcedure
    .input(getConversationsSchema)
    .query(({ ctx: { profile }, input }) =>
      getConversationsController({ ...input })
    ),
});
