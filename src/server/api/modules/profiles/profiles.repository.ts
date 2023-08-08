import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export async function createProfileByUserId({
  name,
  slug,
  type,
  userId,
  ...rest
}: Omit<Prisma.ProfileCreateArgs['data'], 'User'>) {
  const profileCreated = await prisma.profile.create({
    data: {
      name,
      slug,
      type,
      user: {
        connect: { id: userId as string },
      },
      ...rest,
    },
  });

  return profileCreated;
}

export async function getProfiles() {
  return await prisma.profile.findMany();
}

export async function getProfileById(profileId: string) {
  const response = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      user: { select: { location: { select: { id: true, name: true } } } },
    },
  });

  return response;
}

export async function getProfilesByUserId(userId: string) {
  return await prisma.profile.findMany({
    where: {
      userId,
    },
    include: {
      user: { select: { location: { select: { id: true, name: true } } } },
    },
  });
}

export async function getProfilesCount() {
  return await prisma.profile.count();
}
