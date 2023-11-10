import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  acceptTOSHandler,
  completeUserOnboardingHandler,
} from '../modules/users';
import { completeUserOnboardingSchema } from '../modules/users/users.validations';

export const usersRouter = createTRPCRouter({
  acceptTOS: protectedProcedure.mutation(acceptTOSHandler),

  completeUserOnboarding: protectedProcedure
    .input(completeUserOnboardingSchema)
    .mutation(completeUserOnboardingHandler),
});
