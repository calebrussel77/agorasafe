import { createTRPCRouter } from '@/server/api/trpc';

import { profileConfigRouter } from './routers/profile-config.router';
import { profilesRouter } from './routers/profiles.router';
import { servicesRouter } from './routers/services.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profiles: profilesRouter,
  profileConfig: profileConfigRouter,
  services: servicesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
