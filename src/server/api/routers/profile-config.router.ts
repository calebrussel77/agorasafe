import { createTRPCRouter, profileProcedure } from '@/server/api/trpc';

import { getProfileConfigController } from '../modules/profile-config';

export const profileConfigRouter = createTRPCRouter({
  getProfileConfig: profileProcedure.query(({ ctx: { user, profile } }) => {
    return getProfileConfigController(profile?.id, user.id);
  }),
});
