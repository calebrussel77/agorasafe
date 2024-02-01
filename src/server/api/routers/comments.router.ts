import {
  createTRPCRouter,
  middleware,
  profileProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { prisma } from '@/server/db';
import { throwAuthorizationError } from '@/server/utils/error-handling';

import {
  commentConnectorSchema,
  deleteCommentHandler,
  getCommentCountHandler,
  getCommentHandler,
  getCommentsSchema,
  getInfiniteCommentsHandler,
  upsertCommentHandler,
  upsertCommentSchema,
} from '../modules/comments';
import { getByIdQuerySchema } from '../validations/base.validations';

const isOwnerOrAdmin = middleware(async ({ ctx, next, input = {} }) => {
  if (!ctx.user) throw throwAuthorizationError();

  const { id } = input as { id: string };

  const userId = ctx.user.id;
  const isAdmin = ctx?.user.role === 'ADMIN';
  if (!isAdmin && !!id) {
    const ownerId =
      (await prisma.comment.findUnique({ where: { id } }))?.authorId ?? 0;
    if (ownerId !== userId) throw throwAuthorizationError();
  }

  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: ctx.user,
    },
  });
});

export const commentsRouter = createTRPCRouter({
  getInfinite: publicProcedure
    .input(getCommentsSchema)
    .query(getInfiniteCommentsHandler),

  getCount: publicProcedure
    .input(commentConnectorSchema)
    .query(getCommentCountHandler),

  get: publicProcedure.input(getByIdQuerySchema).query(getCommentHandler),

  upsert: profileProcedure
    .input(upsertCommentSchema)
    .use(isOwnerOrAdmin)
    .mutation(upsertCommentHandler),

  delete: profileProcedure
    .input(getByIdQuerySchema)
    .use(isOwnerOrAdmin)
    .mutation(deleteCommentHandler),
});
