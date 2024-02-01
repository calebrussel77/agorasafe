import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

import { getSkillsHandler } from '../modules/skills';

export const skillsRouter = createTRPCRouter({
  getAll: publicProcedure.query(getSkillsHandler),
});
