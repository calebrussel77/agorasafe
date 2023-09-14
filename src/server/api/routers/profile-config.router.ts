import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  getProfileConfigController,
  getProfileConfigValidationSchema,
} from '../modules/profile-config';

export const profileConfigRouter = createTRPCRouter({
  getProfileConfig: protectedProcedure
    .input(getProfileConfigValidationSchema)
    .query(({ ctx: { session, initialState }, input }) => {
      console.log(initialState);

      return getProfileConfigController({
        userId: session.user.id,
        profileId: input.profileId,
      });
    }),
});
