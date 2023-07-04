import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { getUserProfileConfigController } from '../controllers';
import { userProfileConfigSchema } from '../validations/user-profile-config';

export const userProfileConfigRouter = createTRPCRouter({
  getUserProfileConfig: protectedProcedure
    .input(userProfileConfigSchema)
    .query(({ ctx: { session }, input }) =>
      getUserProfileConfigController({
        userId: session.user.id,
        profileId: input.profileId,
      })
    ),
});
