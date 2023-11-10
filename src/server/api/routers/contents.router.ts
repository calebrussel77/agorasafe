import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

import { contentSlugSchema, getContentHandler } from '../modules/contents';

export const contentsRouter = createTRPCRouter({
  get: publicProcedure.input(contentSlugSchema).query(getContentHandler),
});
