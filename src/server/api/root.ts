import { createTRPCRouter } from '@/server/api/trpc';

import { authRouter } from './routers/auth.router.';
import { profileConfigRouter } from './routers/profile-config.router';
import { profilesRouter } from './routers/profiles.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  profiles: profilesRouter,
  profileConfig: profileConfigRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
