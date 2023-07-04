import { exampleRouter } from '@/server/api/routers/example';
import { createTRPCRouter } from '@/server/api/trpc';

import { authRouter } from './routers/auth';
import { profilesRouter } from './routers/profiles';
import { userProfileConfigRouter } from './routers/user-profile-config';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  profiles: profilesRouter,
  userProfileConfig: userProfileConfigRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
