import { Prisma } from '@prisma/client';

export const simpleProfileSelect = Prisma.validator<Prisma.ProfileSelect>()({
  id: true,
  slug: true,
  avatar: true,
  name: true,
  phone: true,
  user: { select: { id: true, role: true } },
  location: { select: { id: true, name: true, lat: true, long: true } },
  type: true,
  deletedAt: true,
});

const simpleProfile = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: simpleProfileSelect,
});

export type SimpleProfile = Prisma.ProfileGetPayload<typeof simpleProfile>;
