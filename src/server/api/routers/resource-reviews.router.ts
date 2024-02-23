import {
  createTRPCRouter,
  middleware,
  profileProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { prisma } from '@/server/db';
import { throwAuthorizationError } from '@/server/utils/error-handling';

import {
  deleteReviewHandler,
  getReviewsInfinite,
  getReviewsInfiniteSchema,
  upsertReviewHandler,
  upsertReviewSchema,
} from '../modules/reviews';
import { getByIdQuerySchema } from '../validations/base.validations';

const isOwnerOrAdmin = middleware(async ({ ctx, next, input = {} }) => {
  if (!ctx.user || !ctx.profile) throw throwAuthorizationError();

  const { id } = input as { id: string };

  const profileId = ctx.profile.id;
  const isAdmin = ctx?.user.role === 'ADMIN';
  if (!isAdmin && !!id) {
    const ownerId =
      (
        await prisma.review.findUnique({
          where: { id },
          select: { authorId: true },
        })
      )?.authorId ?? 0;
    if (ownerId !== profileId) throw throwAuthorizationError();
  }

  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: ctx.user,
      ownerId: profileId,
    },
  });
});

export const reviewsRouter = createTRPCRouter({
  getInfinite: publicProcedure
    .input(getReviewsInfiniteSchema)
    .query(({ input }) => getReviewsInfinite(input)),

  upsert: profileProcedure
    .input(upsertReviewSchema)
    .use(isOwnerOrAdmin)
    .mutation(upsertReviewHandler),

  delete: profileProcedure
    .input(getByIdQuerySchema)
    .use(isOwnerOrAdmin)
    .mutation(deleteReviewHandler),
});
