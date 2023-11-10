import { createTRPCRouter } from '@/server/api/trpc';

import { contentsRouter } from './routers/contents.router';
import { conversationsRouter } from './routers/conversations.router';
import { feedbacksRouter } from './routers/feedbacks.router';
import { messagesRouter } from './routers/messages.router';
import { profileConfigRouter } from './routers/profile-config.router';
import { profilesRouter } from './routers/profiles.router';
import { servicesRouter } from './routers/services.router';
import { skillsRouter } from './routers/skills.router';
import { usersRouter } from './routers/users.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profiles: profilesRouter,
  profileConfig: profileConfigRouter,
  services: servicesRouter,
  conversations: conversationsRouter,
  messages: messagesRouter,
  feedbacks: feedbacksRouter,
  contents: contentsRouter,
  users: usersRouter,
  skills: skillsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
