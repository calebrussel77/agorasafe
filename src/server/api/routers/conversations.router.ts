import { createTRPCRouter, profileProcedure } from '@/server/api/trpc';

import {
  getConversationsController,
  getOrCreateConversationHandler,
} from '../modules/conversations';
import {
  getConversationsSchema,
  getOrCreateConversationSchema,
} from '../modules/conversations/conversations.validations';

export const conversationsRouter = createTRPCRouter({
  getOrCreate: profileProcedure
    .input(getOrCreateConversationSchema)
    .query(getOrCreateConversationHandler),

  getConversations: profileProcedure
    .input(getConversationsSchema)
    .query(({ ctx: { profile }, input }) =>
      getConversationsController({ ...input })
    ),
});
