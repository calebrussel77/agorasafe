import { Prisma } from '@prisma/client';

import { simpleProfileSelect } from '../profiles';

export const CommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  createdAt: true,
  text: true,
  author: { select: simpleProfileSelect },
});

const commentModel = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: CommentSelect,
});

export type CommentModel = Prisma.ProfileGetPayload<typeof commentModel>;
