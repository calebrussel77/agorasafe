import { Prisma } from '@prisma/client';

export const simpleProfileSelect = Prisma.validator<Prisma.ProfileSelect>()({
  id: true,
  slug: true,
  avatar: true,
  name: true,
  phone: true,
  user: { select: { id: true, role: true } },
  _count: { select: { receivedReviews: true } },
  location: {
    select: {
      id: true,
      address: true,
      placeId: true,
      lat: true,
      long: true,
    },
  },
  type: true,
  deletedAt: true,
  bannedAt: true,
  isMuted: true,
});

const simpleProfile = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: simpleProfileSelect,
});

export type SimpleProfile = Prisma.ProfileGetPayload<typeof simpleProfile>;
