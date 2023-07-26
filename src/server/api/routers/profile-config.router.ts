import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  getProfileConfigController,
  getProfileConfigValidationSchema,
} from '../modules/profile-config';

export const profileConfigRouter = createTRPCRouter({
  getProfileConfig: protectedProcedure
    .input(getProfileConfigValidationSchema)
    .query(({ ctx: { session }, input }) =>
      getProfileConfigController({
        user_id: session.user.id,
        profile_id: input.profile_id,
      })
    ),
});
