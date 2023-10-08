import { createTRPCRouter, profileProcedure } from '@/server/api/trpc';

import {
  createDirectMessageSchema,
  deleteDirectMessageSchema,
  getDirectMessagesSchema,
  updateDirectMessageSchema,
} from '../modules/messages';
import {
  createDirectMessageController,
  deleteDirectMessageController,
  getDirectMessagesController,
  updateDirectMessageController,
} from '../modules/messages/messages.controller';

export const messagesRouter = createTRPCRouter({
  getDirectMessages: profileProcedure
    .input(getDirectMessagesSchema)
    .query(({ input }) => getDirectMessagesController(input)),
  createDirectMessage: profileProcedure
    .input(createDirectMessageSchema)
    .mutation(({ input }) => createDirectMessageController(input)),
  updateDirectMessage: profileProcedure
    .input(updateDirectMessageSchema)
    .mutation(({ input }) => updateDirectMessageController(input)),
  deleteDirectMessage: profileProcedure
    .input(deleteDirectMessageSchema)
    .mutation(({ input }) => deleteDirectMessageController(input)),
});
