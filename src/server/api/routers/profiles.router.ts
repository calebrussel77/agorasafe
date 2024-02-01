import { ProfileType } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  profileProcedure,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createProfileHandler,
  getProfileDetailsController,
  getProfileStatsController,
  getProfilesByUserIdController,
  getProfilesController,
} from '../modules/profiles';
import { completeUserOnboardingSchema as createProfileSchema } from '../modules/users/users.validations';
import { getByIdOrSlugQuerySchema } from '../validations/base.validations';

//TODO : Rewrite this file and his mutations and queries to fit the new implementation

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

  getStats: publicProcedure
    .input(getByIdOrSlugQuerySchema)
    .query(({ input }) => getProfileStatsController(input)),

  getProfiles: publicProcedure
    .input(z.object({ profileType: z.nativeEnum(ProfileType).optional() }))
    .query(({ input }) => getProfilesController(input?.profileType)),
});
