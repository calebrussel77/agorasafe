import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createProfileController,
  createProfileValidationSchema,
  getProfileDetailsController,
  getProfilesByUserIdController,
} from '../modules/profiles';
import { getByIdOrSlugQuerySchema } from '../validations/base.validations';

export const profilesRouter = createTRPCRouter({
  getUserProfiles: protectedProcedure.query(({ ctx: { session } }) =>
    getProfilesByUserIdController({
      userId: session.user.id,
      name: session.user.name,
    })
  ),
  getProfileDetails: publicProcedure
    .input(getByIdOrSlugQuerySchema)
    .query(({ input }) => getProfileDetailsController(input)),

  createProfile: protectedProcedure
    .input(createProfileValidationSchema)
    .mutation(({ input, ctx: { session } }) =>
      createProfileController({ ...input, userId: session.user.id })
    ),
});
