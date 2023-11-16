import {
  createTRPCRouter,
  profileProcedure,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createProfileHandler,
  getProfileDetailsController,
  getProfilesByUserIdController,
} from '../modules/profiles';
import { completeUserOnboardingSchema as createProfileSchema } from '../modules/users/users.validations';
import { getByIdOrSlugQuerySchema } from '../validations/base.validations';

export const profilesRouter = createTRPCRouter({
  getUserProfiles: protectedProcedure.query(({ ctx: { user } }) =>
    getProfilesByUserIdController({
      userId: user.id,
      name: user.name,
    })
  ),
  createProfile: profileProcedure
    .input(createProfileSchema)
    .mutation(createProfileHandler),
  getProfileDetails: publicProcedure
    .input(getByIdOrSlugQuerySchema)
    .query(({ input }) => getProfileDetailsController(input)),
});
