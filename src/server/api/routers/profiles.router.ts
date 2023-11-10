import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  getProfileDetailsController,
  getProfilesByUserIdController,
} from '../modules/profiles';
import { getByIdOrSlugQuerySchema } from '../validations/base.validations';

export const profilesRouter = createTRPCRouter({
  getUserProfiles: protectedProcedure.query(({ ctx: { user } }) =>
    getProfilesByUserIdController({
      userId: user.id,
      name: user.name,
    })
  ),
  getProfileDetails: publicProcedure
    .input(getByIdOrSlugQuerySchema)
    .query(({ input }) => getProfileDetailsController(input)),
});
