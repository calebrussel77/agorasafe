import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export async function createProfileByUserId({
  name,
  slug,
  type,
  user_id,
  ...rest
}: Omit<Prisma.ProfileCreateArgs['data'], 'User'>) {
  const profileCreated = await prisma.profile.create({
    data: {
      name,
      slug,
      type,
      user: {
        connect: { id: user_id },
      },
      ...rest,
    },
  });

  return profileCreated;
}

export async function getProfiles() {
  return await prisma.profile.findMany();
}

export async function getProfileById(profile_id: string) {
  const response = await prisma.profile.findUnique({
    where: { id: profile_id },
    include: {
      user: { select: { location: { select: { id: true, name: true } } } },
    },
  });

  return response;
}

export async function getProfilesByUserId(user_id: string) {
  return await prisma.profile.findMany({
    where: {
      user_id,
    },
    include: {
      user: { select: { location: { select: { id: true, name: true } } } },
    },
  });
}

export async function getProfilesCount() {
  return await prisma.profile.count();
}
