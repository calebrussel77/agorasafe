import { Prisma } from '@prisma/client';

import { simpleProfileSelect } from '../profiles';

export const ReviewSelect = Prisma.validator<Prisma.ReviewSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  details: true,
  rating: true,
  isVerified: true,
  isPublic: true,
  serviceRequest: { select: { title: true, id: true, photos: true } },
  reviewedProfile: {
    select: { id: true, name: true, avatar: true, slug: true },
  },
  author: {
    select: simpleProfileSelect,
  },
});

const ReviewModel = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: ReviewSelect,
});

export type ReviewModel = Prisma.ProfileGetPayload<typeof ReviewModel>;
