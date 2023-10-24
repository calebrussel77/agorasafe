import {
  createTRPCRouter,
  profileProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createFeedBackFormSchema,
  createFeedbackController,
  getAllFeedbackController,
} from '../modules/feedbacks';
import { getAllQuerySchema } from '../validations/base.validations';

export const feedbacksRouter = createTRPCRouter({
  create: publicProcedure
    .input(createFeedBackFormSchema)
    .mutation(({ input }) => createFeedbackController(input)),

  getAll: profileProcedure
    .input(getAllQuerySchema)
    .query(({ input }) => getAllFeedbackController(input)),
});
