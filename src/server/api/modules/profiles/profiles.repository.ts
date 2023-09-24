import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import { simpleProfileSelect } from './profiles.select';

export const getProfileBySlug = (slug: string) => {
  return prisma.profile.findUnique({
    where: { slug },
    select: { slug: true },
  });
};

export function createProfileByUserId({
  userId,
  ...data
}: Omit<Prisma.ProfileCreateInput, 'user'> & { userId: string }) {
  console.log({ data }, 'DATA repository server');

  return prisma.profile.create({
    data: {
      user: { connect: { id: userId } },
      ...data,
    },
  });
}

export async function getProfiles() {
  return prisma.profile.findMany();
}

export async function getProfileById(profileId: string) {
  return prisma.profile.findUnique({
    where: { id: profileId },
    select: simpleProfileSelect,
  });
}

export async function getProfilesByUserId(userId: string) {
  return prisma.profile.findMany({
    where: {
      userId,
    },
    select: simpleProfileSelect,
  });
}

export async function getProfilesWithLocationByUserId(userId: string) {
  return prisma.profile.findMany({
    where: {
      userId,
    },
    select: simpleProfileSelect,
  });
}
