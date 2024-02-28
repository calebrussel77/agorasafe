import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';
import {
  throwAuthorizationError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

import { ReviewSelect } from './reviews.select';
import {
  type GetReviewsInfiniteInput,
  type GetReviewsInput,
  type GetUserReviewInput,
  type UpsertReviewInput,
} from './reviews.validations';

export const getUserReview = async ({
  serviceRequestId,
  profileId,
}: GetUserReviewInput & { profileId: string }) => {
  if (!profileId) throw throwAuthorizationError();

  const result = await prisma.review.findFirst({
    where: { serviceRequestId, authorId: profileId },
    select: ReviewSelect,
  });

  if (!result) throw throwNotFoundError();

  return result;
};

export const getReviews = async <TSelect extends Prisma.ReviewSelect>({
  resourceIds,
}: GetReviewsInput & {
  select: TSelect;
  where: Prisma.ReviewWhereInput | undefined;
}) => {
  const orderBy: Prisma.Enumerable<Prisma.ReviewOrderByWithRelationInput> = [];

  orderBy.push({ createdAt: 'asc' });

  return await prisma.review.findMany({
    where: { serviceRequestId: { in: resourceIds } },
    orderBy,
    select: {
      id: true,
      serviceRequestId: true,
      rating: true,
      details: true,
    },
  });
};

export const getReview = async <TSelect extends Prisma.ReviewSelect>({
  where,
  select,
}: {
  select?: TSelect;
  where?: Prisma.ReviewWhereInput | undefined;
}) => {
  return await prisma.review.findFirst({
    where,
    select: select ?? {
      id: true,
      serviceRequestId: true,
      rating: true,
      details: true,
    },
  });
};

export const getReviewsInfinite = async ({
  limit,
  cursor,
  serviceRequestId,
  authorId,
  include = ['serviceRequest'],
  profileSlug,
}: GetReviewsInfiniteInput) => {
  const AND: Prisma.Enumerable<Prisma.ReviewWhereInput> = [];
  const orderBy: Prisma.Enumerable<Prisma.ReviewOrderByWithRelationInput> = [];

  if (profileSlug) {
    const targetUser = await prisma.profile.findUnique({
      where: { slug: profileSlug },
      select: { id: true },
    });

    if (!targetUser) throw new Error('User not found');

    AND.push({
      authorId: {
        not: targetUser.id,
      },
      reviewedProfileId: targetUser.id,
    });
  }

  if (authorId) AND.push({ authorId });

  if (serviceRequestId) AND.push({ serviceRequestId });

  if (!profileSlug) {
    AND.push({ details: { not: null } });
  }

  orderBy.push({ createdAt: 'desc' });

  const items = await prisma.review.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    where: { AND },
    orderBy,
    select: {
      ...ReviewSelect,
      serviceRequest: include?.includes('serviceRequest')
        ? { select: { title: true, photos: true, id: true, slug: true } }
        : undefined,
    },
  });

  let nextCursor: string | undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  return {
    nextCursor,
    items,
  };
};

export const deleteReview = ({ id }: { id: string }) => {
  return prisma.review.delete({ where: { id } });
};

export async function createReview<TSelect extends Prisma.ReviewSelect>(args: {
  data: Prisma.ReviewCreateInput;
  select?: TSelect;
}): Promise<Prisma.ReviewGetPayload<{ select: TSelect }>> {
  const { data, select } = args;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return prisma.review.create({
    data,
    select: select as Prisma.ReviewSelect,
  });
}

export function updateReview({
  data,
  where,
  select = ReviewSelect,
}: {
  where: Prisma.ReviewWhereUniqueInput;
  data: Prisma.ReviewUpdateInput;
  select?: Prisma.ReviewSelect;
}) {
  return prisma.review.update({
    where,
    data: {
      ...data,
    },
    select,
  });
}

export const upsertReview = ({
  profileId,
  ...data
}: UpsertReviewInput & { profileId: string }) => {
  if (!data.id)
    return prisma.review.create({
      data: { ...data, authorId: profileId },
      select: ReviewSelect,
    });
  else
    return prisma.review.update({
      where: { id: data.id },
      data,
      select: { id: true },
    });
};
