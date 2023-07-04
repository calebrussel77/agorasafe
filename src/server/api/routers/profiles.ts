import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  createProfileController,
  getProfilesByUserIdController,
} from '../controllers';
import { createProfileSchema } from '../validations/profiles';

export const profilesRouter = createTRPCRouter({
  getUserProfiles: protectedProcedure.query(({ ctx: { session } }) =>
    getProfilesByUserIdController({
      userId: session.user.id,
      name: session.user.name,
    })
  ),
  createProfile: protectedProcedure
    .input(createProfileSchema)
    .mutation(({ input, ctx: { session } }) =>
      createProfileController({ ...input, userId: session.user.id })
    ),
});
