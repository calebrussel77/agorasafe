import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  createProfileController,
  createProfileValidationSchema,
  getProfilesByUserIdController,
} from '../modules/profiles';

export const profilesRouter = createTRPCRouter({
  getUserProfiles: protectedProcedure.query(({ ctx: { session } }) =>
    getProfilesByUserIdController({
      userId: session.user.id,
      name: session.user.name,
    })
  ),
  createProfile: protectedProcedure
    .input(createProfileValidationSchema)
    .mutation(({ input, ctx: { session } }) =>
      createProfileController({ ...input, userId: session.user.id })
    ),
});
