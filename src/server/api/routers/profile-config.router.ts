import { createTRPCRouter, profileProcedure } from '@/server/api/trpc';

import { getProfileConfigController } from '../modules/profile-config';

export const profileConfigRouter = createTRPCRouter({
  getProfileConfig: profileProcedure.query(({ ctx: { session, profile } }) => {
    return getProfileConfigController(profile?.id, session.user.id);
  }),
});
